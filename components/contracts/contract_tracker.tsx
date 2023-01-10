import {
  Button,
  CircularProgress,
  Divider,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import { etherScanAddressURL } from "../formatters/etherscan";
import { AddressLookup } from "./address_lookup";
import { NestedContractSelectableList } from "./nested_contract_selectable_list";
import { ContractTrackingState } from "./types";
import { fetchContractDetails } from "./api/contract_abi";
import {
  fetchContractTracking,
  hydrateSelectedObject,
  saveContractTracking,
} from "./api/contract_trackings";

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
    try {
      setIsSaving(true);
      const functionsAndEvents = await fetchContractDetails(address);
      const existingContractTracking = await fetchContractTracking(address);
      const initialSelectedObject = hydrateSelectedObject(
        functionsAndEvents,
        existingContractTracking
      );
      setFunctionsAndEvents(functionsAndEvents);
      setSelected(initialSelectedObject);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const save = async () => {
    try {
      setIsSaving(true);
      await saveContractTracking(address, selected);
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
        disableSave={functionsAndEvents.length === 0}
        onSave={save}
        loading={isSaving}
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
    </>
  );
};
