import * as React from 'react';
import { AnswerStatus } from 'interfaces/answer';
import { connect } from 'react-redux';
import { EvaluatorQuestionComponent } from '../components/EvaluatorQuestion';
import { fetchRequirementIfNeeded } from 'features/requirement/actions/fetchRequirement';
import { locateQuestion } from 'helpers/locateQuestion';
import { resetAnswerStatus, updateAnswerStatus } from 'features/answer/actions/updateAnswer';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  safetyProgramRequirementId: string;
  questionId: string;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

const mapStateToProps = (
  {
    requirement: { requirement, isFetching: isFetchingRequirement, error: requirementError },
    requirements: { search },
    answer: { isFetching: isFetchingAnswer, error: answerError },
    userInfo: { userInfo }
  }: RootState,
  {
    match: {
      params: { questionId }
    }
  }: RouteComponentProps<RouteParams>
) => {
  const isFetching = isFetchingRequirement || isFetchingAnswer;
  const answer = requirement && requirement.questionAnswers.find(answer => answer.questionId === questionId);

  return {
    requirement,
    search,
    isFetching,
    error: requirementError || answerError,
    question: requirement && locateQuestion(requirement.questions, questionId),
    answer,
    userInfo
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { safetyProgramRequirementId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchRequirementIfNeeded: () => dispatch(fetchRequirementIfNeeded(safetyProgramRequirementId)),
  resetAnswerStatus: (answerId: string) => dispatch(resetAnswerStatus(safetyProgramRequirementId, answerId)),
  updateAnswerStatus: (answerId: string, status: AnswerStatus) =>
    dispatch(updateAnswerStatus(safetyProgramRequirementId, answerId, status))
});

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.userInfo && props.fetchRequirementIfNeeded();
  }

  componentDidUpdate({ userInfo: prevUserInfo }: Props) {
    const { fetchRequirementIfNeeded, userInfo } = this.props;

    if (prevUserInfo === null && userInfo !== null) {
      fetchRequirementIfNeeded();
    }
  }

  changeAnswerStatus = (status: AnswerStatus) => () => {
    const { answer, updateAnswerStatus } = this.props;

    if (answer) {
      updateAnswerStatus(answer.id, status);
    }
  };

  resetAnswerStatus = () => {
    const { answer, resetAnswerStatus } = this.props;

    if (answer) {
      resetAnswerStatus(answer.id);
    }
  };

  render() {
    const {
      requirement,
      isFetching,
      error,
      question,
      answer,
      search,
      match: {
        params: { safetyProgramRequirementId, questionId }
      }
    } = this.props;

    return (
      <EvaluatorQuestionComponent
        requirement={requirement}
        isFetching={isFetching}
        error={error}
        question={question}
        answer={answer}
        safetyProgramRequirementId={safetyProgramRequirementId}
        questionId={questionId}
        changeAnswerStatus={this.changeAnswerStatus}
        resetAnswerStatus={this.resetAnswerStatus}
        search={search}
      />
    );
  }
}

export const EvaluatorQuestionContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
