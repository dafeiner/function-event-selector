import {
  Box,
  Checkbox,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListProps,
} from "@mui/material";

import { Fragment } from "react";

export const SelectableList: React.FC<{
  items: Array<{ name: string }>;
  title?: React.ReactNode;
  collapsible?(item: any): React.ReactNode;
  onSelect(item: { name: string }): void;
  isChecked(item: { name: string }): boolean;
}> = ({ items, onSelect, isChecked, collapsible, title }) => (
  <List>
    {title && <ListItemText>{title}</ListItemText>}
    {items.map((item: any) => (
      <Fragment key={item.name}>
        <ListItem divider={!isChecked(item)}>
          <ListItemButton onClick={() => onSelect(item)} dense>
            <Checkbox
              checked={isChecked(item)}
              inputProps={{ "aria-label": "controlled" }}
              edge="start"
              tabIndex={-1}
              disableRipple
              color="primary"
            />
            <Box>{item.label || item.name}</Box>
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
