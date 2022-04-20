import * as React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Error } from '@pec/aion-ui-components/components/Error';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Option } from '@pec/aion-ui-form/types/autocompleteOption';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { localizeNumber } from '@pec/aion-ui-i18next/helpers/localize';
import { withTranslation } from 'react-i18next';

const styles = (theme: Theme) => ({
  popupFooter: {
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: `${theme.spacing(1.5)}px ${theme.spacing(2)}px`
  }
});

type OwnProps = {
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

  toggleOpen = () => {
    this.setState({ open: !this.state.open });
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

  handleSelect = (_event: React.ChangeEvent, selectedOption: Option | null) => {
    this.props.handleSelect(selectedOption?.value ?? '');
  };

  PaperComponent: React.FC = ({ children, ...props }) => {
    const { loading, hasError, options, total, classes, t } = this.props;
    const { inputValue, searchTerm } = this.state;

    return (
      <Paper {...props}>
        {loading ? (
          <Loading />
        ) : hasError ? (
          <Error />
        ) : (
          <React.Fragment>
            {children}
            {options && total > 0 && options.length < total && inputValue === searchTerm && (
              <Typography align="right" color="textSecondary" variant="body2" className={classes.popupFooter}>
                {t('classes.filters.topResults', {
                  items: localizeNumber(options.length, t),
                  total: localizeNumber(total, t),
                  defaultValue: 'Top {{items}} results of {{total}} total'
                })}
              </Typography>
            )}
          </React.Fragment>
        )}
      </Paper>
    );
  };

  render() {
    const { options, loading, defaultValue, label, t } = this.props;
    const { open, inputValue, searchTerm } = this.state;

    return (
      <Autocomplete<Option>
        open={open}
        options={options || []}
        loading={loading}
        defaultValue={defaultValue[0]}
        onOpen={this.toggleOpen}
        onClose={this.toggleOpen}
        onChange={this.handleSelect}
        onInputChange={this.handleInputChange}
        inputValue={inputValue}
        getOptionLabel={option => option.label}
        getOptionSelected={(option, value) => option.value === value.value}
        noOptionsText={
          searchTerm && searchTerm === inputValue
            ? undefined
            : t('classes.filters.noOptions', 'Type in a name and press Enter')
        }
        PaperComponent={this.PaperComponent}
        renderInput={props => (
          <form onSubmit={this.handleSearch}>
            <TextField {...props} variant="filled" label={label} />
          </form>
        )}
      />
    );
  }
}

export const AutocompleteCreators = withStyles(styles)(withTranslation()(Component));
