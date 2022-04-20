import * as React from 'react';
import FormControl, { FormControlProps } from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup, { RadioGroupProps } from '@material-ui/core/RadioGroup';
import { WrappedFieldProps } from 'redux-form';

export type RadioOwnProps = {
  options: { value: string; label: string }[];
};

type RadioProps = RadioGroupProps & FormControlProps & WrappedFieldProps & RadioOwnProps;

export const RadioFieldComponent: React.FC<RadioProps> = ({ classes, meta, input, options, ...props }) => (
  <FormControl>
    <RadioGroup {...input} {...props}>
      {options.map(({ label, value }) => (
        <FormControlLabel key={value} value={value} control={<Radio checked={input.value === value} />} label={label} />
      ))}
    </RadioGroup>
  </FormControl>
);
