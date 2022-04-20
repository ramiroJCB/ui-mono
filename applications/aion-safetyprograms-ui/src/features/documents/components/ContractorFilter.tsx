import * as React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FilterListIcon from '@material-ui/icons/FilterList';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { AutocompletePopup } from 'features/filters/components/AutocompletePopup';
import { Option } from '@pec/aion-ui-form/types/autocompleteOption';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

// https://github.com/mui-org/material-ui/issues/18514 is generating an
// irrelevant warning, and the current workaround would make search results
// inaccurate. Dan thinks we should live with the warning.

const styles = {
  autocomplete: {
    // Matches the rendered width of the Search File Name component
    minWidth: 278
  }
};

type OwnProps = {
  options?: Option[];
  defaultValue?: Option;
  label: string;
  loading: boolean;
  hasError: boolean;
  total: number;
  handleSelect: (ids: string) => void;
  handleSearch: (searchTerm: string) => void;
};

type Props = WithStyles<typeof styles> & OwnProps & I18nextProps;

type State = {
  open: boolean;
  inputValue: string;
  searchTerm: string;
};

class Component extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
      inputValue: '',
      searchTerm: ''
    };
  }

  close = () => {
    this.setState({ open: false });
  };

  open = () => {
    this.setState({ open: true });
  };

  handleInputChange = (_event: React.ChangeEvent, inputValue: string) => {
    this.setState({ inputValue });
  };

  handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    this.setState(
      state => ({
        searchTerm: state.inputValue
      }),
      () => {
        this.props.handleSearch(this.state.searchTerm);
      }
    );
  };

  handleSelect = (_event: React.ChangeEvent, option: Option | null) => {
    this.props.handleSelect(option?.value || '');
  };

  PaperComponent: React.FC = props => {
    const { loading, hasError, options, total } = this.props;
    const { inputValue, searchTerm } = this.state;

    return (
      <AutocompletePopup
        inputValue={inputValue}
        searchTerm={searchTerm}
        loading={loading}
        hasError={hasError}
        options={options}
        total={total}
        {...props}
      />
    );
  };

  render() {
    const { options, loading, defaultValue, label, classes, t } = this.props;
    const { open, inputValue, searchTerm } = this.state;

    return (
      <Autocomplete<Option>
        className={classes.autocomplete}
        open={open}
        options={options || []}
        loading={loading}
        defaultValue={defaultValue}
        onOpen={this.open}
        onClose={this.close}
        onChange={this.handleSelect}
        onInputChange={this.handleInputChange}
        inputValue={inputValue}
        getOptionLabel={option => option.label}
        getOptionSelected={(option, value) => option.value === value.value}
        noOptionsText={
          searchTerm && searchTerm === inputValue
            ? undefined
            : t('safetyPrograms.common.typeName', 'Type in a name and press Enter')
        }
        PaperComponent={this.PaperComponent}
        renderInput={({ InputLabelProps, InputProps, ...props }) => (
          <form onSubmit={this.handleSearch}>
            <TextField
              {...props}
              InputLabelProps={{
                ...InputLabelProps,
                shrink: true
              }}
              InputProps={{
                ...InputProps,
                startAdornment: (
                  <InputAdornment position="start" style={{ marginTop: 0 }}>
                    <IconButton disabled={loading} type="submit">
                      <FilterListIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              variant="filled"
              label={label}
            />
          </form>
        )}
      />
    );
  }
}

export const ContractorFilterComponent = withStyles(styles)(withTranslation()(Component));
