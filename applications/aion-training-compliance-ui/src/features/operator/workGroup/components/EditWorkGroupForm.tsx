import * as React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { AutocompleteServiceRegionsContainer } from 'features/operator/autocompleteServiceRegions/containers/AutocompleteServiceRegions';
import { DebouncingValidatingField } from 'components/DebouncingValidatingField';
import { DeepReadonly } from 'ts-essentials';
import { Field } from 'react-final-form';
import { Form } from 'react-final-form';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IWorkGroup } from '@pec/aion-ui-core/interfaces/workGroup';
import { Link } from 'react-router-dom';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { RouteComponentProps, withRouter } from 'react-router';
import { simpleMemoize } from 'helpers/simpleMemoize';
import { TextField } from '@pec/aion-ui-form/components/TextField';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  workGroupId: string;
};

type OwnProps = {
  initialValues: DeepReadonly<IWorkGroup>;
  fetchWorkGroupsForValidation: (name: string) => Promise<IWorkGroup[]>;
  onSubmit: (values: DeepReadonly<IWorkGroup>, form: FormApi<DeepReadonly<IWorkGroup>>) => void;
};

type Props = RouteComponentProps<RouteParams> & OwnProps & I18nextProps;

class EditWorkGroupFormComponent extends React.Component<Props> {
  mustBeUnique = simpleMemoize(async (value: string) => {
    const { t } = this.props;

    if (!value) {
      return t('trainingCompliance.common.isRequired', 'is required');
    }

    const {
      fetchWorkGroupsForValidation,
      match: {
        params: { workGroupId }
      }
    } = this.props;

    try {
      const workGroups = await fetchWorkGroupsForValidation(value);
      return workGroups.length && workGroups.some(({ id }) => id !== workGroupId)
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
        params: { organizationId, workGroupId }
      },
      t
    } = this.props;

    return (
      <Form initialValues={initialValues} onSubmit={onSubmit as any}>
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
                  <AutocompleteServiceRegionsContainer />
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
                        to={`/${organizationId}/training-compliance/work-groups/${workGroupId}`}
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
                          t('trainingCompliance.operator.workGroup.editWorkGroup', 'Edit Work Group')
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

export const EditWorkGroupForm = withRouter(withTranslation()(EditWorkGroupFormComponent));
