import React from 'react';
import { addElement, elementsSelectors } from './slice';
import { ComponentType, ComponentTypeDescription, DefaultElementProps } from 'interfaces/element';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { ElementIcon } from './ElementIcon';
import { getDefaultElement } from './helpers';
import { ListItemIcon, ListItemText, MenuItem } from '@material-ui/core';
import { Menu } from '@material-ui/core';
import { useAppDispatch, useTypedSelector } from 'app/reducer';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles(() =>
  createStyles({
    paper: {
      minWidth: 280
    },
    listItem: {
      justifyContent: 'flex-end'
    }
  })
);

type Props = {
  onClose: () => void;
  anchorEl: null | HTMLElement;
};

const componentTypes = Object.values(ComponentType);

export const ElementsMenu: React.FC<Props> = ({ onClose, anchorEl }) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const elements = useTypedSelector(state => elementsSelectors.selectAll(state));

  const { formId, sectionId } = useParams<{
    formId: string;
    sectionId: string;
  }>();

  const addFormElement = async (componentType: ComponentType) => {
    const defaultElement: DefaultElementProps = {
      ...getDefaultElement(componentType),
      component: componentType,
      title: `Element ${elements.length + 1}`,
      formId,
      sectionId
    };

    onClose();
    await dispatch(addElement(defaultElement));
  };

  return (
    <Menu
      id="add-elements-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={onClose}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 78 }}
      classes={{ paper: classes.paper }}
    >
      {componentTypes.map(componentType => (
        <MenuItem key={componentType} onClick={() => addFormElement(componentType)} divider>
          <ListItemText>{ComponentTypeDescription.get(componentType)}</ListItemText>
          <ListItemIcon classes={{ root: classes.listItem }}>
            <ElementIcon variant={componentType} />
          </ListItemIcon>
        </MenuItem>
      ))}
    </Menu>
  );
};
