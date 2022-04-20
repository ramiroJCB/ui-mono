import * as React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { AutocompleteTrainingsContainer } from 'features/operator/autocompleteTrainings/containers/AutocompleteTrainings';
import { DeepReadonly } from 'ts-essentials';
import { Form } from 'react-final-form';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Header } from 'components/Header';
import { IAddJobTypeTrainingRequirementForm } from 'interfaces/addJobTypeTrainingRequirementForm';
import { IJobType } from '@pec/aion-ui-core/interfaces/jobType';
import { ITrainingRequirement } from '@pec/aion-ui-core/interfaces/trainingRequirement';
import { Link, useParams } from 'react-router-dom';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from 'components/Paper';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles({
  autoCompleteField: {
    marginTop: 12
  }
});

type RouteParams = {
  organizationId: string;
};

type Props = {
  initialValues: IAddJobTypeTrainingRequirementForm;
  onSubmit: (values: IAddJobTypeTrainingRequirementForm, form: FormApi<IAddJobTypeTrainingRequirementForm>) => void;
  jobType: DeepReadonly<IJobType> | null;
  isFetching: boolean;
  validate?: (values: ITrainingRequirement[]) => Promise<JSX.Element | string | undefined>;
};

export const AddJobTypeTrainingRequirementForm: React.FC<Props> = ({
  initialValues,
  onSubmit,
  jobType,
  isFetching,
  validate
}) => {
  const { organizationId } = useParams<RouteParams>();
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Header item={jobType} isFetching={isFetching}>
        {({ name }) =>
          t('trainingCompliance.common.addTrainingRequirements', {
            name,
            defaultValue: 'Add Training Requirements to {{name}}'
          })
        }
      </Header>
      <Form initialValues={initialValues} onSubmit={onSubmit}>
        {({ handleSubmit, submitting, pristine, invalid }) => (
          <form onSubmit={handleSubmit}>
            <Paper>
              <GridContainer justify="center">
                <Grid item xs={8}>
                  <AutocompleteTrainingsContainer validate={validate} className={classes.autoCompleteField} />
                </Grid>
                <Grid item xs={12}>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                      <Button
                        variant="text"
                        color="primary"
                        component={Link}
                        to={`/${organizationId}/training-compliance/job-types/${jobType && jobType.id}`}
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
