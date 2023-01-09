/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";

import { Divider, Typography } from "@mui/material";
import { useState } from "react";
import { AddressLookup } from "./address_lookup";
import { SelectableList } from "./selectable_list";

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

export const Finder: React.FC = () => {
  const [address, setAddress] = useState<string>("");
  const [functionsAndEvents, setFunctionsAndEvents] = useState<any[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const getContractDetails = async () => {
    const functionsAndEvents = await fetchContractDetails(address);
    setFunctionsAndEvents(functionsAndEvents);
    setSelected(makeEmptySelectedObject(functionsAndEvents));
  };

  const select = (name: string) => {
    setSelected({ ...selected, [name]: !selected[name] });
  };

  const functions = functionsAndEvents.filter(
    (item: any) => item.type === "function"
  );
  const events = functionsAndEvents.filter(
    (item: any) => item.type === "event"
  );

  return (
    <>
      <AddressLookup
        address={address}
        setAddress={setAddress}
        onSubmit={getContractDetails}
      />
      <Divider sx={{ m: 1 }} />

      {events.length > 0 && (
        <>
          <Typography color="primary" variant="h5">
            Events
          </Typography>
          <SelectableList
            onSelect={(item) => { select(item.name) }}
            isChecked={(item) => selected[item.name]}
            items={events}
          />
        </>
      )}

      {functions.length > 0 && (
        <>
          <Typography color="primary" variant="h5">
            Functions
          </Typography>
          <SelectableList
            onSelect={(item) => select(item.name)}
            isChecked={(item) => selected[item.name]}
            items={functions}
          />
        </>
      )}
    </>
  );
};
