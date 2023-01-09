import {
  Box,
  Button,
  FormLabel,
  Grid,
  TextField,
  Typography,
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
    <Typography color="primary" variant="h6">
      Enter a verified contract address to track any of its functions:{" "}
    </Typography>
    <Grid sx={{ m: 1 }} columnGap={"1rem"} container={true}>
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
