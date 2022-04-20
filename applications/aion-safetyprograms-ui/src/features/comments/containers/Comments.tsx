import * as React from 'react';
import { addComment } from 'features/comment/actions/addComment';
import { CommentsComponent } from '../components/Comments';
import { connect } from 'react-redux';
import { deleteComment } from 'features/comment/actions/deleteComment';
import { fetchComments } from '../actions/fetchComments';
import { fetchUserInfoIfNeeded } from '@pec/aion-ui-core/actions/userInfo';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { SafetyProgramRequirementStatus } from '@pec/aion-ui-core/interfaces/safetyProgramRequirementStatus';
import { ThunkDispatch } from 'redux-thunk';
import { updateComment } from 'features/comment/actions/updateComment';
import { updateComments } from '../actions/updateComments';

type OwnProps = {
  safetyProgramRequirementId: string;
  questionAnswerId: string;
  requirementStatus: SafetyProgramRequirementStatus;
  isReadOnly?: boolean;
  isEvaluator: boolean;
};

const mapStateToProps = ({
  comments: {
    comments,
    questionAnswerId: storedQuestionAnswerId,
    isFetching: isFetchingComments,
    isSubmitting,
    isUpdating,
    error: commentsError
  },
  userInfo: { userInfo, isFetching: isFetchingUserInfo, error: userInfoError }
}: RootState) => ({
  comments,
  userInfo,
  storedQuestionAnswerId,
  isFetching: isFetchingComments || isFetchingUserInfo,
  isSubmitting,
  isUpdating,
  error: commentsError || userInfoError
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  { safetyProgramRequirementId, questionAnswerId, isEvaluator }: OwnProps
) => ({
  addComment: (value: string) => dispatch(addComment(safetyProgramRequirementId, questionAnswerId, value, isEvaluator)),
  deleteComment: (commentId: string) => dispatch(deleteComment(safetyProgramRequirementId, commentId)),
  fetchComments: () => dispatch(fetchComments(questionAnswerId)),
  fetchUserInfoIfNeeded: () => dispatch(fetchUserInfoIfNeeded()),
  updateComment: (commentId: string, isRead: boolean) =>
    dispatch(updateComment(safetyProgramRequirementId, commentId, isRead)),
  updateComments: (isRead: boolean) => dispatch(updateComments(safetyProgramRequirementId, questionAnswerId, isRead))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps;

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchComments();
    props.fetchUserInfoIfNeeded();
  }

  componentDidUpdate() {
    const { isFetching, error, questionAnswerId, storedQuestionAnswerId, fetchComments } = this.props;

    if (!isFetching && !error && questionAnswerId !== storedQuestionAnswerId) {
      fetchComments();
    }
  }

  handleSubmit = (value: string) => this.props.addComment(value);

  handleChangeIsRead = (id: string, isRead: boolean) => () => this.props.updateComment(id, isRead);

  handleChangeAllIsRead = (isRead: boolean) => () => this.props.updateComments(isRead);

  handleDelete = (id: string) => () => this.props.deleteComment(id);

  render() {
    const {
      comments,
      isFetching,
      isSubmitting,
      isUpdating,
      error,
      requirementStatus,
      userInfo,
      isEvaluator,
      isReadOnly
    } = this.props;

    return (
      <CommentsComponent
        comments={comments}
        userInfo={userInfo}
        isFetching={isFetching}
        isSubmitting={isSubmitting}
        isUpdating={isUpdating}
        error={error}
        requirementStatus={requirementStatus}
        handleSubmit={this.handleSubmit}
        handleChangeIsRead={this.handleChangeIsRead}
        handleChangeAllIsRead={this.handleChangeAllIsRead}
        handleDelete={this.handleDelete}
        isEvaluator={isEvaluator}
        isReadOnly={isReadOnly}
      />
    );
  }
}

export const CommentsContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
