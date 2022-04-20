import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import CheckIcon from '@material-ui/icons/Check';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorOutlineIcon from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';
import { AttachmentStatus } from '@pec/aion-ui-core/interfaces/attachmentWithStatus';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { IAttachment } from '@pec/aion-ui-core/interfaces/attachment';

const { Deleting, Downloading, Failed, Uploaded, Uploading } = AttachmentStatus;

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(0.5)
    }
  });

type OwnProps = {
  attachment: IAttachment;
  onClick?: (attachment: IAttachment) => void;
  onDelete?: (id: string) => void;
  status?: AttachmentStatus;
  reason?: string;
};

type Props = OwnProps & WithStyles<typeof styles>;

const AttachmentComponent: React.FC<Props> = ({ attachment, classes, onClick, onDelete, reason, status }) => {
  const renderAttachmentStatus = (status?: AttachmentStatus) => {
    let icon = null;

    switch (status) {
      case Deleting:
      case Downloading:
      case Uploading:
        icon = <CircularProgress size={15} />;
        break;
      case Uploaded:
        icon = <CheckIcon />;
        break;
      case Failed:
        icon = reason ? (
          <Tooltip placement="top" title={reason}>
            <ErrorOutlineIcon />
          </Tooltip>
        ) : (
          <ErrorOutlineIcon />
        );
        break;
      default:
        icon = <ErrorOutlineIcon />;
        break;
    }

    return <Avatar>{icon}</Avatar>;
  };

  const handleClick = (_event: React.MouseEvent) => (onClick ? onClick(attachment) : undefined);

  const handleDelete = (_event: React.MouseEvent) => (onDelete ? onDelete(attachment.id) : undefined);

  return (
    <Chip
      avatar={status ? renderAttachmentStatus(status) : undefined}
      classes={classes}
      onDelete={onDelete && status !== Failed ? handleDelete : undefined}
      label={attachment.fileName}
      onClick={status !== Failed ? handleClick : undefined}
    />
  );
};

export const Attachment = withStyles(styles)(AttachmentComponent);
