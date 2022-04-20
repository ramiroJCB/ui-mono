import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { SearchContractorsBreadcrumbsContainer } from '../containers/SearchContractorsBreadcrumbsContainer';
import { SearchContractorsFormContainer } from '../containers/SearchContractorsForm';
import { SearchResultsContainer } from '../containers/SearchResults';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) => ({
  paper: {
    minHeight: 150,
    padding: theme.spacing(4),
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    fontWeight: 500,
    marginBottom: theme.spacing(4)
  }
});

type Props = WithStyles<typeof styles>;

const SearchContractors: React.FC<Props> = ({ classes }) => (
  <GridContainer spacing={5}>
    <Grid item xs={12} style={{ paddingBottom: 10 }}>
      <SearchContractorsBreadcrumbsContainer />
    </Grid>
    <Grid item xs={12} style={{ paddingTop: 0 }}>
      <Paper className={classes.paper}>
        <Grid container direction="row" justify="space-between">
          <Grid item xs={12}>
            <Typography variant="h4" className={classes.title}>
              Search Contractor Community
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <SearchContractorsFormContainer />
          </Grid>
        </Grid>
      </Paper>
    </Grid>
    <SearchResultsContainer />
  </GridContainer>
);

export const SearchContractorsComponent = withStyles(styles)(SearchContractors);
