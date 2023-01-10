import { Button, Divider, Grid, Link, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import { etherScanAddressURL } from "../formatters/etherscan";
import { AddressLookup } from "./address_lookup";
import { NestedContractSelectableList } from "./nested_contract_selectable_list";
import { Contract, ContractTracking } from "@prisma/client";

type ContractTrackingMetadata = {
  fields: Record<string, boolean>;
  type?: string;
  attributionEventName?: string;
  userAddressField?: string;
  valueTransferField?: string;
};
export type ContractTrackingState = Record<
  string,
  ContractTrackingMetadata | null
>;

const makeEmptySelectedObject = (
  functions: Array<{ name: string }>
): ContractTrackingState =>
  functions.reduce((acc: any, item: any) => {
    acc[item.name] = null;
    return acc;
  }, {});

const hydrateSelectedObject = (
  selected: ContractTrackingState,
  data: { contract: Contract & { ContractTrackings: ContractTracking[] } }
) => {
  const contractTrackings = data.contract.ContractTrackings;
  contractTrackings.forEach((contractTracking) => {
    const {
      event,
      type,
      attributionName,
      userAddressField,
      valueTransferField,
    } = contractTracking;
    selected[event] = {
      type,
      attributionEventName: attributionName,
      userAddressField,
      valueTransferField,
      fields: contractTracking.fields.reduce((acc: any, item: any) => {
        acc[item] = true;
        return acc;
      }, {}),
    };
  });

  return selected;
};

const fetchContractDetails = async (address: string) => {
  const response = await fetch(
    `http://localhost:3000/api/contract_abi?address=${address}`
  );
  const data = await response.json();
  const functionsAndEvents = data.abi.filter(
    (item: any) => item.type === "function" || item.type === "event"
  );

  return functionsAndEvents;
};

const fetchContractTracking = async (address: string) => {
  const response = await fetch(
    `http://localhost:3000/api/contract_trackings?address=${address}`
  );
  const data = await response.json();
  return data;
};

const serializeRequestData = (
  contractAddress: string,
  trackingData: ContractTrackingState
) => {
  const contractTrackings = Object.entries(trackingData)
    .filter(([_, metadata]) => !!metadata)
    .map(([name, metadata]) => {
      return {
        name,
        ...metadata,
        fields: Object.keys(metadata?.fields!),
      };
    });
  return {
    contractAddress,
    contractTrackings,
  };
};

export const ContractTracker: React.FC = () => {
  const [address, setAddress] = useState<string>("");
  const [functionsAndEvents, setFunctionsAndEvents] = useState<any[]>([]);
  const [selected, setSelected] = useState<ContractTrackingState>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const functions = functionsAndEvents.filter(
    (item: any) => item.type === "function"
  );
  const events = functionsAndEvents.filter(
    (item: any) => item.type === "event"
  );

  const getContractDetails = async () => {
    const functionsAndEvents = await fetchContractDetails(address);
    const existingContrackTracking = await fetchContractTracking(address);
    const emptySelectedObject = makeEmptySelectedObject(functionsAndEvents);
    setFunctionsAndEvents(functionsAndEvents);
    setSelected(
      hydrateSelectedObject(emptySelectedObject, existingContrackTracking)
    );
  };

  const saveContractTrackings = async () => {
    try {
      setIsSaving(true);
      const data = serializeRequestData(address, selected);
      const response = await fetch(
        "http://localhost:3000/api/contract_trackings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const responseData = await response.json();
      console.log(responseData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleParent = (name: string, type: string) => {
    if (selected[name]) {
      setSelected({ ...selected, [name]: null });
    } else {
      setSelected({
        ...selected,
        [name]: {
          fields: {},
          type,
          attributionEventName: "",
          userAddressField: "",
          valueTransferField: "",
        },
      });
    }
  };

  const toggleChild = (parentName: string, childName: string) => {
    setSelected({
      ...selected,
      [parentName]: {
        ...selected[parentName],
        fields: {
          ...selected[parentName]?.fields,
          [childName]: !selected[parentName]?.fields?.[childName],
        },
      },
    });
  };

  const setFieldMetadata = (parentName: string, metadata: any) => {
    setSelected({
      ...selected,
      [parentName]: { ...selected[parentName], ...metadata },
    });
  };

  return (
    <>
      <AddressLookup
        address={address}
        setAddress={setAddress}
        onSubmit={getContractDetails}
      />

      <Divider sx={{ my: 1 }} />

      {functionsAndEvents.length > 0 && (
        <Typography color="primary" variant="h6">
          Select the events and fields you would like to track for contract{" "}
          <Link
            target={"_blank"}
            rel="noopener noreferrer"
            href={etherScanAddressURL(address)}
          >
            {address}
          </Link>
          .
        </Typography>
      )}

      {events.length > 0 && (
        <NestedContractSelectableList
          items={events}
          title="Contract Events"
          toggleParent={(name) => toggleParent(name, "event")}
          selected={selected}
          toggleChild={toggleChild}
          setMetadata={setFieldMetadata}
        />
      )}

      {functions.length > 0 && (
        <NestedContractSelectableList
          items={functions}
          title="Contract Functions"
          toggleParent={(name) => toggleParent(name, "function")}
          selected={selected}
          toggleChild={toggleChild}
          setMetadata={setFieldMetadata}
        />
      )}

      {functionsAndEvents.length > 0 && (
        <Grid sx={{ m: 1, height: 56 }} columnGap={"1rem"} container={true}>
          <LoadingButton
            loading={isSaving}
            color="primary"
            onClick={() => saveContractTrackings()}
            variant="contained"
          >
            Save
          </LoadingButton>
        </Grid>
      )}
    </>
  );
};
