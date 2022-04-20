import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Attachment } from 'components/Attachment';
import { CommonRootState } from '@pec/aion-ui-core/combineReducers';
import { connect } from 'react-redux';
import { DeepReadonly } from 'ts-essentials';
import { downloadTaskGroupAttachment } from '../actions/downloadTaskGroupAttachment';
import { IAttachment } from '@pec/aion-ui-core/interfaces/attachment';
import { IAttachmentWithStatus } from '@pec/aion-ui-core/interfaces/attachmentWithStatus';
import { RootActions } from '@pec/aion-ui-core/combineActions';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  attachments: DeepReadonly<IAttachmentWithStatus[]>;
  deleteAttachment?: (id: string) => void;
};

const mapDispatchToProps = (dispatch: ThunkDispatch<CommonRootState, null, RootActions>) => ({
  downloadAttachment: (attachment: IAttachment) => dispatch(downloadTaskGroupAttachment(attachment))
});

type Props = OwnProps & ReturnType<typeof mapDispatchToProps>;

const TaskGroupAttachmentsContainer: React.FC<Props> = ({
  attachments,
  deleteAttachment,
  downloadAttachment
}: Props) => (
  <Grid item xs={12}>
    {attachments.map(attachment => (
      <Attachment
        key={`${attachment.fileName}${attachment.status}`}
        attachment={attachment}
        status={attachment.status}
        onClick={downloadAttachment}
        onDelete={deleteAttachment ? deleteAttachment : undefined}
        reason={attachment.causeOfFailure}
      />
    ))}
  </Grid>
);

export const TaskGroupAttachments = connect(null, mapDispatchToProps)(TaskGroupAttachmentsContainer);
