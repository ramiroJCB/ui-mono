import * as React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { AutocompleteJobTypesContainer } from 'features/operator/autocompleteJobTypes/containers/AutocompleteJobTypes';
import { AutocompleteServiceRegionsContainer } from 'features/operator/autocompleteServiceRegions/containers/AutocompleteServiceRegions';
import { DebouncingValidatingField } from 'components/DebouncingValidatingField';
import { Field, Form } from 'react-final-form';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Header } from 'components/Header';
import { IAddWorkGroupForm } from 'interfaces/addWorkGroupForm';
import { IWorkGroup } from '@pec/aion-ui-core/interfaces/workGroup';
import { Link } from 'react-router-dom';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { Paper } from 'components/Paper';
import { RouteComponentProps, withRouter } from 'react-router';
import { simpleMemoize } from 'helpers/simpleMemoize';
import { TextField } from '@pec/aion-ui-form/components/TextField';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

const styles = () => ({
  autoCompleteField: {
    marginTop: 12
  }
});

type RouteParams = {
  organizationId: string;
};

type OwnProps = {
  initialValues: IAddWorkGroupForm;
  onSubmit: (values: IAddWorkGroupForm, form: FormApi<IAddWorkGroupForm>) => void;
  fetchWorkGroupsForValidation: (name: string) => Promise<IWorkGroup[]>;
};

type Props = WithStyles<typeof styles> & RouteComponentProps<RouteParams> & OwnProps & I18nextProps;

class AddWorkGroupFormComponent extends React.PureComponent<Props> {
  mustBeUnique = simpleMemoize(async (value: string) => {
    const { t } = this.props;

    if (!value) {
      return t('trainingCompliance.common.isRequired', 'is required');
    }

    try {
      const workGroups = await this.props.fetchWorkGroupsForValidation(value);
      return workGroups.length ? t('trainingCompliance.common.isNotUnique', 'is not unique') : undefined;
    } catch {
      return t('trainingCompliance.common.errorProcessingValidationRequest', 'error processing validation request');
    }
  });

  render() {
    const {
      classes,
      initialValues,
      onSubmit,
      match: {
        params: { organizationId }
      },
      t
    } = this.props;

    return (
      <React.Fragment>
        <Header title={t('trainingCompliance.common.newWorkGroup', 'New Work Group')} />
        <Form initialValues={initialValues} onSubmit={onSubmit}>
          {({ handleSubmit, submitting, invalid, pristine }) => (
            <form onSubmit={handleSubmit}>
              <Paper>
                <GridContainer justify="center">
                  <Grid item xs={12} md={8}>
                    <GridContainer>
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
                      <Grid item xs={12} md={6}>
                        <AutocompleteJobTypesContainer className={classes.autoCompleteField} />
                      </Grid>
                      <Grid item xs={12} md={6}>
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
                    </GridContainer>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container justify="space-between" alignItems="center">
                      <Grid item>
                        <Button
                          variant="text"
                          color="primary"
                          component={Link}
                          to={`/${organizationId}/training-compliance/work-groups`}
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
  }
}

export const AddWorkGroupForm = withRouter(withStyles(styles)(withTranslation()(AddWorkGroupFormComponent)));
