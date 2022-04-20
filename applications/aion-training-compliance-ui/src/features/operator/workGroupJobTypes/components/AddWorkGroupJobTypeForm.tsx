import * as React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { AutocompleteJobTypesContainer } from 'features/operator/autocompleteJobTypes/containers/AutocompleteJobTypes';
import { DeepReadonly } from 'ts-essentials';
import { Form } from 'react-final-form';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Header } from 'components/Header';
import { IAddWorkGroupJobTypeForm } from 'interfaces/addWorkGroupJobTypeForm';
import { IJobType } from '@pec/aion-ui-core/interfaces/jobType';
import { IWorkGroup } from '@pec/aion-ui-core/interfaces/workGroup';
import { Link } from 'react-router-dom';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { Paper } from 'components/Paper';
import { RouteComponentProps, withRouter } from 'react-router';
import { useTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  workGroupId: string;
};

type OwnProps = {
  initialValues: IAddWorkGroupJobTypeForm;
  onSubmit: (values: IAddWorkGroupJobTypeForm, form: FormApi<IAddWorkGroupJobTypeForm>) => void;
  workGroup: DeepReadonly<IWorkGroup> | null;
  isFetching: boolean;
  validate?: (values: IJobType[]) => Promise<JSX.Element | string | undefined>;
};

type Props = RouteComponentProps<RouteParams> & OwnProps;

const AddWorkGroupJobTypeFormComponent: React.FC<Props> = ({
  initialValues,
  onSubmit,
  workGroup,
  isFetching,
  validate,
  match: {
    params: { organizationId, workGroupId }
  }
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Header item={workGroup} isFetching={isFetching}>
        {({ name }) =>
          t('trainingCompliance.common.addJobTypes', {
            name,
            defaultValue: 'Add Job Types to {{name}}'
          })
        }
      </Header>
      <Form initialValues={initialValues} onSubmit={onSubmit}>
        {({ handleSubmit, submitting, pristine, invalid }) => (
          <form onSubmit={handleSubmit}>
            <Paper>
              <GridContainer justify="center">
                <Grid item xs={8}>
                  <AutocompleteJobTypesContainer validate={validate} />
                </Grid>
                <Grid item xs={12}>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                      <Button
                        variant="text"
                        color="primary"
                        component={Link}
                        to={`/${organizationId}/training-compliance/work-groups/${workGroupId}`}
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

export const AddWorkGroupJobTypeForm = withRouter(AddWorkGroupJobTypeFormComponent);
