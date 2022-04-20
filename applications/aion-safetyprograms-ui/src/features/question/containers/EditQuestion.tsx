import * as React from 'react';
import { connect } from 'react-redux';
import { deleteQuestion } from '../actions/deleteQuestion';
import { DropResult } from 'react-beautiful-dnd';
import { EditQuestionComponent } from '../components/EditQuestion';
import { fetchQuestion } from '../actions/fetchQuestion';
import { fetchSafetyProgram } from 'features/safetyProgram/actions/fetchSafetyProgram';
import { IEditQuestion } from 'interfaces/question';
import { resolveQuestionNumber } from 'helpers/questionNumber';
import { resolveSortOrder } from 'helpers/questionOrder';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { updateQuestion, updateSubquestionSortOrder } from '../actions/updateQuestion';

type RouteParams = {
  safetyProgramId: string;
  questionId: string;
};

const mapStateToProps = (
  {
    question: { question, isFetching: isFetchingQuestion, error: questionError },
    safetyProgram: { safetyProgram, isFetching: isFetchingSafetyProgram, error: safetyProgramError }
  }: RootState,
  {
    match: {
      params: { questionId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  question,
  safetyProgram,
  questionNumber: safetyProgram && resolveQuestionNumber(safetyProgram.questions, questionId),
  isFetching: isFetchingQuestion || isFetchingSafetyProgram,
  error: questionError || safetyProgramError
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { safetyProgramId, questionId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  deleteQuestion: () => dispatch(deleteQuestion(questionId)),
  fetchQuestion: () => dispatch(fetchQuestion(questionId)),
  fetchSafetyProgram: () => dispatch(fetchSafetyProgram(safetyProgramId)),
  updateQuestion: (values: IEditQuestion) => dispatch(updateQuestion(values)),
  updateSubquestionSortOrder: (
    subquestionId: string,
    sortOrder: number,
    sourceIndex: number,
    destinationIndex: number
  ) =>
    dispatch(
      updateSubquestionSortOrder(safetyProgramId, questionId, subquestionId, sortOrder, sourceIndex, destinationIndex)
    )
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchQuestion();
    props.fetchSafetyProgram();
  }

  componentDidUpdate({
    match: {
      params: { questionId: prevQuestionId }
    }
  }: Props) {
    const {
      match: {
        params: { questionId }
      },
      fetchQuestion
    } = this.props;

    if (questionId !== prevQuestionId) {
      fetchQuestion();
      window.scrollTo(0, 0);
    }
  }

  onConfirmDelete = async () => {
    const {
      deleteQuestion,
      history,
      match: {
        params: { safetyProgramId }
      }
    } = this.props;

    await deleteQuestion();
    history.push(`/safety-programs/${safetyProgramId}`);
  };

  onSubmit = (values: IEditQuestion) => this.props.updateQuestion(values);

  onDragEnd = async ({ draggableId, source, destination }: DropResult) => {
    const { question, updateSubquestionSortOrder } = this.props;

    if (question?.questions && destination && destination.index !== source.index) {
      const sortOrder = resolveSortOrder(question.questions, source.index, destination.index);

      await updateSubquestionSortOrder(draggableId, sortOrder, source.index, destination.index);
    }
  };

  render() {
    const {
      question,
      safetyProgram,
      questionNumber,
      isFetching,
      error,
      match: {
        params: { safetyProgramId, questionId }
      }
    } = this.props;

    return (
      <EditQuestionComponent
        safetyProgramId={safetyProgramId}
        questionId={questionId}
        onConfirmDelete={this.onConfirmDelete}
        onSubmit={this.onSubmit}
        onDragEnd={this.onDragEnd}
        question={question}
        safetyProgram={safetyProgram}
        questionNumber={questionNumber}
        isFetching={isFetching}
        error={error}
      />
    );
  }
}

export const EditQuestionContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Component));
