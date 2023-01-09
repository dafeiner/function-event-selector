import {
  Box,
  Checkbox,
  Collapse,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";

import { Fragment } from "react";

export const SelectableList = ({
  items,
  onSelect,
  isChecked,
  collapsible,
}: {
  items: Array<{ name: string }>;
  collapsible?(item: any): React.ReactNode;
  onSelect(item: { name: string }): void;
  isChecked(item: { name: string }): boolean;
}) => (
  <List>
    {items.map((item: any) => (
      <Fragment key={item.name}>
        <ListItem divider={true}>
          <ListItemButton onClick={() => onSelect(item)} dense>
            <Checkbox
              checked={isChecked(item)}
              inputProps={{ "aria-label": "controlled" }}
              edge="start"
              tabIndex={-1}
              disableRipple
              color="primary"
            />
            <Box>{item.name}</Box>
          </ListItemButton>
        </ListItem>
        {collapsible && (
          <Collapse
            sx={{ pl: 4 }}
            in={isChecked(item)}
            timeout="auto"
            unmountOnExit
          >
            {collapsible(item)}
          </Collapse>
        )}
      </Fragment>
    ))}
  </List>
);
