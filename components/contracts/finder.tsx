/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";

import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormLabel,
  Grid,
  List,
  ListItem,
  ListItemButton,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

const makeEmptySelectedObject = (functions: Array<{ name: string }>) =>
  functions.reduce((acc: any, item: any) => {
    acc[item.name] = false;
    return acc;
  }, {});

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

const AddressLookup = ({
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

export const Finder: React.FC = () => {
  const [address, setAddress] = useState<string>("");
  const [functionsAndEvents, setFunctionsAndEvents] = useState<any[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const getContractDetails = async () => {
    const functionsAndEvents = await fetchContractDetails(address);
    setFunctionsAndEvents(functionsAndEvents);
    setSelected(makeEmptySelectedObject(functionsAndEvents));
  };

  const select = (name: string) => () => {
    setSelected({ ...selected, [name]: !selected[name] });
  };

  const functions = functionsAndEvents.filter(
    (item: any) => item.type === "function"
  );
  const events = functionsAndEvents.filter(
    (item: any) => item.type === "event"
  );

  const SelectableList = ({ items }: { items: any[] }) => (
    <List>
      {items.map((item: any) => (
        <ListItem key={item.name} divider={true}>
          <ListItemButton onClick={select(item.name)} dense>
            <Checkbox
              checked={selected[item.name]}
              inputProps={{ "aria-label": "controlled" }}
              edge="start"
              tabIndex={-1}
              disableRipple
              color="primary"
            />
            <Box>{item.name}</Box>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <>
      <AddressLookup address={address} setAddress={setAddress} onSubmit={getContractDetails} />
      <Divider sx={{ m: 1 }} />

      {events.length > 0 && (
        <>
          <Typography color="primary" variant="h5">
            Events
          </Typography>
          <SelectableList items={events} />
        </>
      )}

      {functions.length > 0 && (
        <>
          <Typography color="primary" variant="h5">
            Functions
          </Typography>
          <SelectableList items={functions} />
        </>
      )}
    </>
  );
};
