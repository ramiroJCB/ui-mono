import * as React from 'react';
import { connect } from 'react-redux';
import { ContractorQuestionComponent } from '../components/ContractorQuestion';
import { fetchRequirementIfNeeded } from 'features/requirement/actions/fetchRequirement';
import { IAnswerForm } from 'interfaces/answer';
import { locateQuestion } from 'helpers/locateQuestion';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { updateAnswer } from 'features/answer/actions/updateAnswer';

type RouteParams = {
  organizationId: string;
  safetyProgramRequirementId: string;
  questionId: string;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

const mapStateToProps = (
  {
    requirement: { requirement, isFetching: isFetchingRequirement, error: requirementError },
    answer: { isFetching: isFetchingAnswer, error: answerError },
    userInfo: { userInfo }
  }: RootState,
  {
    match: {
      params: { questionId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  requirement,
  isFetching: isFetchingRequirement || isFetchingAnswer,
  error: requirementError || answerError,
  question: requirement && locateQuestion(requirement.questions, questionId),
  answer: requirement && requirement.questionAnswers.find(answer => answer.questionId === questionId),
  userInfo
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { safetyProgramRequirementId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchRequirementIfNeeded: () => dispatch(fetchRequirementIfNeeded(safetyProgramRequirementId)),
  updateAnswer: (values: IAnswerForm) => dispatch(updateAnswer(values))
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

  handleChangeAnswerValue = (_event: React.ChangeEvent, value: 'true' | 'false') => {
    const {
      answer,
      updateAnswer,
      match: {
        params: { organizationId, safetyProgramRequirementId, questionId }
      }
    } = this.props;

    return updateAnswer({
      id: answer?.id,
      questionId,
      organizationId,
      safetyProgramRequirementId,
      answerValue: value
    });
  };

  render() {
    const {
      requirement,
      isFetching,
      error,
      question,
      answer,
      match: {
        params: { organizationId, safetyProgramRequirementId, questionId }
      }
    } = this.props;

    return (
      <ContractorQuestionComponent
        requirement={requirement}
        isFetching={isFetching}
        error={error}
        question={question}
        answer={answer}
        organizationId={organizationId}
        safetyProgramRequirementId={safetyProgramRequirementId}
        questionId={questionId}
        handleChangeAnswerValue={this.handleChangeAnswerValue}
      />
    );
  }
}

export const ContractorQuestionContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
