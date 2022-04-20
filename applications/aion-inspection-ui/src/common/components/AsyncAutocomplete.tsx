import CircularProgress from '@material-ui/core/CircularProgress';
import React, { useState } from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { Autocomplete, AutocompleteProps } from './Autocomplete';
import { AutocompletePaper } from './AutocompletePaper';
import { FieldProps } from 'react-final-form';
import { Option } from '@pec/aion-ui-form/types/autocompleteOption';
import { SerializedError } from '@reduxjs/toolkit';

type Props = {
  label: string;
  name: string;
  options: Option[];
  isFetching: boolean;
  error: SerializedError | null;
  total: number;
  searchTerm?: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string | undefined>>;
  customOnChange?: (values: Option | Option[] | null) => void;
  fieldProps?: Partial<FieldProps<any, any>>;
  textFieldProps?: Partial<TextFieldProps>;
} & AutocompleteProps<Option, string>;

export const AsyncAutocomplete: React.FC<Props> = ({
  label,
  name,
  options,
  isFetching,
  error,
  total,
  searchTerm,
  setSearchTerm,
  customOnChange,
  fieldProps,
  textFieldProps,
  ...rest
}) => {
  const [inputValue, setInputValue] = useState<string>();

  const handleInputChange = (_event: React.ChangeEvent, inputValue: string) => setInputValue(inputValue);

  const handleSearch = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      setSearchTerm(inputValue);
    }
  };

  return (
    <Autocomplete<Option, string>
      {...rest}
      label={label}
      name={name}
      autoHighlight={false}
      getOptionValue={option => option.value}
      getOptionLabel={option => option.label}
      options={options}
      loading={isFetching}
      disablePortal
      fieldProps={fieldProps}
      customOnChange={customOnChange}
      blurOnSelect="touch"
      noOptionsText={searchTerm && searchTerm === inputValue ? undefined : 'Type in a name and press Enter'}
      onInputChange={handleInputChange}
      PaperComponent={params => (
        <AutocompletePaper
          {...params}
          isFetching={isFetching}
          error={error}
          options={options}
          total={total}
          searchTerm={searchTerm}
          inputValue={inputValue}
        />
      )}
      renderInput={params => (
        <TextField
          {...params}
          {...textFieldProps}
          label={label}
          variant="filled"
          onKeyDown={handleSearch}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {isFetching ? <CircularProgress color="inherit" size={16} style={{ marginBottom: 18 }} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            )
          }}
        />
      )}
    />
  );
};
