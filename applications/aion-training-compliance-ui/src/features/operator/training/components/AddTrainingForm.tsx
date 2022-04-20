import * as React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { Form } from 'react-final-form';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Header } from 'components/Header';
import { IAddTrainingForm } from 'interfaces/addTrainingForm';
import { Link } from 'react-router-dom';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { Paper } from 'components/Paper';
import { RouteComponentProps, withRouter } from 'react-router';
import { TrainingFormFields } from './TrainingFormFields';
import { useTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
};

type OwnProps = {
  initialValues: IAddTrainingForm;
  onSubmit: (values: IAddTrainingForm, form: FormApi<IAddTrainingForm>) => void;
};

type Props = RouteComponentProps<RouteParams> & OwnProps;

const AddTrainingFormComponent: React.FC<Props> = ({
  initialValues,
  onSubmit,
  match: {
    params: { organizationId }
  }
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Header title={t('trainingCompliance.common.newCustomTrainingRequirement', 'New Custom Training Requirement')} />
      <Form initialValues={initialValues} onSubmit={onSubmit}>
        {({ handleSubmit, submitting, invalid, pristine, form, values: { expirationUnits } }) => (
          <form onSubmit={handleSubmit} autoComplete="off" noValidate>
            <Paper>
              <GridContainer justify="center">
                <Grid item xs={12} md={8}>
                  <GridContainer>
                    <TrainingFormFields form={form} expirationUnits={expirationUnits} />
                  </GridContainer>
                </Grid>
                <Grid item xs={12}>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                      <Button
                        variant="text"
                        color="primary"
                        component={Link}
                        to={`/${organizationId}/training-compliance/training`}
                        fullWidth
                      >
                        {t('trainingCompliance.common.cancel', 'Cancel')}
                      </Button>
                    </Grid>
                    <Grid item>
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

export const AddTrainingForm = withRouter(AddTrainingFormComponent);
