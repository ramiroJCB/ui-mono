import * as React from 'react';
import { AddEnvelopeWizard } from './AddEnvelopeWizard';
import { DeepReadonly } from 'ts-essentials';
import { FileWithPath } from 'file-selector';
import { FormApi } from 'final-form';
import { Grid, Paper } from '@material-ui/core';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IAddEnvelopeForm } from 'interfaces/envelopeForm';
import { IDocumentWithStatus } from 'interfaces/documentWithStatus';
import { InvalidFileUpload } from 'interfaces/invalidFileUpload';
import { ITemplate } from 'interfaces/template';

type Props = {
  handleFileUpload: (
    form: FormApi<IAddEnvelopeForm>,
    acceptedFiles: FileWithPath[],
    rejectedFiles: InvalidFileUpload[]
  ) => void;
  handleRemoveDocument: (form: FormApi<IAddEnvelopeForm>, document: IDocumentWithStatus) => void;
  handleSubmit: (values: IAddEnvelopeForm, form: FormApi<IAddEnvelopeForm>) => void;
  pendingDocument: DeepReadonly<IDocumentWithStatus | null>;
  organizationId: string;
  templates: DeepReadonly<ITemplate[]>;
};

export const AddEnvelopeComponent: React.FC<Props> = ({
  handleFileUpload,
  handleRemoveDocument,
  handleSubmit,
  pendingDocument,
  organizationId,
  templates
}: Props) => (
  <Paper>
    <GridContainer>
      <Grid item xs={12}>
        <AddEnvelopeWizard
          onFileUpload={handleFileUpload}
          onRemoveDocument={handleRemoveDocument}
          organizationId={organizationId}
          onSubmit={handleSubmit}
          templates={templates}
          pendingDocument={pendingDocument}
        />
      </Grid>
    </GridContainer>
  </Paper>
);
