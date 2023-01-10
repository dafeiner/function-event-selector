import { Contract, ContractTracking } from "@prisma/client";
import { ContractTrackingState } from "../types";

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
        fields: Object.entries(metadata?.fields!).filter(([_, value]) => Boolean(value)).map(([key]) => key),
      };
    });
  return {
    contractAddress,
    contractTrackings,
  };
};

export const saveContractTracking = async (
  address: string,
  selected: ContractTrackingState
) => {
  const data = serializeRequestData(address, selected);
  return await fetch(`/api/contract_trackings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const fetchContractTracking = async (address: string) => {
  const response = await fetch(
    `/api/contract_trackings?address=${address}`
  );
  const data = await response.json();
  return data;
};

export const makeEmptySelectedObject = (
  functions: Array<{ name: string }>
): ContractTrackingState =>
  functions.reduce((acc: any, item: any) => {
    acc[item.name] = null;
    return acc;
  }, {});

export const hydrateSelectedObject = (
  functions: Array<{ name: string }>,
  data: { contract: Contract & { ContractTrackings: ContractTracking[] } }
) => {
  const selected = makeEmptySelectedObject(functions);
  if (!data.contract) {
    return selected;
  }
  const contractTrackings = data.contract.ContractTrackings;
  contractTrackings.forEach((contractTracking) => {
    const {
      id,
      event,
      type,
      attributionName,
      userAddressField,
      valueTransferField,
    } = contractTracking;
    selected[event] = {
      id,
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
