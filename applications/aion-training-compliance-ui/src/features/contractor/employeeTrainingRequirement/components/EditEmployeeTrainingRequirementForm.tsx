import * as React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import { AttachmentStatus } from '@pec/aion-ui-core/interfaces/attachmentStatus';
import { DateField } from '@pec/aion-ui-form/components/DateField';
import { EmployeeTrainingRequirementPendingDocumentsContainer } from '../containers/EmployeeTrainingRequirementPendingDocuments';
import { Field, Form } from 'react-final-form';
import { FileUpload } from 'components/FileUpload';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IDocumentWithStatus } from 'interfaces/documentWithStatus';
import { IEmployeeTrainingRequirementForm, IUploadedFiles } from 'interfaces/employeeTrainingRequirementForm';
import { ITrainingRequirement } from '@pec/aion-ui-core/interfaces/trainingRequirement';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { required } from '@pec/aion-ui-core/validators';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  clientId: string;
  workGroupContractorId: string;
  workGroupJobTypeId: string;
  workGroupJobTypeEmployeeId: string;
  employeeTrainingRequirementId: string;
};

type OwnProps = {
  initialValues: IEmployeeTrainingRequirementForm;
  onSubmit: (values: IEmployeeTrainingRequirementForm, form: FormApi<IEmployeeTrainingRequirementForm>) => void;
  trainingRequirement: ITrainingRequirement;
  uploadedDocuments: IDocumentWithStatus[];
};

type Props = RouteComponentProps<RouteParams> & OwnProps & I18nextProps;

class EditEmployeeTrainingRequirementFormComponent extends React.Component<Props> {
  uploadRequired = (value: any) =>
    value.acceptedFiles.length === 0 &&
    this.props.uploadedDocuments.length === 0 &&
    this.props.trainingRequirement.uploadRequired
      ? this.props.t('trainingCompliance.common.isRequired', 'is required')
      : undefined;

  render() {
    const {
      initialValues,
      onSubmit,
      trainingRequirement: { uploadRequired },
      match: {
        params: { organizationId, clientId, workGroupContractorId, workGroupJobTypeId, workGroupJobTypeEmployeeId }
      },
      t
    } = this.props;

    return (
      <Form<IEmployeeTrainingRequirementForm> initialValues={initialValues} onSubmit={onSubmit}>
        {({ handleSubmit, form, submitting, pristine, invalid, values: { uploadedFiles } }) => (
          <form onSubmit={handleSubmit} autoComplete="off" noValidate>
            <Paper>
              <GridContainer justify="center">
                <Grid item xs={12}>
                  <Field<string>
                    type="text"
                    name="completionDateUtc"
                    label={t(
                      'trainingCompliance.contractor.employeeTrainingRequirement.trainingCompletionDate',
                      'Training Completion Date'
                    )}
                    component={DateField}
                    fullWidth
                    required
                    validate={required}
                  />
                </Grid>
                <Field<IUploadedFiles> name="uploadedFiles" validate={this.uploadRequired}>
                  {({ meta: { error, touched } }) => (
                    <React.Fragment>
                      <Grid item xs={12}>
                        <Grid container spacing={0}>
                          <InputLabel shrink required={uploadRequired} error={error && touched}>
                            {t(
                              'trainingCompliance.contractor.employeeTrainingRequirement.recordOfTraining',
                              'Record of Training'
                            )}
                          </InputLabel>
                          <Grid item xs={12}>
                            <FileUpload form={form} error={error && touched} />
                          </Grid>
                          {error && touched && <FormHelperText error>{error}</FormHelperText>}
                        </Grid>
                      </Grid>
                      {uploadedFiles.acceptedFiles.length > 0 && (
                        <Grid item xs={12}>
                          <Grid container>
                            <InputLabel shrink>
                              {t(
                                'trainingCompliance.contractor.employeeTrainingRequirement.pendingUploads',
                                'Pending Uploads'
                              )}
                            </InputLabel>
                            <EmployeeTrainingRequirementPendingDocumentsContainer
                              form={form}
                              documents={[
                                ...uploadedFiles.acceptedFiles.map((file, index) => ({
                                  id: `${file.name}${index}`,
                                  isDeleted: false,
                                  fileName: file.name,
                                  storagePath: file.path,
                                  mimeType: file.type,
                                  status: AttachmentStatus.Delete
                                }))
                              ]}
                            />
                          </Grid>
                        </Grid>
                      )}
                    </React.Fragment>
                  )}
                </Field>
                <Grid item xs={12}>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                      <Button
                        variant="text"
                        color="primary"
                        component={Link}
                        to={`/${organizationId}/training-compliance/clients/${clientId}/work-groups/${workGroupContractorId}/job-types/${workGroupJobTypeId}/employees/${workGroupJobTypeEmployeeId}`}
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
    );
  }
}

export const EditEmployeeTrainingRequirementForm = withRouter(
  withTranslation()(EditEmployeeTrainingRequirementFormComponent)
);
