import * as React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import { AutocompletePopup } from '@pec/aion-ui-components/components/AutocompletePopup';
import { Option } from '@pec/aion-ui-form/types/autocompleteOption';
import { SerializedError } from '@reduxjs/toolkit';
import { useHistory } from 'react-router-dom';
import { merge } from '@pec/aion-ui-core/helpers/querystring';
import { clearOrganizations } from '../clientOrganizations/slice';
import { useAppDispatch } from 'app/reducer';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

type Props = {
  options?: Option[];
  label: string;
  loading: boolean;
  hasError: SerializedError | null;
  total: number;
  defaultValue?: Option;
};

export const ClientAutocomplete: React.FC<Props> = ({ options, loading, total, hasError, label, defaultValue }) => {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { organizationId } = useParams<{ organizationId: string }>();

  const {
    location: { search }
  } = history;

  const handleInputChange = (_event: React.ChangeEvent, inputValue: string) => setInputValue(inputValue);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setSearchTerm(inputValue);

    history.push({
      search: merge(search, {
        searchTerm: inputValue,
        optionId: ''
      })
    });
  };

  const handleSelect = (_event: React.ChangeEvent, value: Option) => {
    if (value) {
      history.push({
        search: merge(search, {
          optionId: value.value,
          searchTerm: value.label
        })
      });
      dispatch(clearOrganizations());
    } else {
      history.push(`/organizations/${organizationId}/osha-violations/client/information`);
    }
  };

  const PaperComponent: React.FC = props => (
    <AutocompletePopup
      inputValue={inputValue}
      searchTerm={searchTerm}
      loading={loading}
      hasError={!!hasError}
      options={options}
      total={total}
      {...props}
    />
  );

  return (
    <Autocomplete
      size="small"
      open={open}
      options={options || []}
      loading={loading}
      onOpen={() => setOpen(!open)}
      onClose={() => setOpen(!open)}
      onChange={handleSelect}
      onInputChange={handleInputChange}
      inputValue={inputValue}
      defaultValue={defaultValue}
      getOptionLabel={option => option.label}
      getOptionSelected={(option, value) => option.value === value.value}
      noOptionsText={
        searchTerm && searchTerm === inputValue
          ? undefined
          : t('oshaViolations.clientAutocomplete.typeInAName', 'Type in a name and press Enter')
      }
      PaperComponent={PaperComponent}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip variant="outlined" label={option.label} title={option.label} {...getTagProps({ index })} />
        ))
      }
      renderInput={props => (
        <form onSubmit={handleSearch}>
          <TextField {...props} variant="filled" InputLabelProps={{ style: { color: 'inherit' } }} label={label} />
        </form>
      )}
    />
  );
};
