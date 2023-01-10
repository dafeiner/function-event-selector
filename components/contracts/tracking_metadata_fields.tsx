import { TextField } from "@mui/material";
import { Box } from "@mui/system";

export const TrackingMetadataFields: React.FC<{
  metadata: any;
  setMetadata(value: any): void;
}> = ({
  metadata,
  setMetadata
}) => {
  const { attributionEventName, userAddressField, valueTransferField } = metadata;
  return (
    <Box>
      <TextField
        variant="outlined"
        label="Attribution Event Name"
        placeholder="NFT Mint"
        helperText="The colloquial name of the event for your business."
        name="attributionEventName"
        value={attributionEventName}
        onChange={(e) => setMetadata({ ...metadata, attributionEventName: e.target.value })}
        type="text"
        sx={{ m: 1 }}
      />
      <TextField
        variant="outlined"
        label="User Address Field"
        name="userAddressField"
        helperText="The field to look for the user's address in the event."
        placeholder="'from' or 'to'"
        value={userAddressField}
        onChange={(e) => setMetadata({ ...metadata, userAddressField: e.target.value })}
        type="text"
        sx={{ m: 1 }}
      />
      <TextField
        variant="outlined"
        label="Value Transfer Field"
        helperText="The field to look for the money transferred in the event."
        placeholder="amount"
        name="valueTransferField"
        value={valueTransferField}
        onChange={(e) => setMetadata({ ...metadata, valueTransferField: e.target.value })}
        type="text"
        sx={{ m: 1 }}
      />
    </Box>
  );
};
