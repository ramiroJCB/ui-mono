import * as React from 'react';
import BuildIcon from '@material-ui/icons/Build';
import Button from '@material-ui/core/Button';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import LaunchIcon from '@material-ui/icons/Launch';
import List from '@material-ui/core/List';
import LivesOnSiteIcon from '@material-ui/icons/Hotel';
import PhoneIcon from '@material-ui/icons/Phone';
import Switch from '@material-ui/core/Switch';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import WarningIcon from '@material-ui/icons/Warning';
import withWidth, { isWidthUp, WithWidth } from '@material-ui/core/withWidth';
import { DeepReadonly } from 'utility-types';
import { Dialog } from '@pec/aion-ui-components/components/Dialog';
import { FloatingActionButton } from '@pec/aion-ui-components/components/FloatingActionButton';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { History } from 'history';
import { IconListItem } from '@pec/aion-ui-components/components/IconListItem';
import { IEmployeeTrainingRequirement } from 'interfaces/employeeTrainingRequirement';
import { IOverallRanking } from '@pec/aion-ui-core/interfaces/ranking';
import { IWorker, WorkerStatus } from 'interfaces/worker';
import { LastUpdate } from './LastUpdate';
import { Photo } from './Photo';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { WorkerIcon } from './WorkerIcon';
import { useTranslation } from 'react-i18next';

const { CheckedIn, CheckedOut, Injured, Rejected } = WorkerStatus;

type OwnProps = {
  worker: IWorker;
  trainingRequirements: DeepReadonly<IEmployeeTrainingRequirement[]>;
  overallRanking?: IOverallRanking | null;
  changeStatus: (status: WorkerStatus) => () => Promise<IWorker>;
  toggleLivesOnSite: () => Promise<void>;
  organizationId: string;
  siteId: string;
  history: History;
  showBackButton: boolean;
  isStepOne: boolean;
  handleStepChange: () => void;
  handleClose: () => void;
  handleWorkGroupClick: (id: string, name: string, firstName: string, lastName: string) => () => void;
  workgroups:
    | {
        id: string;
        name: string | undefined;
        isCompliant: boolean;
      }[]
    | null;
};

const styles = (theme: Theme) => ({
  good: {
    backgroundColor: theme.palette.secondary.main
  },
  bad: {
    backgroundColor: theme.palette.error.main
  },
  reject: {
    color: theme.palette.error.main
  },
  injured: {
    color: theme.palette.error.light
  },
  checkOut: {
    marginTop: theme.spacing(1)
  },
  backToSearch: {
    color: theme.palette.text.primary
  },
  livesOnSiteSwitch: {
    marginRight: -30
  }
});

type Props = WithStyles<typeof styles> & WithWidth & OwnProps;

const Worker: React.FC<Props> = ({
  worker,
  trainingRequirements,
  overallRanking,
  changeStatus,
  toggleLivesOnSite,
  organizationId,
  siteId,
  classes,
  width,
  history,
  showBackButton,
  isStepOne,
  handleStepChange,
  handleClose,
  workgroups,
  handleWorkGroupClick
}) => {
  const {
    organizationId: contractorId,
    organizationName: contractorName,
    firstName,
    lastName,
    mobilePhoneNumber: phoneNumber,
    photoUrl,
    pecIdentifier,
    lastUpdatedDate,
    livesOnSite,
    status
  } = worker;
  const { t } = useTranslation();
  return (
    <GridContainer spacing={isWidthUp('md', width) ? undefined : 0}>
      <Grid item xs={12} sm={6} md={5} lg={6}>
        <Photo icon={WorkerIcon} photoUrl={photoUrl} primaryText={`${firstName} ${lastName}`}>
          <LastUpdate status={status} lastUpdatedDate={lastUpdatedDate} />
        </Photo>
        {worker.status === CheckedIn ? (
          <Dialog
            onExited={handleClose}
            renderTriggerButton={props =>
              isWidthUp('md', width) ? (
                <Button className={classes.checkOut} variant="contained" color="secondary" fullWidth {...props}>
                  {t('smart.common.checkOut', 'Check Out')}
                </Button>
              ) : (
                <FloatingActionButton
                  icon={<LaunchIcon />}
                  label={t('smart.worker.checkOutWorker', 'Check Out Worker')}
                  {...props}
                />
              )
            }
            onConfirm={isStepOne ? changeStatus(CheckedOut) : changeStatus(Injured)}
          >
            {({ handleClose, handleConfirm }) =>
              isStepOne ? (
                <React.Fragment>
                  <DialogContent>
                    <DialogContentText>
                      {t('smart.worker.wasThisWorkerInjured', 'Was this worker injured since checking in?')}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button color="primary" onClick={handleClose}>
                      {t('smart.common.cancel', 'Cancel')}
                    </Button>
                    <Button className={classes.injured} onClick={handleStepChange}>
                      {t('smart.worker.yesReportAsInjured', 'Yes, report as injured')}
                    </Button>
                    <Button color="secondary" onClick={handleConfirm}>
                      {t('smart.worker.noCheckOut', 'No, check out')}
                    </Button>
                  </DialogActions>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <DialogContent>
                    <DialogContentText>
                      {t('smart.worker.pleaseConfirm', 'Please confirm this worker was injured on location.')}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button color="primary" onClick={handleClose}>
                      {t('smart.common.cancel', 'Cancel')}
                    </Button>
                    <Button className={classes.injured} onClick={handleConfirm}>
                      {t('smart.worker.confirmInjury', 'Confirm Injury')}
                    </Button>
                    <Button color="secondary" onClick={handleStepChange}>
                      {t('smart.common.goBack', 'Go Back')}
                    </Button>
                  </DialogActions>
                </React.Fragment>
              )
            }
          </Dialog>
        ) : (
          <GridContainer>
            <Grid item xs={12} sm={6} lg={12} xl={6}>
              <Button variant="contained" color="secondary" fullWidth onClick={changeStatus(CheckedIn)}>
                {t('smart.common.checkIn', 'Check In')}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} lg={12} xl={6}>
              <Button className={classes.reject} fullWidth onClick={changeStatus(Rejected)}>
                {t('smart.worker.reject', 'Reject')}
              </Button>
            </Grid>
            {showBackButton && (
              <Grid item xs={12}>
                <Button variant="contained" className={classes.backToSearch} fullWidth onClick={() => history.goBack()}>
                  {t('smart.worker.backToSearch', 'Back to Search')}
                </Button>
              </Grid>
            )}
          </GridContainer>
        )}
      </Grid>
      <Grid item xs={12} sm={6} md={7} lg={6}>
        <GridContainer spacing={0}>
          <Grid item xs={12}>
            <List component="nav">
              {/* // TODO: Remove undefined check when we have back-end support */}
              {livesOnSite !== undefined && (
                <IconListItem
                  className={livesOnSite ? classes.good : undefined}
                  icon={<LivesOnSiteIcon />}
                  primaryText={t('smart.worker.livesOnSite', 'Lives On Site')}
                  secondaryAction={
                    <Switch
                      value={livesOnSite.toString()}
                      onChange={toggleLivesOnSite}
                      checked={livesOnSite}
                      className={isWidthUp('lg', width) ? classes.livesOnSiteSwitch : undefined}
                    />
                  }
                />
              )}
              {workgroups && workgroups.length > 0 ? (
                workgroups.map(({ name = '', isCompliant, id }) => (
                  <IconListItem
                    key={name}
                    onClick={handleWorkGroupClick(id, name, firstName, lastName)}
                    icon={isCompliant ? <VerifiedUserIcon /> : <WarningIcon />}
                    primaryText={name}
                    className={isCompliant ? classes.good : classes.bad}
                  >
                    {isCompliant
                      ? t('smart.common.compliant', 'Compliant')
                      : t('smart.common.noncompliant', 'Noncompliant')}
                  </IconListItem>
                ))
              ) : trainingRequirements.length > 0 ? (
                trainingRequirements.map(({ name }) => (
                  <IconListItem key={name} icon={<VerifiedUserIcon />} primaryText={name} className={classes.good}>
                    {t('smart.worker.certified', 'Certified')}
                  </IconListItem>
                ))
              ) : (
                <IconListItem
                  icon={<WarningIcon />}
                  primaryText={t('smart.worker.noTrainingRequirementsMet', 'No Training Requirements Met')}
                  className={classes.bad}
                >
                  {t('smart.worker.thisWorkerHasNot', 'This worker has not yet taken any PEC training.')}
                </IconListItem>
              )}
              {contractorName && (
                <IconListItem
                  to={`/${organizationId}/sites/${siteId}/contractors/${contractorId}`}
                  icon={<BuildIcon />}
                  primaryText={contractorName}
                  style={{
                    backgroundColor: overallRanking ? overallRanking.color : undefined
                  }}
                >
                  {overallRanking ? overallRanking.label : undefined}
                </IconListItem>
              )}
              {pecIdentifier && <IconListItem icon={<CreditCardIcon />} primaryText={pecIdentifier.toString()} />}
              {phoneNumber && (
                <IconListItem icon={<PhoneIcon />} href={`tel:${phoneNumber}`} primaryText={phoneNumber} />
              )}
            </List>
          </Grid>
        </GridContainer>
      </Grid>
    </GridContainer>
  );
};

export const WorkerComponent = withWidth()(withStyles(styles)(Worker));
