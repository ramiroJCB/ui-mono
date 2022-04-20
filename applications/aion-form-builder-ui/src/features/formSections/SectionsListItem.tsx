import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { IconButton, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import { ISection } from '../../interfaces/section';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    primaryText: {
      color: theme.palette.primary.main,
      fontWeight: 500,
      fontSize: 16
    }
  })
);

type Props = {
  section: ISection;
  selected: boolean;
  handleListItemClick: () => void;
};

export const SectionsListItem: React.FC<Props> = ({ section, selected, handleListItemClick }) => {
  const classes = useStyles();
  const sectionName = `${section.sortOrder}. ${section.name}`;

  return (
    <ListItem
      button
      selected={selected}
      onClick={handleListItemClick}
      style={selected ? { backgroundColor: '#006E9610' } : undefined}
      divider
    >
      <ListItemText primary={sectionName} classes={{ primary: classes.primaryText }} />
      <ListItemSecondaryAction>
        <IconButton edge="end">
          <ChevronRightIcon color="action" />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
