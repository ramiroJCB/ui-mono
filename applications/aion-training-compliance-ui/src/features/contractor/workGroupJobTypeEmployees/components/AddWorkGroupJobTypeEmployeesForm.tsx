import * as React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { AutocompleteEmployeesContainer } from 'features/contractor/autocompleteEmployees/containers/AutocompleteEmployees';
import { DeepReadonly } from 'ts-essentials';
import { Form } from 'react-final-form';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Header } from 'components/Header';
import { IAddWorkGroupJobTypeEmployeeForm } from 'interfaces/addWorkGroupJobTypeEmployeeForm';
import { IEmployee } from 'interfaces/employee';
import { IWorkGroupJobType } from '@pec/aion-ui-core/interfaces/workGroupJobType';
import { Link } from 'react-router-dom';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { Paper } from 'components/Paper';
import { RouteComponentProps, withRouter } from 'react-router';
import { useTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  clientId: string;
  workGroupContractorId: string;
  workGroupJobTypeId: string;
};

type OwnProps = {
  initialValues: IAddWorkGroupJobTypeEmployeeForm;
  onSubmit: (values: IAddWorkGroupJobTypeEmployeeForm, form: FormApi<IAddWorkGroupJobTypeEmployeeForm>) => void;
  workGroupJobType: DeepReadonly<IWorkGroupJobType> | null;
  isFetching: boolean;
  validate?: (values: IEmployee[]) => Promise<JSX.Element | string | undefined>;
};

type Props = RouteComponentProps<RouteParams> & OwnProps;

const AddWorkGroupJobTypeEmployeeFormComponent: React.FC<Props> = ({
  initialValues,
  onSubmit,
  workGroupJobType,
  isFetching,
  validate,
  match: {
    params: { organizationId, clientId, workGroupContractorId, workGroupJobTypeId }
  }
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Header item={workGroupJobType} isFetching={isFetching}>
        {({ jobTypeName }) =>
          t('trainingCompliance.common.addEmployees', {
            jobTypeName,
            defaultValue: 'Add Employees to {{jobTypeName}}'
          })
        }
      </Header>
      <Form initialValues={initialValues} onSubmit={onSubmit}>
        {({ handleSubmit, submitting, pristine, invalid }) => (
          <form onSubmit={handleSubmit}>
            <Paper>
              <GridContainer justify="center">
                <Grid item xs={8}>
                  <AutocompleteEmployeesContainer validate={validate} />
                </Grid>
                <Grid item xs={12}>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                      <Button
                        variant="text"
                        color="primary"
                        component={Link}
                        to={`/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupContractorId}/job-types/${workGroupJobTypeId}`}
                        fullWidth
                      >
                        {t('trainingCompliance.common.cancel', 'Cancel')}
                      </Button>
                    </Grid>
                    <Grid>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        color="secondary"
                        isSubmitting={submitting}
                        disabled={submitting || invalid || pristine}
                        fullWidth
                      >
                        {submitting ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          t('trainingCompliance.common.submit', 'Submit')
                        )}
                      </LoadingButton>
                    </Grid>
                  </Grid>
                </Grid>
              </GridContainer>
            </Paper>
          </form>
        )}
      </Form>
    </React.Fragment>
  );
};

export const AddWorkGroupJobTypeEmployeeForm = withRouter(AddWorkGroupJobTypeEmployeeFormComponent);
