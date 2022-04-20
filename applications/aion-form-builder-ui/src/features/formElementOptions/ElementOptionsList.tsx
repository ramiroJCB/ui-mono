import React from 'react';
import { ComponentType, IElementOption } from 'interfaces/element';
import { ElementOption } from './ElementOption';
import { List } from '@material-ui/core';

type Props = {
  elementId: string;
  options: IElementOption[];
  componentType: ComponentType;
};

export const ElementOptionsList: React.FC<Props> = ({ elementId, options, componentType }) => {
  const { Checkbox, Radio } = ComponentType;

  const canDeleteOption =
    (componentType === Checkbox && options.length > 1) || (componentType === Radio && options.length > 2);

  return (
    <List>
      {options.map(option => (
        <ElementOption
          elementId={elementId}
          option={option}
          key={option.id}
          componentType={componentType}
          isDeletable={canDeleteOption}
        />
      ))}
    </List>
  );
};
