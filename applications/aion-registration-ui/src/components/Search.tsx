import * as React from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { History } from 'history';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

type OwnProps = {
  searchTerm: string;
  history: History;
  uri: string;
  label: string;
};

const styles = (theme: Theme) => ({
  searchButton: { marginTop: theme.spacing(3) }
});

export type State = {
  searchTerm: string;
};

export type Props = WithStyles<typeof styles> & OwnProps & I18nextProps;

class Search extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { searchTerm } = props;
    this.state = { searchTerm: searchTerm ? decodeURIComponent(searchTerm) : '' };
  }

  handleSearchFormSubmit = () => {
    const { searchTerm } = this.state;

    if (searchTerm) {
      const uri = this.props.uri.replace('%s', encodeURIComponent(searchTerm));
      this.props.history.push(uri);
    }
  };

  handleSearchInputChange = (_: React.ChangeEvent<HTMLInputElement>) => this.setState({ searchTerm: _.target.value });

  onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      this.handleSearchFormSubmit();
    }
  };

  render() {
    const { label, children, classes, t } = this.props;
    const { searchTerm } = this.state;

    return (
      <React.Fragment>
        <GridContainer>
          <Grid item xs={12}>
            <FormControl fullWidth onSubmit={this.handleSearchFormSubmit}>
              <TextField
                label={label}
                value={searchTerm}
                onChange={this.handleSearchInputChange}
                onKeyDown={this.onKeyDown}
                required
                autoFocus
              />
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              color="secondary"
              onClick={this.handleSearchFormSubmit}
              className={classes.searchButton}
              disabled={!searchTerm}
            >
              {t('registration.search.search', 'Search')}
            </Button>
          </Grid>
        </GridContainer>
        {children}
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(withTranslation()(Search));
