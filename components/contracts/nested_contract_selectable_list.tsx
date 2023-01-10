import { Box, Typography } from "@mui/material";
import { SelectableList } from "./selectable_list";
import { TrackingMetadataFields } from "./tracking_metadata_fields";
import { ContractTrackingState } from "./types";

const annotate = (item: any, label: React.ReactNode) => ({
  ...item,
  label: [
    <Box key={`$label_${item.name}`}>
      {item.type}{" "}
      <Typography display="inline" fontWeight="bold" color="primary">
        {item.name || "NO_NAME"}
      </Typography>{" "}
      ({label})
    </Box>,
  ],
});

const combineInputsAndOutputs = (field: any) => {
  const { inputs, outputs } = field;

  return [
    ...(inputs?.map((input: any) => annotate(input, "Input")) || []),
    ...(outputs?.map((output: any) => annotate(output, "Return Value")) || []),
  ];
};

export const NestedContractSelectableList: React.FC<{
  items: any[];
  title: string;
  selected: ContractTrackingState;
  toggleParent(name: string): void;
  toggleChild(parentName: string, childName: string): void;
  setMetadata(parentName: string, metadata: any): void;
}> = ({ items, title, toggleParent, selected, toggleChild, setMetadata }) => (
  <>
    <SelectableList
      title={<Typography fontWeight="bold" color="primary">{title}</Typography>}
      onSelect={(item) => {
        toggleParent(item.name);
      }}
      isChecked={(item) => !!selected[item.name]}
      items={items}
      collapsible={({ name, inputs, outputs }) => {
        const { fields, ...metadata } = selected[name] || {};
        return (
          <>
            <Typography fontWeight="bold" color="primary">Event Metadata</Typography>
            <TrackingMetadataFields metadata={metadata} setMetadata={(metadata) => setMetadata(name, metadata)} />
            <SelectableList
              title={<Typography fontWeight="bold" color="primary">Fields</Typography>}
              items={combineInputsAndOutputs({ inputs, outputs })}
              onSelect={(childItem) => toggleChild(name, childItem.name)}
              isChecked={(childItem) => !!selected[name]?.fields?.[childItem.name]}
            />
          </>
        );
      }}
    />
  </>
);
