import * as React from 'react';
import { connect } from 'react-redux';
import { EvaluatorReferenceComponent } from '../components/EvaluatorReference';
import { fetchReference } from '../actions/fetchReference';
import { fetchRequirementIfNeeded } from 'features/requirement/actions/fetchRequirement';
import { fetchServerTokensIfNeeded } from '@pec/aion-ui-core/actions/serverTokens';
import { locateQuestion } from 'helpers/locateQuestion';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId?: string;
  safetyProgramRequirementId: string;
  questionAnswerId: string;
  documentReferenceId: string;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

const mapStateToProps = (
  {
    requirement: { requirement, error: requirementError, isFetching: isFetchingRequirement },
    requirements: { search },
    reference: { reference, error: referenceError, isFetching: isFetchingReference },
    serverTokens: { serverTokens, error: serverTokensError, isFetching: isFetchingServerTokens },
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
    search,
    reference,
    accessToken: serverTokens?.accessToken,
    error: requirementError || referenceError || serverTokensError,
    isFetching: isFetchingRequirement || isFetchingReference || isFetchingServerTokens,
    question: requirement && answer && locateQuestion(requirement.questions, answer.questionId),
    userInfo
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { safetyProgramRequirementId, documentReferenceId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchRequirementIfNeeded: () => dispatch(fetchRequirementIfNeeded(safetyProgramRequirementId)),
  fetchReference: () => dispatch(fetchReference(documentReferenceId)),
  fetchServerTokensIfNeeded: () => dispatch(fetchServerTokensIfNeeded())
});

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchServerTokensIfNeeded();
    props.userInfo && props.fetchRequirementIfNeeded();
    props.fetchReference();
  }

  componentDidUpdate({ userInfo: prevUserInfo }: Props) {
    const { fetchRequirementIfNeeded, userInfo } = this.props;

    if (prevUserInfo === null && userInfo !== null) {
      fetchRequirementIfNeeded();
    }
  }

  render() {
    const {
      reference,
      requirement,
      question,
      isFetching,
      error,
      accessToken,
      search,
      match: {
        params: { organizationId, safetyProgramRequirementId, questionAnswerId, documentReferenceId }
      }
    } = this.props;

    return (
      <EvaluatorReferenceComponent
        organizationId={organizationId}
        reference={reference}
        requirement={requirement}
        question={question}
        isFetching={isFetching}
        error={error}
        accessToken={accessToken}
        safetyProgramRequirementId={safetyProgramRequirementId}
        questionAnswerId={questionAnswerId}
        documentReferenceId={documentReferenceId}
        search={search}
      />
    );
  }
}

export const EvaluatorReferenceContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
