import {
  Box,
  Button,
  FormLabel,
  Grid,
  TextField,
} from "@mui/material";

export const AddressLookup = ({
  address,
  setAddress,
  onSubmit,
}: {
  address: string;
  setAddress(address: string): void;
  onSubmit(): void;
}) => (
  <Box>
    <FormLabel color="primary" htmlFor="contractAddress">
      Enter a verified contract address to track any of its functions:{" "}
    </FormLabel>
    <Grid columnGap={"1rem"} container={true}>
      <TextField
        variant="outlined"
        name="contractAddress"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        type="text"
        placeholder="0x123456..."
      />{" "}
      <Button color="primary" onClick={onSubmit} variant="contained">
        Go!
      </Button>
    </Grid>
  </Box>
);
