import * as React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { DebouncingValidatingField } from 'components/DebouncingValidatingField';
import { Field } from 'react-final-form';
import { Form } from 'react-final-form';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IJobType } from '@pec/aion-ui-core/interfaces/jobType';
import { Link } from 'react-router-dom';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { Paper } from '@material-ui/core';
import { RouteComponentProps, withRouter } from 'react-router';
import { simpleMemoize } from 'helpers/simpleMemoize';
import { TextField } from '@pec/aion-ui-form/components/TextField';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  jobTypeId: string;
};

type OwnProps = {
  initialValues: IJobType;
  fetchJobTypesForValidation: (name: string) => Promise<IJobType[]>;
  onSubmit: (values: IJobType, form: FormApi<IJobType>) => void;
};

type Props = RouteComponentProps<RouteParams> & OwnProps & I18nextProps;

class EditJobTypeFormComponent extends React.Component<Props> {
  mustBeUnique = simpleMemoize(async (value: string) => {
    const { t } = this.props;

    if (!value) {
      return t('trainingCompliance.common.isRequired', 'is required');
    }

    try {
      const {
        fetchJobTypesForValidation,
        match: {
          params: { jobTypeId }
        }
      } = this.props;
      const jobTypes = await fetchJobTypesForValidation(value);

      return jobTypes.length && jobTypes.some(({ id }) => id !== jobTypeId)
        ? t('trainingCompliance.common.isNotUnique', 'is not unique')
        : undefined;
    } catch {
      return t('trainingCompliance.common.errorProcessingValidationRequest', 'error processing validation request');
    }
  });

  render() {
    const {
      initialValues,
      onSubmit,
      match: {
        params: { organizationId, jobTypeId }
      },
      t
    } = this.props;

    return (
      <Form initialValues={initialValues} onSubmit={onSubmit}>
        {({ handleSubmit, submitting, invalid, pristine }) => (
          <form onSubmit={handleSubmit}>
            <Paper>
              <GridContainer spacing={5}>
                <Grid item xs={12}>
                  <DebouncingValidatingField<string>
                    name="name"
                    label={t('trainingCompliance.common.title', 'Title')}
                    component={TextField}
                    fullWidth
                    required
                    validate={this.mustBeUnique}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field<string>
                    name="description"
                    label={t('trainingCompliance.common.description', 'Description')}
                    component={TextField}
                    multiline
                    fullWidth
                    rows="12"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                      <Button
                        variant="text"
                        color="primary"
                        component={Link}
                        to={`/${organizationId}/training-compliance/job-types/${jobTypeId}`}
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
                          t('trainingCompliance.operator.jobType.editJobType', 'Edit Job Type')
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
  }
}

export const EditJobTypeForm = withRouter(withTranslation()(EditJobTypeFormComponent));
