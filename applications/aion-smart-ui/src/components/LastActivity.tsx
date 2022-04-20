import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import { DeepReadonly } from 'utility-types';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IconListItem } from '@pec/aion-ui-components/components/IconListItem';
import { IWorker, WorkerStatus } from 'interfaces/worker';
import { LastUpdate } from './LastUpdate';
import { LivesOnSiteSwitch } from './LivesOnSiteSwitch';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { WorkerIcon } from './WorkerIcon';
import { useTranslation } from 'react-i18next';

const { CheckedIn, CheckedOut, Injured } = WorkerStatus;

type OwnProps = {
  changeStatus: (status: WorkerStatus) => () => Promise<IWorker>;
  toggleLivesOnSite: () => Promise<void>;
  worker: DeepReadonly<IWorker>;
  organizationId: string;
};

const styles = (theme: Theme) => ({
  largeAvatar: {
    width: 70,
    height: 70,
    color: 'white'
  },
  injured: {
    color: theme.palette.error.light
  },
  livesOnSite: {
    color: theme.palette.secondary.light
  },
  titleBar: {
    marginTop: 10
  },
  workerIcon: {
    width: 50,
    height: 50
  },
  reject: {
    color: theme.palette.error.main
  },
  gutters: {
    paddingLeft: 0
  },
  paper: {
    marginTop: theme.spacing(3)
  }
});

type Props = WithStyles<typeof styles> & OwnProps;

const LastActivity: React.FC<Props> = ({ organizationId, classes, worker, changeStatus, toggleLivesOnSite }) => {
  const { employeeId, firstName, lastName, photoUrl, status, lastUpdatedDate, siteId, livesOnSite } = worker;
  const { t } = useTranslation();
  return (
    <Paper className={classes.paper}>
      <GridContainer>
        <Grid item xs={12}>
          <Typography variant="h6">{t('smart.lastActivity.lastActivity', 'Last Activity')}</Typography>
        </Grid>
        <Grid item xs={12}>
          <List component="nav">
            <IconListItem
              to={`/${organizationId}/sites/${siteId}/workers/${employeeId}`}
              className={classes.largeAvatar}
              classes={{ gutters: classes.gutters }}
              photoUrl={photoUrl}
              icon={<WorkerIcon className={classes.workerIcon} />}
              primaryText={`${firstName} ${lastName}`}
            >
              <LastUpdate status={status} lastUpdatedDate={lastUpdatedDate} />
            </IconListItem>
          </List>
        </Grid>
      </GridContainer>
      {worker && (
        <GridContainer direction="row" alignItems="center" justify="center">
          {/* // TODO: Remove undefined check when we have back-end support */}
          {livesOnSite !== undefined && (
            <Grid item xs>
              <LivesOnSiteSwitch livesOnSite={livesOnSite} toggleLivesOnSite={toggleLivesOnSite} />
            </Grid>
          )}
          {worker.status === CheckedIn ? (
            <React.Fragment>
              <Grid item xs>
                <Button variant="contained" className={classes.injured} fullWidth onClick={changeStatus(Injured)}>
                  {t('smart.lastActivity.reportInjured', 'Report Injured')}
                </Button>
              </Grid>
              <Grid item xs>
                <Button variant="contained" color="secondary" fullWidth onClick={changeStatus(CheckedOut)}>
                  {t('smart.common.checkOut', 'Check Out')}
                </Button>
              </Grid>
            </React.Fragment>
          ) : (
            <Grid item xs>
              <Button variant="contained" color="secondary" fullWidth onClick={changeStatus(CheckedIn)}>
                {t('smart.common.checkIn', 'Check In')}
              </Button>
            </Grid>
          )}
        </GridContainer>
      )}
    </Paper>
  );
};
export const LastActivityComponent = withStyles(styles)(LastActivity);
