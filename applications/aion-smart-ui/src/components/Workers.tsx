import * as React from 'react';
import CheckedInIcon from '@material-ui/icons/WhereToVote';
import Grid from '@material-ui/core/Grid';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import LivesOnSiteIcon from '@material-ui/icons/Hotel';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import withWidth, { isWidthUp, WithWidth } from '@material-ui/core/withWidth';
import { capitalizeFirstLetter } from '@pec/aion-ui-core/helpers/string';
import { DeepReadonly } from 'utility-types';
import { FloatingActionButton } from '@pec/aion-ui-components/components/FloatingActionButton';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IconListItem } from '@pec/aion-ui-components/components/IconListItem';
import { IdentifyWorkerIcon } from './IdentifyWorkerIcon';
import { ISite } from 'interfaces/site';
import { IWorker, WorkerStatus } from 'interfaces/worker';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { WorkerIcon } from './WorkerIcon';
import { useTranslation } from 'react-i18next';
import { localizeRelativeTime } from '@pec/aion-ui-i18next/helpers/localize';
import { formats } from '@pec/aion-ui-i18next/constants';
import { localizeNumber } from '@pec/aion-ui-i18next/helpers/localize';

type OwnProps = {
  site: DeepReadonly<ISite>;
  workers: DeepReadonly<IWorker[]>;
};

const styles = (theme: Theme) => ({
  statusAvatar: {
    width: 30,
    height: 30,
    color: theme.palette.secondary.main
  },
  list: {
    [theme.breakpoints.down('sm')]: {
      paddingTop: 0
    }
  }
});

type Props = WithStyles<typeof styles> & WithWidth & OwnProps;

const Workers: React.FC<Props> = ({ site, workers, width, classes }) => {
  const { t } = useTranslation();
  const { organizationId, id: siteId } = site;
  return (
    <React.Fragment>
      <Hidden mdDown>
        <GridContainer>
          <Grid item xs={12}>
            <Typography variant="h6">
              {t('smart.workersCount', {
                count: workers.length,
                defaultValue_plural: '{{count}} Workers on Site',
                defaultValue: '{{count}} Worker on Site'
              }).replace(workers.length.toString(), localizeNumber(workers.length, t))}
            </Typography>
          </Grid>
        </GridContainer>
      </Hidden>
      <GridContainer spacing={isWidthUp('md', width) ? undefined : 0}>
        <Grid item xs={12}>
          <List component="nav" className={classes.list}>
            {workers.length > 0 ? (
              workers.map(
                ({
                  id,
                  lastUpdatedDate,
                  employeeId,
                  firstName,
                  lastName,
                  organizationName,
                  photoUrl,
                  livesOnSite,
                  status
                }) => (
                  <IconListItem
                    key={id}
                    to={`/${organizationId}/sites/${siteId}/workers/${employeeId}`}
                    photoUrl={photoUrl}
                    icon={<WorkerIcon />}
                    primaryText={`${firstName} ${lastName}`}
                    secondaryAction={
                      <React.Fragment>
                        {status === WorkerStatus.CheckedIn && (
                          <Tooltip placement="left-end" title={t('smart.workers.checkedIn', 'Checked In') || ''}>
                            <CheckedInIcon className={classes.statusAvatar} />
                          </Tooltip>
                        )}
                        {livesOnSite && (
                          <Tooltip placement="left-end" title={t('smart.workers.livesOnSite', 'Lives On Site') || ''}>
                            <LivesOnSiteIcon className={classes.statusAvatar} />
                          </Tooltip>
                        )}
                      </React.Fragment>
                    }
                  >
                    {lastUpdatedDate
                      ? capitalizeFirstLetter(
                          localizeRelativeTime(lastUpdatedDate, t, formats.relativeShort) +
                            (organizationName ? ` / ${organizationName}` : '')
                        )
                      : undefined}
                  </IconListItem>
                )
              )
            ) : (
              <IconListItem
                icon={<HelpOutlineIcon />}
                primaryText={t('smart.workers.checkInWorkers', 'Check-In Workers')}
              >
                {isWidthUp('md', width)
                  ? t('smart.workers.useTheForm', 'Use the form to the left to start checking in workers.')
                  : t('smart.workers.useTheButton', 'Use the button in the bottom right to start checking in workers.')}
              </IconListItem>
            )}
          </List>
          <Hidden mdUp>
            <FloatingActionButton
              to={`/${organizationId}/sites/${siteId}`}
              icon={<IdentifyWorkerIcon />}
              label={t('smart.workers.identifyAWorker', 'Identify a Worker')}
            />
          </Hidden>
        </Grid>
      </GridContainer>
    </React.Fragment>
  );
};

export const WorkersComponent = withWidth()(withStyles(styles)(Workers));
