import * as React from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Attachment } from '@pec/aion-ui-components/components/Attachment';
import { DeepReadonly } from 'ts-essentials';
import { Field, FormSpy } from 'react-final-form';
import { FileUpload } from 'components/FileUpload';
import { FileWithPath } from 'file-selector';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IAddEnvelopeForm, IUploadedDocument } from 'interfaces/envelopeForm';
import { IDocumentWithStatus } from 'interfaces/documentWithStatus';
import { InvalidFileUpload } from 'interfaces/invalidFileUpload';
import { RadioField } from '@pec/aion-ui-form/components/RadioField';
import { useTranslation } from 'react-i18next';

type Props = {
  onFileUpload: (
    form: FormApi<IAddEnvelopeForm>,
    acceptedFiles: FileWithPath[],
    rejectedFiles: InvalidFileUpload[]
  ) => void;
  onRemoveDocument: (form: FormApi<IAddEnvelopeForm>, document: IDocumentWithStatus) => void;
  pendingDocument: DeepReadonly<IDocumentWithStatus | null>;
};

export const AddEnvelopeWizardStepTwo: React.FC<Props> = ({
  onFileUpload,
  onRemoveDocument,
  pendingDocument
}: Props) => {
  const { t } = useTranslation();

  const uploadRequired = (value: any) =>
    !value && !pendingDocument
      ? t('eSignature.envelope.add.uploadedDocumentIsRequired', 'An uploaded document is required')
      : undefined;

  const handleFileUpload = (form: FormApi<IAddEnvelopeForm>) => (
    acceptedFiles: FileWithPath[],
    rejectedFiles: InvalidFileUpload[]
  ) => {
    onFileUpload(form, acceptedFiles, rejectedFiles);
  };

  const handleRemoveDocument = (form: FormApi<IAddEnvelopeForm>) => (document: IDocumentWithStatus) => {
    onRemoveDocument(form, document);
  };

  return (
    <FormSpy<IAddEnvelopeForm>>
      {({ form }) => (
        <GridContainer>
          <Grid item xs={12}>
            <Typography>
              {t(
                'eSignature.envelope.add.useOrUploadDocument',
                'You can either use the generic document associated with this template, or upload your own.'
              )}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl>
              <GridContainer spacing={0}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Field type="radio" color="primary" name="documentType" component={RadioField} value="template" />
                    }
                    label={t('eSignature.envelope.add.useGenericDocument', 'Use generic document')}
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Field type="radio" color="primary" name="documentType" component={RadioField} value="custom" />
                    }
                    label={t('eSignature.envelope.add.uploadDocument', 'Upload a document')}
                  />
                </Grid>
                <Grid item>
                  {pendingDocument && form.getState().values.documentType === 'custom' && (
                    <Attachment
                      attachment={pendingDocument}
                      status={pendingDocument.status}
                      onClick={handleRemoveDocument(form)}
                    />
                  )}
                </Grid>
              </GridContainer>
            </FormControl>
          </Grid>

          {form.getState().values.documentType === 'custom' && !form.getState().values.document && !pendingDocument && (
            <Field<IUploadedDocument> name="document" validate={uploadRequired}>
              {({ meta: { error, touched } }) => (
                <Grid item lg={6} xs={12}>
                  <Grid container spacing={0}>
                    <Grid item xs={12}>
                      <FileUpload error={error && touched} onFileUpload={handleFileUpload(form)} />
                    </Grid>
                    {error && touched && <FormHelperText error>{error}</FormHelperText>}
                  </Grid>
                </Grid>
              )}
            </Field>
          )}
        </GridContainer>
      )}
    </FormSpy>
  );
};
