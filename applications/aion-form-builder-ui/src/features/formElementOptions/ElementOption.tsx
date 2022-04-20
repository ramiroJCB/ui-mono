import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CloseIcon from '@material-ui/icons/Close';
import InputAdornment from '@material-ui/core/InputAdornment';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import React, { useEffect, useState, useRef } from 'react';
import { ComponentType, IElementOption } from 'interfaces/element';
import { deleteElementOption, updateElementOption } from './slice';
import { IconButton, Input, ListItem, ListItemIcon } from '@material-ui/core';
import { useAppDispatch } from 'app/reducer';
import useDebouncedValue from 'common/hooks/useDebouncedValue';

type Props = {
  elementId: string;
  option: IElementOption;
  componentType: ComponentType;
  isDeletable: boolean;
};

export const ElementOption: React.FC<Props> = ({ elementId, option, componentType, isDeletable }) => {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState(option.label);
  const [focused, setFocused] = useState(false);
  const debouncedInput = useDebouncedValue(value, 1000);
  const isInitialMount = useRef(true);

  useEffect(() => {
    isInitialMount.current
      ? (isInitialMount.current = false)
      : dispatch(updateElementOption({ id: option.id, label: debouncedInput, elementId }));
  }, [dispatch, option.id, debouncedInput, elementId]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value);
  const toggleFocus = () => setFocused(!focused);
  const handleDelete = async () => await dispatch(deleteElementOption(option.id));
  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();

  return (
    <ListItem dense disableGutters>
      <ListItemIcon style={{ minWidth: 32 }}>
        {componentType === ComponentType.Radio ? <RadioButtonUncheckedIcon /> : <CheckBoxOutlineBlankIcon />}
      </ListItemIcon>
      <Input
        value={value}
        required
        fullWidth
        disableUnderline={!focused}
        onChange={handleChange}
        onFocus={toggleFocus}
        onBlur={toggleFocus}
        endAdornment={
          focused && isDeletable ? (
            <InputAdornment position="end">
              <IconButton edge="end" onClick={handleDelete} onMouseDown={handleMouseDown}>
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          ) : (
            undefined
          )
        }
      />
    </ListItem>
  );
};
