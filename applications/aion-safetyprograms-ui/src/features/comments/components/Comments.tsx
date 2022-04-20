import * as React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DraftsIcon from '@material-ui/icons/Drafts';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { AxiosError } from 'axios';
import { canChangeIsRead, canDeleteComment } from 'helpers/comment';
import { CommentComponent } from 'features/comment/components/Comment';
import { DeepReadonly } from 'ts-essentials';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IComment } from 'interfaces/comment';
import { IUserInfo } from '@pec/aion-ui-core/interfaces/userInfo';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { SafetyProgramRequirementStatus } from '@pec/aion-ui-core/interfaces/safetyProgramRequirementStatus';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

const styles = (theme: Theme) => ({
  paper: {
    paddingTop: theme.spacing(1.5)
  }
});

type OwnProps = {
  comments: DeepReadonly<IComment[]> | null;
  userInfo: DeepReadonly<IUserInfo> | null;
  isFetching: boolean;
  isSubmitting: boolean;
  isUpdating: boolean;
  error: DeepReadonly<AxiosError> | null;
  requirementStatus: SafetyProgramRequirementStatus;
  handleSubmit: (value: string) => Promise<IComment>;
  handleChangeIsRead: (id: string, isRead: boolean) => () => Promise<IComment>;
  handleChangeAllIsRead: (isRead: boolean) => () => Promise<void>;
  handleDelete: (id: string) => () => Promise<void>;
  isEvaluator: boolean;
  isReadOnly?: boolean;
};

type Props = WithStyles<typeof styles> & OwnProps & I18nextProps;

type State = {
  value: string;
};

class Component extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: ''
    };
  }

  handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      value: event.target.value
    });
  };

  handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await this.props.handleSubmit(this.state.value);
    this.setState({
      value: ''
    });
  };

  render() {
    const {
      comments,
      isFetching,
      isSubmitting,
      isUpdating,
      error,
      isEvaluator,
      isReadOnly,
      requirementStatus,
      handleChangeIsRead,
      handleChangeAllIsRead,
      handleDelete,
      userInfo,
      classes,
      t
    } = this.props;
    const { value } = this.state;
    const canMarkAllAsRead =
      userInfo &&
      comments?.some(({ isRead, isEvaluatorComment }) => !isRead && canChangeIsRead(userInfo, isEvaluatorComment));

    return (
      <Paper elevation={0} hasError={!!error} isLoading={isFetching} className={classes.paper}>
        <GridContainer style={{ padding: 0 }}>
          <GridContainer justify="space-between">
            <Grid item>
              <Typography variant="subtitle2">
                {t('safetyPrograms.common.questionDiscussion', 'Question Discussion')}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                onClick={handleChangeAllIsRead(true)}
                color="primary"
                variant="contained"
                size="small"
                disabled={!canMarkAllAsRead}
                startIcon={<DraftsIcon fontSize="small" />}
              >
                {t('safetyPrograms.comments.markAllAsRead', 'Mark all as read')}
              </Button>
            </Grid>
          </GridContainer>
          {!isReadOnly && (
            <Grid item xs={12} style={{ padding: 0 }}>
              <form onSubmit={this.handleSubmit}>
                <GridContainer>
                  <Grid item xs={12}>
                    <TextField
                      variant="filled"
                      multiline
                      rows={4}
                      fullWidth
                      placeholder={t('safetyPrograms.common.comment', 'Comment')}
                      onChange={this.handleChange}
                      value={value}
                      disabled={isSubmitting}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      color="secondary"
                      isSubmitting={isSubmitting}
                      disabled={!value || isSubmitting}
                    >
                      {isSubmitting ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        t('safetyPrograms.comments.saveComment', 'Save Comment')
                      )}
                    </LoadingButton>
                  </Grid>
                </GridContainer>
              </form>
            </Grid>
          )}
          {userInfo &&
            comments &&
            (comments.length > 0 ? (
              <Grid item xs={12} style={{ padding: 0 }}>
                {comments.map(comment => (
                  <CommentComponent
                    key={comment.id}
                    comment={comment}
                    isEvaluator={isEvaluator}
                    isUpdating={isUpdating}
                    handleChangeIsRead={
                      canChangeIsRead(userInfo, comment.isEvaluatorComment) ? handleChangeIsRead : undefined
                    }
                    handleDelete={canDeleteComment(userInfo, requirementStatus, comment) ? handleDelete : undefined}
                  />
                ))}
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Typography color="textSecondary">
                  {t('safetyPrograms.common.questionHasNoComments', 'This question has no comments.')}
                </Typography>
              </Grid>
            ))}
        </GridContainer>
      </Paper>
    );
  }
}

export const CommentsComponent = withStyles(styles)(withTranslation()(Component));
