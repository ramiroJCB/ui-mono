import * as React from 'react';
import { ClientQuestionComponent } from '../components/ClientQuestion';
import { connect } from 'react-redux';
import { fetchRequirementIfNeeded } from 'features/requirement/actions/fetchRequirement';
import { locateQuestion } from 'helpers/locateQuestion';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
  safetyProgramRequirementId: string;
  questionId: string;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

const mapStateToProps = (
  { requirement: { requirement, isFetching, error }, requirements: { search }, userInfo: { userInfo } }: RootState,
  {
    match: {
      params: { questionId }
    }
  }: RouteComponentProps<RouteParams>
) => {
  const answer = requirement && requirement.questionAnswers.find(answer => answer.questionId === questionId);

  return {
    requirement,
    search,
    isFetching,
    error,
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
  fetchRequirementIfNeeded: () => dispatch(fetchRequirementIfNeeded(safetyProgramRequirementId))
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

  render() {
    const {
      requirement,
      isFetching,
      error,
      question,
      answer,
      search,
      match: {
        params: { organizationId, safetyProgramRequirementId, questionId }
      }
    } = this.props;

    return (
      <ClientQuestionComponent
        organizationId={organizationId}
        requirement={requirement}
        isFetching={isFetching}
        error={error}
        question={question}
        answer={answer}
        safetyProgramRequirementId={safetyProgramRequirementId}
        questionId={questionId}
        search={search}
      />
    );
  }
}

export const ClientQuestionContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
