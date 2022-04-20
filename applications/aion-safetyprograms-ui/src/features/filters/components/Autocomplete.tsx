import * as React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import { AutocompletePopup } from './AutocompletePopup';
import { Option } from '@pec/aion-ui-form/types/autocompleteOption';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

// https://github.com/mui-org/material-ui/issues/18514 is generating an
// irrelevant warning, and the current workaround would make search results
// inaccurate. Dan thinks we should live with the warning.

const styles = (theme: Theme) => ({
  popupFooter: {
    borderTop: `1px solid ${theme.palette.divider}`,
    // Matches hard-coded values of popup list items
    padding: '6px 16px'
  }
});

type OwnProps = {
  open: boolean;
  options?: Option[];
  defaultValue: Option[];
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

  handleSelect = (_event: React.ChangeEvent, options: Option[]) => {
    this.props.handleSelect(options.map(({ value }) => value).toString());
  };

  componentDidUpdate(prevProps: Props) {
    // Close the popup when the drawer is closed
    if (prevProps.open && !this.props.open) {
      this.close();
    }
  }

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
    const { options, loading, defaultValue, label, t } = this.props;
    const { open, inputValue, searchTerm } = this.state;

    return (
      <Autocomplete<Option, true>
        multiple
        size="small"
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
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip variant="outlined" label={option.label} title={option.label} {...getTagProps({ index })} />
          ))
        }
        renderInput={props => (
          <form onSubmit={this.handleSearch}>
            <TextField {...props} variant="filled" InputLabelProps={{ style: { color: 'inherit' } }} label={label} />
          </form>
        )}
      />
    );
  }
}

export const FiltersAutocomplete = withStyles(styles)(withTranslation()(Component));
