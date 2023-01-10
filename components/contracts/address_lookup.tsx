import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  CircularProgress,
  FormLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

export const AddressLookup = ({
  address,
  setAddress,
  onSubmit,
  loading,
  onSave,
  disableSave
}: {
  address: string;
  loading: boolean;
  disableSave: boolean;
  setAddress(address: string): void;
  onSubmit(): void;
  onSave(): void;
}) => (
  <Box>
    <Typography color="primary" variant="h6">
      Enter a verified contract address to track any of its functions:{" "}
    </Typography>
    <Grid justifyContent="space-between" alignItems="stretch" container>
      <Grid item>
        <Grid columnGap={"1rem"} container>
          <TextField
            variant="outlined"
            name="contractAddress"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            type="text"
            placeholder="0x123456..."
          />{" "}
          <LoadingButton
            loading={loading}
            loadingIndicator={<CircularProgress />}
            color="primary"
            onClick={onSubmit}
            variant="contained"
          >
            Go!
          </LoadingButton>
        </Grid>
      </Grid>
      <Grid item alignSelf="stretch">
        <LoadingButton
          disabled={disableSave}
          sx={{ height: "100%" }}
          loading={loading}
          loadingIndicator={<CircularProgress />}
          color="primary"
          onClick={onSave}
          variant="contained"
        >
          Save
        </LoadingButton>
      </Grid>
    </Grid>
  </Box>
);
