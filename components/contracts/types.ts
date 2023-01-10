type ContractTrackingMetadata = {
  id?: number;
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
