import * as React from 'react';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CommentIcon from '@material-ui/icons/Comment';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { IQuestionnaireSection, QuestionnaireSectionStatus } from '@pec/aion-ui-core/interfaces/questionnaireSection';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const { Complete, Incomplete, Untouched } = QuestionnaireSectionStatus;

const styles = () => ({
  listItemText: {
    paddingLeft: 0
  }
});

type Props = WithStyles<typeof styles> & Partial<IQuestionnaireSection>;

const QuestionnaireMenuItemContentComponent: React.FC<Props> = ({
  classes,
  status,
  unreadCommentCount,
  totalCommentCount,
  name
}) => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      {status === Complete && (
        <ListItemIcon>
          <CheckBoxIcon color="secondary" />
        </ListItemIcon>
      )}
      {status === Incomplete && (
        <ListItemIcon>
          <IndeterminateCheckBoxIcon />
        </ListItemIcon>
      )}
      {status === Untouched && (
        <ListItemIcon>
          <CheckBoxOutlineBlankIcon />
        </ListItemIcon>
      )}
      <ListItemText primary={name} className={classes.listItemText} />
      {unreadCommentCount && unreadCommentCount > 0 ? (
        <ListItemSecondaryAction>
          <CommentIcon titleAccess={t('subscriber.questionnaire.viewUnreadComments', 'View Unread Comments')} />
        </ListItemSecondaryAction>
      ) : (
        totalCommentCount !== undefined &&
        totalCommentCount > 0 && (
          <ListItemSecondaryAction>
            <CommentIcon
              color="disabled"
              titleAccess={t('subscriber.questionnaire.reviewComments', 'Review comments')}
            />
          </ListItemSecondaryAction>
        )
      )}
    </React.Fragment>
  );
};

export const QuestionnaireMenuItemContent = withStyles(styles)(QuestionnaireMenuItemContentComponent);
