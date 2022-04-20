import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import MapIcon from '@material-ui/icons/Map';
import Typography from '@material-ui/core/Typography';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { AxiosError } from 'axios';
import { ConfirmRemoveButton } from 'components/ConfirmRemoveButton';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'ts-essentials';
import { EditWorkGroupForm } from './EditWorkGroupForm';
import { Error } from '@pec/aion-ui-components/components/Error';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IWorkGroup } from '@pec/aion-ui-core/interfaces/workGroup';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { OperatorWorkGroupHeaderContainer } from '../containers/OperatorWorkGroupHeader';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { RouteComponentProps, withRouter } from 'react-router';
import { useTranslation } from 'react-i18next';

const { Write, Manage } = ActivityAction;
const { TrainingComplianceWorkGroups } = ActivityResourceName;

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
  workGroupId: string;
};

type OwnProps = {
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  workGroup: DeepReadonly<IWorkGroup> | null;
  fetchWorkGroupsForValidation: (name: string) => Promise<IWorkGroup[]>;
  deleteWorkGroup: (workGroupId: string) => () => Promise<void>;
  onSubmit: (values: IWorkGroup, form: FormApi<IWorkGroup>) => void;
  hasGlobalPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean;
  hasOrganizationPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean;
};

type Props = WithStyles<typeof styles> & RouteComponentProps<RouteParams> & OwnProps;

const WorkGroupGeneralInfo: React.FC<Props> = ({
  workGroup,
  isFetching,
  error,
  classes,
  onSubmit,
  fetchWorkGroupsForValidation,
  hasGlobalPermission,
  hasOrganizationPermission,
  deleteWorkGroup
}) => {
  const { t } = useTranslation();

  return !isFetching && workGroup ? (
    <React.Fragment>
      <OperatorWorkGroupHeaderContainer />
      {(hasGlobalPermission(Manage, TrainingComplianceWorkGroups) ||
        hasOrganizationPermission(Manage, TrainingComplianceWorkGroups)) && (
        <GridContainer>
          <Grid item>
            <ConfirmRemoveButton
              message={t('trainingCompliance.common.removeTrainingNameConfirmation', {
                name: workGroup.name,
                defaultValue: "Are you sure you'd like to remove {{name}}?"
              })}
              title={t('trainingCompliance.operator.workGroup.removeWorkGroup', 'Remove Work Group')}
              handleDelete={deleteWorkGroup(workGroup.id)}
            />
          </Grid>
        </GridContainer>
      )}
      <GridContainer>
        <Grid item xs={12} md={6}>
          <Paper>
            <GridContainer>
              <Grid item xs={12} className={classes.gridItem}>
                <MapIcon className={classes.icon} />
                <Typography variant="body1" color="textSecondary">
                  {t('trainingCompliance.common.workGroup', 'Work Group')}
                </Typography>
              </Grid>
              <Grid item xs={12} className={classes.gridItem}>
                <Typography variant="h5" className={classes.label}>
                  {workGroup.name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">{workGroup.description}</Typography>
              </Grid>
            </GridContainer>
          </Paper>
        </Grid>

        {(hasGlobalPermission(Write, TrainingComplianceWorkGroups) ||
          hasOrganizationPermission(Write, TrainingComplianceWorkGroups)) && (
          <Grid item xs={12} md={6}>
            <EditWorkGroupForm
              initialValues={workGroup}
              onSubmit={onSubmit}
              fetchWorkGroupsForValidation={fetchWorkGroupsForValidation}
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

export const WorkGroupGeneralInfoComponent = withRouter(withStyles(styles)(WorkGroupGeneralInfo));
