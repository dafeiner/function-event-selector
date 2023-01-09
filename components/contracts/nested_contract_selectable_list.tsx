import { Typography } from "@mui/material";
import { SelectableList } from "./selectable_list";

//
const annotate = (item: any, label: React.ReactNode) => ({
  ...item,
  label: [
    <Typography key={`$label_${item.name}`}>
      {item.type}{" "}
      <Typography display="inline" fontWeight="bold" color="primary">
        {item.name || "NO_NAME"}
      </Typography>{" "}
      ({label})
    </Typography>,
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
  toggleParent(name: string): void;
  selected: Record<string, Record<string, boolean> | null>;
  toggleChild(parentName: string, childName: string): void;
}> = ({ items, title, toggleParent, selected, toggleChild }) => (
  <>
    <SelectableList
      title={<Typography fontWeight="bold" color="primary">{title}</Typography>}
      onSelect={(item) => {
        toggleParent(item.name);
      }}
      isChecked={(item) => !!selected[item.name]}
      items={items}
      collapsible={({ name, inputs, outputs }) => {
        return (
          <>
            <SelectableList
              title={<strong> Fields</strong>}
              items={combineInputsAndOutputs({ inputs, outputs })}
              onSelect={(childItem) => toggleChild(name, childItem.name)}
              isChecked={(childItem) => !!selected[name]?.[childItem.name]}
            />
          </>
        );
      }}
    />
  </>
);
