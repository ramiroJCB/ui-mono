import * as React from 'react';
import { connect } from 'react-redux';
import { ContractorReferenceComponent } from '../components/ContractorReference';
import { deleteReference } from '../actions/deleteReference';
import { fetchReference } from '../actions/fetchReference';
import { fetchRequirementIfNeeded } from 'features/requirement/actions/fetchRequirement';
import { fetchServerTokensIfNeeded } from '@pec/aion-ui-core/actions/serverTokens';
import { locateQuestion } from 'helpers/locateQuestion';
import { PercentCrop } from 'react-image-crop';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { updateReference } from '../actions/updateReference';

type RouteParams = {
  organizationId: string;
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
  deleteReference: () => dispatch(deleteReference(safetyProgramRequirementId, documentReferenceId)),
  fetchRequirementIfNeeded: () => dispatch(fetchRequirementIfNeeded(safetyProgramRequirementId)),
  fetchReference: () => dispatch(fetchReference(documentReferenceId)),
  fetchServerTokensIfNeeded: () => dispatch(fetchServerTokensIfNeeded()),
  updateReference: (pageNumber: number, crop: PercentCrop) =>
    dispatch(updateReference(documentReferenceId, pageNumber, crop))
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

  onConfirmDelete = async () => {
    const {
      question,
      history,
      deleteReference,
      match: {
        params: { organizationId, safetyProgramRequirementId }
      }
    } = this.props;

    if (question) {
      await deleteReference();
      history.push(
        `/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}/questions/${question.id}`
      );
    }
  };

  handleSubmit = async (pageNumber: number, crop: PercentCrop) => {
    const {
      question,
      history,
      updateReference,
      match: {
        params: { organizationId, safetyProgramRequirementId }
      }
    } = this.props;

    if (question) {
      await updateReference(pageNumber, crop);
      history.push(
        `/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}/questions/${question.id}`
      );
    }
  };

  render() {
    const {
      reference,
      requirement,
      question,
      isFetching,
      error,
      accessToken,
      match: {
        params: { organizationId, safetyProgramRequirementId, questionAnswerId, documentReferenceId }
      }
    } = this.props;

    return (
      <ContractorReferenceComponent
        reference={reference}
        requirement={requirement}
        question={question}
        isFetching={isFetching}
        error={error}
        accessToken={accessToken}
        onConfirmDelete={this.onConfirmDelete}
        handleSubmit={this.handleSubmit}
        organizationId={organizationId}
        safetyProgramRequirementId={safetyProgramRequirementId}
        questionAnswerId={questionAnswerId}
        documentReferenceId={documentReferenceId}
      />
    );
  }
}

export const ContractorReferenceContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
