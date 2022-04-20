import * as React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { Form } from 'react-final-form';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { ITrainingRequirement } from '@pec/aion-ui-core/interfaces/trainingRequirement';
import { Link } from 'react-router-dom';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { RouteComponentProps, withRouter } from 'react-router';
import { TrainingFormFields } from './TrainingFormFields';
import { useTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  trainingRequirementId: string;
};

type OwnProps = {
  initialValues: ITrainingRequirement;
  onSubmit: (values: ITrainingRequirement, form: FormApi<ITrainingRequirement>) => void;
};

type Props = RouteComponentProps<RouteParams> & OwnProps;

const EditTrainingFormComponent: React.FC<Props> = ({
  initialValues,
  onSubmit,
  match: {
    params: { organizationId }
  }
}) => {
  const { t } = useTranslation();

  return (
    <Form initialValues={initialValues} onSubmit={onSubmit}>
      {({ handleSubmit, submitting, invalid, pristine, form, values: { expirationUnits } }) => (
        <form onSubmit={handleSubmit} autoComplete="off" noValidate>
          <Paper>
            <GridContainer spacing={5}>
              <TrainingFormFields form={form} expirationUnits={expirationUnits} />
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
                        t('trainingCompliance.operator.training.editTraining', 'Edit Training')
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
  );
};

export const EditTrainingForm = withRouter(EditTrainingFormComponent);
