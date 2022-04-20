import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Attachment } from './Attachment';
import { DeepReadonly } from 'ts-essentials';
import { IAttachment } from '@pec/aion-ui-core/interfaces/attachment';
import { IAttachmentWithStatus } from '@pec/aion-ui-core/interfaces/attachmentWithStatus';

type Props = {
  attachments: DeepReadonly<IAttachmentWithStatus[]>;
  downloadAttachment: (attachment: IAttachment) => void;
  deleteAttachment?: (id: string) => void;
};

export const MessageAttachments: React.FC<Props> = ({ attachments, deleteAttachment, downloadAttachment }) => (
  <Grid item xs={12}>
    {attachments.map(attachment => (
      <Attachment
        key={attachment.id}
        attachment={attachment}
        onClick={downloadAttachment}
        status={attachment.status}
        onDelete={deleteAttachment}
      />
    ))}
  </Grid>
);
