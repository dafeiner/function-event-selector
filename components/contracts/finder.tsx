import { Divider, Typography } from "@mui/material";
import { useState } from "react";
import { AddressLookup } from "./address_lookup";
import { SelectableList } from "./selectable_list";

const makeEmptySelectedObject = (
  functions: Array<{ name: string }>
): Record<string, Record<string, boolean> | null> =>
  functions.reduce((acc: any, item: any) => {
    acc[item.name] = null;
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

const NestedContractSelectableList: React.FC<{
  items: any[];
  title: string;
  toggleParent(name: string): void;
  selected: Record<string, Record<string, boolean> | null>;
  toggleChild(parentName: string, childName: string): void;
}> = ({ items, title, toggleParent, selected, toggleChild }) => (
  <>
    <Typography color="primary" variant="h5">
      {title}
    </Typography>
    <SelectableList
      onSelect={(item) => {
        toggleParent(item.name);
      }}
      isChecked={(item) => !!selected[item.name]}
      items={items}
      collapsible={(parentItem) => (
        <SelectableList
          items={parentItem.inputs}
          onSelect={(childItem) => toggleChild(parentItem.name, childItem.name)}
          isChecked={(childItem) =>
            !!selected[parentItem.name]?.[childItem.name]
          }
        />
      )}
    />
  </>
);

export const Finder: React.FC = () => {
  const [address, setAddress] = useState<string>("");
  const [functionsAndEvents, setFunctionsAndEvents] = useState<any[]>([]);
  const [selected, setSelected] = useState<
    Record<string, Record<string, boolean> | null>
  >({});

  const getContractDetails = async () => {
    const functionsAndEvents = await fetchContractDetails(address);
    setFunctionsAndEvents(functionsAndEvents);
    setSelected(makeEmptySelectedObject(functionsAndEvents));
  };

  const toggleParent = (name: string) => {
    if (selected[name]) {
      setSelected({ ...selected, [name]: null });
    } else {
      setSelected({ ...selected, [name]: {} });
    }
  };

  const toggleChild = (parentName: string, childName: string) => {
    setSelected({
      ...selected,
      [parentName]: {
        ...selected[parentName],
        [childName]: !selected[parentName]?.[childName],
      },
    });
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
        <NestedContractSelectableList
          items={events}
          title="Events"
          toggleParent={toggleParent}
          selected={selected}
          toggleChild={toggleChild}
        />
      )}

      {functions.length > 0 && (
        <NestedContractSelectableList
          items={functions}
          title="Functions"
          toggleParent={toggleParent}
          selected={selected}
          toggleChild={toggleChild}
        />
      )}
    </>
  );
};
