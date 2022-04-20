import * as React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
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

// https://github.com/mui-org/material-ui/issues/18514 is generating an
// irrelevant warning, and the current workaround would make search results
// inaccurate. Dan thinks we should live with the warning.

const styles = (theme: Theme) => ({
  popupFooter: {
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: `${theme.spacing(1.5)}px ${theme.spacing(2)}px`
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

  handleSelect = (_event: React.ChangeEvent, value: Option[]) => {
    this.props.handleSelect(value.map(({ value }) => value).toString());
  };

  componentDidUpdate(prevProps: Props) {
    // Close the popup when the drawer is closed
    if (prevProps.open && !this.props.open) {
      this.close();
    }
  }

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

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    return (
      <Autocomplete<Option, true>
        multiple
        size="small"
        open={open}
        options={options || []}
        limitTags={5}
        loading={loading}
        defaultValue={defaultValue}
        disableCloseOnSelect
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
            : t('classes.filters.noOptions', 'Type in a name and press Enter')
        }
        PaperComponent={this.PaperComponent}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip variant="outlined" label={option.label} title={option.label} {...getTagProps({ index })} />
          ))
        }
        renderOption={(option, { selected }) => (
          <React.Fragment>
            <Checkbox icon={icon} edge="start" checkedIcon={checkedIcon} checked={selected} />
            <Typography variant="body2" title={option.label} noWrap>
              {option.label}
            </Typography>
          </React.Fragment>
        )}
        renderInput={props => (
          <form onSubmit={this.handleSearch}>
            <TextField {...props} variant="filled" label={label} />
          </form>
        )}
      />
    );
  }
}

export const FiltersAutocomplete = withStyles(styles)(withTranslation()(Component));
