import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import WorkIcon from '@material-ui/icons/Work';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { AxiosError } from 'axios';
import { ConfirmRemoveButton } from 'components/ConfirmRemoveButton';
import { ContractorWorkGroupJobTypeHeaderContainer } from 'features/contractor/workGroupJobType/containers/ContractorWorkGroupJobTypeHeader';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'ts-essentials';
import { Error } from '@pec/aion-ui-components/components/Error';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IOrganization, OrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { IWorkGroupJobType } from '@pec/aion-ui-core/interfaces/workGroupJobType';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { OperatorWorkGroupJobTypeHeaderContainer } from 'features/operator/workGroupJobType/containers/OperatorWorkGroupJobTypeHeader';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { RouteComponentProps, withRouter } from 'react-router';
import { useTranslation } from 'react-i18next';

const { Manage } = ActivityAction;
const { TrainingComplianceJobTypes } = ActivityResourceName;

const styles = () =>
  createStyles({
    gridItem: {
      display: 'flex'
    },
    label: {
      fontWeight: 'bold'
    },
    icon: {
      marginRight: 10
    }
  });

type RouteParams = {
  organizationId: string;
};

type OwnProps = {
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  workGroupJobType: DeepReadonly<IWorkGroupJobType> | null;
  organization: DeepReadonly<IOrganization> | null;
  unassignWorkGroupJobType: (workGroupJobTypeId: string) => () => Promise<void>;
  hasGlobalPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean;
  hasOrganizationPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean;
};

type Props = WithStyles<typeof styles> & RouteComponentProps<RouteParams> & OwnProps;

const WorkGroupJobTypeGeneralInfo: React.FC<Props> = ({
  isFetching,
  error,
  workGroupJobType,
  organization,
  unassignWorkGroupJobType,
  hasGlobalPermission,
  hasOrganizationPermission,
  classes: { gridItem, icon, label }
}) => {
  const { t } = useTranslation();

  return !isFetching && workGroupJobType && organization ? (
    <React.Fragment>
      {organization.features.includes(OrganizationFeature.Client) ? (
        <React.Fragment>
          <OperatorWorkGroupJobTypeHeaderContainer />
          {(hasGlobalPermission(Manage, TrainingComplianceJobTypes) ||
            hasOrganizationPermission(Manage, TrainingComplianceJobTypes)) && (
            <GridContainer justify="space-between">
              <Grid item>
                <ConfirmRemoveButton
                  message={t('trainingCompliance.common.unassignItemConfirmation', {
                    name: workGroupJobType.jobTypeName,
                    defaultValue: "Are you sure you'd like to unassign {{name}}?"
                  })}
                  title={t('trainingCompliance.workGroupJobType.unassignJobType', 'Unassign Job Type')}
                  handleDelete={unassignWorkGroupJobType(workGroupJobType.id)}
                />
              </Grid>
            </GridContainer>
          )}
        </React.Fragment>
      ) : (
        <ContractorWorkGroupJobTypeHeaderContainer />
      )}
      <GridContainer>
        <Grid item xs={12}>
          <Paper>
            <GridContainer>
              <Grid item xs={12} className={gridItem}>
                <WorkIcon className={icon} />
                <Typography variant="body1" color="textSecondary">
                  {t('trainingCompliance.common.jobType', 'Job Type')}
                </Typography>
              </Grid>
              <Grid item xs={12} className={gridItem}>
                <Typography variant="h5" className={label}>
                  {workGroupJobType.jobTypeName}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">{workGroupJobType.jobType.description}</Typography>
              </Grid>
            </GridContainer>
          </Paper>
        </Grid>
      </GridContainer>
    </React.Fragment>
  ) : error ? (
    <Error
      message={t('trainingCompliance.common.processingRequestError', 'There was an error processing your request.')}
    />
  ) : (
    <Loading />
  );
};

export const WorkGroupJobTypeGeneralInfoComponent = withStyles(styles)(withRouter(WorkGroupJobTypeGeneralInfo));
