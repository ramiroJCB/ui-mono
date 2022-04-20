import * as React from 'react';
import { DeepReadonly } from 'utility-types';
import Hidden from '@material-ui/core/Hidden';
import PlaceIcon from '@material-ui/icons/Place';
import Typography from '@material-ui/core/Typography';
import { ISite, SiteStatus } from 'interfaces/site';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  site: DeepReadonly<ISite> | null;
};

type RouteParams = {
  organizationId: string;
  siteId?: string;
};

const styles = (theme: Theme) => ({
  idWorkerPage: {
    display: 'inline-flex',
    alignItems: 'center',
    marginTop: theme.spacing(1.5),
    paddingLeft: theme.spacing(1)
  },
  breadcrumbBold: {
    fontWeight: 600,
    textDecoration: 'none',
    '& p': {
      fontWeight: 600
    },
    '&': {
      color: theme.palette.text.primary
    }
  },
  container: {
    margin: '10px 0px'
  }
});

type Props = WithStyles<typeof styles> & OwnProps;

const SiteHeading: React.FC<Props> = ({ site, classes }) => {
  const { t } = useTranslation();
  return (
    <Switch>
      {site && (
        <Route
          exact
          path="/:organizationId/sites/:siteId"
          render={() => (
            <Hidden smDown>
              <Typography variant="h5" className={classes.idWorkerPage}>
                <PlaceIcon
                  titleAccess={site.status}
                  color={site.status === SiteStatus.Active ? 'secondary' : 'disabled'}
                />
                {site.name}
              </Typography>
            </Hidden>
          )}
        />
      )}
      <Route
        path={['/:organizationId/sites/add', '/:organizationId/sites/:siteId']}
        render={({
          match: {
            params: { siteId, organizationId }
          }
        }: RouteComponentProps<RouteParams>) => (
          <Grid container spacing={1} className={classes.container} direction="row">
            <Grid item>
              <Link to={`/${organizationId}/sites`} className={classes.breadcrumbBold}>
                <Typography>{t('smart.common.sites', 'Sites')}</Typography>
              </Link>
            </Grid>
            <Grid item>
              <Typography className={classes.breadcrumbBold}>{'>'}</Typography>
            </Grid>
            <Grid item>
              <Typography>{!!siteId ? site?.name : t('smart.siteHeading.newSite', 'New Site')}</Typography>
            </Grid>
          </Grid>
        )}
      />
    </Switch>
  );
};

export const SiteHeadingComponent = withStyles(styles)(SiteHeading);
