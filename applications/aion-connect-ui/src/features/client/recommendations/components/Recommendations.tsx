import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withWidth, { isWidthUp, WithWidth } from '@material-ui/core/withWidth';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Link } from '@pec/aion-ui-components/components/Link';
import { RouteComponentProps, withRouter } from 'react-router-dom';

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      minHeight: 150,
      padding: theme.spacing(4),
      display: 'flex',
      alignItems: 'center'
    },
    title: {
      fontWeight: 500,
      marginBottom: theme.spacing(2)
    },
    button: {
      textAlign: 'right'
    }
  });

type RouteParams = {
  organizationId: string;
};

type Props = WithStyles<typeof styles> & WithWidth & RouteComponentProps<RouteParams>;

const Recommendations: React.FC<Props> = ({
  classes,
  width,
  match: {
    params: { organizationId }
  }
}) => (
  <GridContainer spacing={5}>
    <Grid item xs={12}>
      <Paper className={classes.paper}>
        <Grid container direction="row" justify="space-between">
          <Grid item xs={12} md={10}>
            <Typography variant="h4" className={classes.title}>
              Contractors
            </Typography>
          </Grid>
          <Grid item xs={12} md={2} className={classes.button}>
            <Button
              variant="contained"
              color="primary"
              fullWidth={!isWidthUp('md', width)}
              component={Link}
              to={`/${organizationId}/connect/search-contractors`}
            >
              Search Contractors
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  </GridContainer>
);

export const RecommendationsComponent = withRouter(withWidth()(withStyles(styles)(Recommendations)));
