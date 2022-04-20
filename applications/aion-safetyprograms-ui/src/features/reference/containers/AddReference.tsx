import * as React from 'react';
import { addReference } from '../actions/addReference';
import { AddReferenceComponent } from '../components/AddReference';
import { connect } from 'react-redux';
import { fetchDocument } from 'features/document/actions/fetchDocument';
import { fetchRequirementIfNeeded } from 'features/requirement/actions/fetchRequirement';
import { fetchServerTokensIfNeeded } from '@pec/aion-ui-core/actions/serverTokens';
import { locateQuestion } from 'helpers/locateQuestion';
import { PercentCrop } from 'react-image-crop';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
  safetyProgramRequirementId: string;
  questionAnswerId: string;
  documentMetadataId: string;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

const mapStateToProps = (
  {
    requirement: { requirement, error: requirementError, isFetching: isFetchingRequirement },
    document: { document, error: documentError, isFetching: isFetchingDocument },
    reference: { isFetching: isFetchingReference },
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
    document,
    accessToken: serverTokens?.accessToken,
    error: requirementError || documentError || serverTokensError,
    isFetching: isFetchingRequirement || isFetchingDocument || isFetchingReference || isFetchingServerTokens,
    question: requirement && answer && locateQuestion(requirement.questions, answer.questionId),
    userInfo
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { safetyProgramRequirementId, questionAnswerId, documentMetadataId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  addReference: (pageNumber: number, crop: PercentCrop) =>
    dispatch(
      addReference(safetyProgramRequirementId, {
        questionAnswerId,
        pageNumber,
        selectionLocation: crop,
        documentMetadataId
      })
    ),
  fetchRequirementIfNeeded: () => dispatch(fetchRequirementIfNeeded(safetyProgramRequirementId)),
  fetchDocument: () => dispatch(fetchDocument(documentMetadataId)),
  fetchServerTokensIfNeeded: () => dispatch(fetchServerTokensIfNeeded())
});

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchServerTokensIfNeeded();
    props.userInfo && props.fetchRequirementIfNeeded();
    props.fetchDocument();
  }

  componentDidUpdate({ userInfo: prevUserInfo }: Props) {
    const { fetchRequirementIfNeeded, userInfo } = this.props;

    if (prevUserInfo === null && userInfo !== null) {
      fetchRequirementIfNeeded();
    }
  }

  handleSubmit = async (pageNumber: number, crop: PercentCrop) => {
    const {
      question,
      history,
      addReference,
      match: {
        params: { organizationId, safetyProgramRequirementId }
      }
    } = this.props;

    if (question) {
      await addReference(pageNumber, crop);
      history.push(
        `/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}/questions/${question.id}`
      );
    }
  };

  render() {
    const {
      document,
      requirement,
      question,
      isFetching,
      error,
      accessToken,
      match: {
        params: { organizationId, safetyProgramRequirementId, questionAnswerId, documentMetadataId }
      }
    } = this.props;

    return (
      <AddReferenceComponent
        document={document}
        requirement={requirement}
        question={question}
        isFetching={isFetching}
        error={error}
        accessToken={accessToken}
        handleSubmit={this.handleSubmit}
        organizationId={organizationId}
        safetyProgramRequirementId={safetyProgramRequirementId}
        questionAnswerId={questionAnswerId}
        documentMetadataId={documentMetadataId}
      />
    );
  }
}

export const AddReferenceContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
