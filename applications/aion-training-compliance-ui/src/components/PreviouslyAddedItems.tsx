import * as React from 'react';
import List from '@material-ui/core/List';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { FormHelperText, ListItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  invalidNames: string[];
  typeOfItem: string;
};

const styles = () =>
  createStyles({
    listItem: {
      display: 'list-item',
      listStyleType: 'initial',
      paddingBottom: 0
    }
  });

type Props = WithStyles<typeof styles> & OwnProps;

const PreviouslyAddedItemsComponent: React.SFC<Props> = ({ invalidNames, typeOfItem, classes }) => {
  const { t } = useTranslation();

  return (
    <FormHelperText component="span">
      {t('trainingCompliance.components.itemAlreadyAdded', {
        typeOfItem,
        defaultValue: 'The following {{typeOfItem}} have already been added:'
      })}
      <List component="span">
        {invalidNames.map((item, key) => (
          <ListItem key={key} className={classes.listItem} disableGutters>
            {item}
          </ListItem>
        ))}
      </List>
    </FormHelperText>
  );
};

export const PreviouslyAddedItems = withStyles(styles)(PreviouslyAddedItemsComponent);
