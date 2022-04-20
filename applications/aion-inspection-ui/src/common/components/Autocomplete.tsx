import MuiAutocomplete, { AutocompleteProps as MuiAutocompleteProps } from '@material-ui/lab/Autocomplete';
import React, { ChangeEvent, ReactNode } from 'react';
import TextField, { TextFieldProps as MuiTextFieldProps } from '@material-ui/core/TextField';
import { Field, FieldProps, FieldRenderProps } from 'react-final-form';

export type AutocompleteProps<Option, ReturnType> = {
  name: string;
  label: ReactNode;
  helperText?: string;
  required?: boolean;
  getOptionValue?: (option: Option) => ReturnType;
  options: Option[];
  fieldProps?: Partial<FieldProps<ReturnType, any>>;
  textFieldProps?: Partial<MuiTextFieldProps>;
  customOnChange?: (values: Option | null) => void;
} & Partial<Omit<MuiAutocompleteProps<Option, false, boolean, boolean>, 'onChange'>>;

export function Autocomplete<Option, ReturnType>(props: AutocompleteProps<Option, ReturnType>) {
  const { name, fieldProps, ...rest } = props;

  return (
    <Field<ReturnType>
      name={name}
      render={fieldRenderProps => <AutocompleteWrapper<Option, ReturnType> {...fieldRenderProps} {...rest} />}
      {...fieldProps}
    />
  );
}

type AutocompleteWrapperProps<Option, ReturnType> = {
  label: ReactNode;
  required?: boolean;
  textFieldProps?: Partial<MuiTextFieldProps>;
  getOptionValue?: (option: Option) => ReturnType;
  options: Option[];
  helperText?: string;
  customOnChange?: (values: Option) => void;
} & FieldRenderProps<ReturnType, HTMLElement>;

function AutocompleteWrapper<Option, ReturnType>(props: AutocompleteWrapperProps<Option, ReturnType>) {
  const {
    input: { name, onChange, value, ...restInput },
    meta,
    options,
    label,
    required,
    textFieldProps,
    getOptionValue,
    ...rest
  } = props;

  function getValue(value: Option) {
    if (!getOptionValue) {
      return value;
    }

    return value ? getOptionValue(value) : null;
  }

  const { helperText, customOnChange, ...restMuiAutocomplete } = rest;
  const { variant, ...restTextFieldProps } = textFieldProps || {};
  let defaultValue: Option | null = null;

  if (!getOptionValue) {
    defaultValue = value as any;
  } else if (value) {
    options.forEach(option => {
      const optionValue = getOptionValue(option);

      if (value === optionValue) {
        defaultValue = option;
      }
    });
  }

  const onChangeFunc = (_e: ChangeEvent<{}>, value: Option) => {
    onChange(getValue(value));

    if (customOnChange) {
      customOnChange(value);
    }
  };

  const { error, submitError } = meta;
  const isError = ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched;

  return (
    <MuiAutocomplete<Option, false>
      onChange={onChangeFunc}
      options={options}
      value={defaultValue}
      renderInput={params => (
        <TextField
          label={label}
          required={required}
          fullWidth
          helperText={isError ? error || submitError : helperText}
          error={isError}
          name={name}
          variant={variant}
          inputProps={{ required, ...restInput }}
          {...params}
          {...restTextFieldProps}
        />
      )}
      {...restMuiAutocomplete}
    />
  );
}
