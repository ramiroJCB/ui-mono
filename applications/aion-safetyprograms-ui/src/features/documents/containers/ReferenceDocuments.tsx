import * as React from 'react';
import { connect } from 'react-redux';
import { fetchRequirementIfNeeded } from 'features/requirement/actions/fetchRequirement';
import { locateQuestion } from 'helpers/locateQuestion';
import { ReferenceDocumentsComponent } from '../components/ReferenceDocuments';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
  safetyProgramRequirementId: string;
  questionAnswerId: string;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

const mapStateToProps = (
  {
    requirement: { requirement, error: requirementError, isFetching: isFetchingRequirement },
    documents: { error: documentsError, isFetching: isFetchingDocuments },
    userInfo: { userInfo }
  }: RootState,
  {
    match: {
      params: { questionAnswerId }
    }
  }: RouteComponentProps<RouteParams>
) => {
  const answer = requirement && requirement.questionAnswers.find(({ id }) => id === questionAnswerId);

  return {
    requirement,
    error: requirementError || documentsError,
    isFetching: isFetchingRequirement || isFetchingDocuments,
    question: requirement && answer && locateQuestion(requirement.questions, answer.questionId),
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
      isFetching,
      requirement,
      error,
      question,
      match: {
        params: { organizationId, safetyProgramRequirementId, questionAnswerId }
      }
    } = this.props;

    return (
      <ReferenceDocumentsComponent
        isFetching={isFetching}
        requirement={requirement}
        error={error}
        question={question}
        organizationId={organizationId}
        questionAnswerId={questionAnswerId}
        safetyProgramRequirementId={safetyProgramRequirementId}
      />
    );
  }
}

export const ReferenceDocumentsContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
