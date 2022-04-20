import * as React from 'react';
import { CommonTaskGroupFormFields } from './CommonTaskGroupFormFields';
import { DeepReadonly } from 'ts-essentials';
import { FileWithPath } from 'react-dropzone';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IAttachmentWithStatus } from '@pec/aion-ui-core/interfaces/attachmentWithStatus';
import { InvalidFileUpload } from 'interfaces/invalidFileUpload';

type Props = {
  addAttachments: (acceptedFiles: FileWithPath[], rejectedFiles: InvalidFileUpload[]) => void;
  deleteAttachment: (id: string) => void;
  uploadedAttachments: DeepReadonly<IAttachmentWithStatus[]>;
};

export const AddTaskGroupWizardStepOne: React.FC<Props> = ({
  addAttachments,
  deleteAttachment,
  uploadedAttachments
}: Props) => (
  <GridContainer>
    <CommonTaskGroupFormFields
      addAttachments={addAttachments}
      deleteAttachment={deleteAttachment}
      uploadedAttachments={uploadedAttachments}
    />
  </GridContainer>
);
