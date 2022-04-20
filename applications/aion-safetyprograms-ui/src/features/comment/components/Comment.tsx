import * as React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DraftsIcon from '@material-ui/icons/Drafts';
import IconButton from '@material-ui/core/IconButton';
import MailIcon from '@material-ui/icons/Mail';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { Dialog, TriggerButtonProps } from '@pec/aion-ui-components/components/Dialog';
import { IComment } from 'interfaces/comment';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';
import { localizeDateTime } from '@pec/aion-ui-i18next/helpers/localize';

const styles = (theme: Theme) => ({
  comment: {
    borderLeft: `1px solid ${theme.palette.secondary.main}`,
    paddingLeft: theme.spacing(1),
    '&.isRead': {
      borderLeftColor: theme.palette.text.disabled
    }
  }
});

type OwnProps = {
  comment: IComment;
  isEvaluator: boolean;
  isUpdating: boolean;
  handleChangeIsRead?: (id: string, isRead: boolean) => () => Promise<IComment>;
  handleDelete?: (id: string) => () => Promise<void>;
};

type Props = WithStyles<typeof styles> & OwnProps & I18nextProps;

class Component extends React.Component<Props> {
  renderTriggerButton = (props: TriggerButtonProps) => {
    const { isUpdating, t } = this.props;

    return (
      <Tooltip title={t('safetyPrograms.comment.delete', 'Delete').toString()}>
        <IconButton disabled={isUpdating} {...props}>
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  };

  render() {
    const {
      comment: { isRead, createdBy, createdDateUtc, comments, id, isEvaluatorComment },
      isEvaluator,
      isUpdating,
      handleChangeIsRead,
      handleDelete,
      classes,
      t
    } = this.props;

    return (
      <Box display="flex" m={1.5} mt={3} mb={3}>
        <Box flexGrow={1}>
          <div className={`${classes.comment} ${isRead ? 'isRead' : ''}`}>
            <Typography variant="subtitle2" color={isRead ? 'textSecondary' : 'secondary'}>
              {isEvaluatorComment && !isEvaluator && createdBy !== 'SYSTEM'
                ? t('safetyPrograms.comment.verificationSpecialist', 'Verification Specialist')
                : createdBy}{' '}
              · {localizeDateTime(createdDateUtc, t)}
            </Typography>
            <Typography color={isRead ? 'textSecondary' : undefined} style={{ whiteSpace: 'pre-line' }}>
              {comments}
            </Typography>
          </div>
        </Box>
        {(handleChangeIsRead || handleDelete) && (
          <Box display="flex" alignSelf="center" justifyContent="flex-end" ml={3}>
            {handleChangeIsRead &&
              (isRead ? (
                <Tooltip title={t('safetyPrograms.comment.markAsUnread', 'Mark as Unread').toString()}>
                  <span>
                    <IconButton onClick={handleChangeIsRead(id, false)} disabled={isUpdating}>
                      <MailIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              ) : (
                <Tooltip title={t('safetyPrograms.comment.markAsRead', 'Mark as Read').toString()}>
                  <span>
                    <IconButton onClick={handleChangeIsRead(id, true)} disabled={isUpdating}>
                      <DraftsIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              ))}
            {handleDelete && (
              <Dialog renderTriggerButton={this.renderTriggerButton} onConfirm={handleDelete(id)}>
                {({ handleClose, handleConfirm }) => (
                  <React.Fragment>
                    <DialogContent>
                      <DialogContentText>
                        {t(
                          'safetyPrograms.comment.deleteCommentConfirmation',
                          'Are you sure you want to delete this comment?'
                        )}
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button color="primary" onClick={handleClose}>
                        {t('safetyPrograms.common.cancel', 'Cancel')}
                      </Button>
                      <Button color="secondary" variant="contained" onClick={handleConfirm}>
                        {t('safetyPrograms.common.yesDeleteIt', 'Yes, delete it')}
                      </Button>
                    </DialogActions>
                  </React.Fragment>
                )}
              </Dialog>
            )}
          </Box>
        )}
      </Box>
    );
  }
}

export const CommentComponent = withStyles(styles)(withTranslation()(Component));
