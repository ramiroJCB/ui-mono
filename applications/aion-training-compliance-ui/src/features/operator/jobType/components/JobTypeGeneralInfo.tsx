import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import WorkIcon from '@material-ui/icons/Work';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { AxiosError } from 'axios';
import { ConfirmRemoveButton } from 'components/ConfirmRemoveButton';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'ts-essentials';
import { EditJobTypeForm } from './EditJobTypeForm';
import { Error } from '@pec/aion-ui-components/components/Error';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IJobType } from '@pec/aion-ui-core/interfaces/jobType';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { OperatorJobTypeHeaderContainer } from '../containers/OperatorJobTypeHeader';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { Write, Manage } = ActivityAction;
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
  jobTypeId: string;
};

type OwnProps = {
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  jobType: DeepReadonly<IJobType> | null;
  deleteJobType: (jobTypeId: string) => () => Promise<void>;
  fetchJobTypesForValidation: (name: string) => Promise<IJobType[]>;
  onSubmit: (values: IJobType, form: FormApi<IJobType>) => void;
  hasGlobalPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean;
  hasOrganizationPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean;
};

type Props = WithStyles<typeof styles> & RouteComponentProps<RouteParams> & OwnProps;

const JobTypeGeneralInfo: React.FC<Props> = ({
  isFetching,
  error,
  jobType,
  classes,
  onSubmit,
  fetchJobTypesForValidation,
  deleteJobType,
  hasGlobalPermission,
  hasOrganizationPermission
}) => {
  const { t } = useTranslation();

  return !isFetching && jobType ? (
    <React.Fragment>
      <OperatorJobTypeHeaderContainer />
      {(hasGlobalPermission(Manage, TrainingComplianceJobTypes) ||
        hasOrganizationPermission(Manage, TrainingComplianceJobTypes)) && (
        <GridContainer justify="space-between">
          <Grid item>
            <ConfirmRemoveButton
              title={t('trainingCompliance.operator.jobType.removeJobType', 'Remove Job Type')}
              message={t('trainingCompliance.common.deleteConfirmation', {
                name: jobType.name,
                defaultValue: "Are you sure you'd like to delete {{name}}?"
              })}
              handleDelete={deleteJobType(jobType.id)}
            />
          </Grid>
        </GridContainer>
      )}
      <GridContainer>
        <Grid item xs={12} md={6}>
          <Paper>
            <GridContainer>
              <Grid item xs={12} className={classes.gridItem}>
                <WorkIcon className={classes.icon} />
                <Typography variant="body1" color="textSecondary">
                  {t('trainingCompliance.common.jobType', 'Job Type')}
                </Typography>
              </Grid>
              <Grid item xs={12} className={classes.gridItem}>
                <Typography variant="h5" className={classes.label}>
                  {jobType.name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">{jobType.description}</Typography>
              </Grid>
            </GridContainer>
          </Paper>
        </Grid>

        {(hasGlobalPermission(Write, TrainingComplianceJobTypes) ||
          hasOrganizationPermission(Write, TrainingComplianceJobTypes)) && (
          <Grid item xs={12} md={6}>
            <EditJobTypeForm
              initialValues={jobType}
              onSubmit={onSubmit}
              fetchJobTypesForValidation={fetchJobTypesForValidation}
            />
          </Grid>
        )}
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

export const JobTypeGeneralInfoComponent = withRouter(withStyles(styles)(JobTypeGeneralInfo));
