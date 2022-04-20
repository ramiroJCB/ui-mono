import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { AddEnvelopeWizardStepOne } from './AddEnvelopeWizardStepOne';
import { AddEnvelopeWizardStepThree } from './AddEnvelopeWizardStepThree';
import { AddEnvelopeWizardStepTwo } from './AddEnvelopeWizardStepTwo';
import { DeepReadonly } from 'ts-essentials';
import { FileWithPath } from 'react-dropzone';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IAddEnvelopeForm } from 'interfaces/envelopeForm';
import { IDocumentWithStatus } from 'interfaces/documentWithStatus';
import { InvalidFileUpload } from 'interfaces/invalidFileUpload';
import { ITemplate } from 'interfaces/template';
import { Wizard } from '@pec/aion-ui-form/components/Wizard';
import { useTranslation } from 'react-i18next';

type Props = {
  onFileUpload: (
    form: FormApi<IAddEnvelopeForm>,
    acceptedFiles: FileWithPath[],
    rejectedFiles: InvalidFileUpload[]
  ) => void;
  organizationId: string;
  onRemoveDocument: (form: FormApi<IAddEnvelopeForm>, document: IDocumentWithStatus) => void;
  onSubmit: (values: IAddEnvelopeForm, form: FormApi<IAddEnvelopeForm>) => void;
  pendingDocument: DeepReadonly<IDocumentWithStatus | null>;
  templates: DeepReadonly<ITemplate[]>;
};

export const AddEnvelopeWizard: React.FC<Props> = ({
  onFileUpload,
  organizationId,
  onRemoveDocument,
  onSubmit,
  pendingDocument,
  templates
}) => {
  const { t } = useTranslation();

  const initialValues: IAddEnvelopeForm = {
    assigneeGroups: [],
    document: null,
    documentType: 'template',
    templateId: ''
  };

  const steps = [
    { label: t('eSignature.envelope.add.chooseEnvelopeTemplate', 'Choose an Envelope Template') },
    {
      label: t('eSignature.envelope.add.chooseDocument', 'Choose a Document')
    },
    {
      label: t('eSignature.envelope.add.chooseRecipients', 'Choose Recipients')
    }
  ];

  return (
    <GridContainer>
      <Grid item xs={12}>
        <Wizard
          initialValues={initialValues}
          cancelLink={`/${organizationId}/esignatures/documents`}
          onSubmit={onSubmit}
          maxSteps={steps.length}
          steps={steps}
          vertical
        >
          {({ step }) => (
            <Wizard.Steps step={step}>
              <Wizard.Step>
                <AddEnvelopeWizardStepOne templates={templates} />
              </Wizard.Step>
              <Wizard.Step>
                <AddEnvelopeWizardStepTwo
                  onFileUpload={onFileUpload}
                  onRemoveDocument={onRemoveDocument}
                  pendingDocument={pendingDocument}
                />
              </Wizard.Step>
              <Wizard.Step>
                <AddEnvelopeWizardStepThree />
              </Wizard.Step>
            </Wizard.Steps>
          )}
        </Wizard>
      </Grid>
    </GridContainer>
  );
};
