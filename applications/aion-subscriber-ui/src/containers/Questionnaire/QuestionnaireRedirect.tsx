import * as React from 'react';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchQuestionnaireSectionsIfNeeded } from '@pec/aion-ui-core/actions/questionnaireSections';
import { History } from 'history';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { QuestionnaireSectionStatus } from '@pec/aion-ui-core/interfaces/questionnaireSection';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

type OwnProps = {
  history?: History;
};

const mapStateToProps = ({
  questionnaireSections: { questionnaireSections, error },
  options: { questionnaireLastViewedSectionId }
}: RootState) => {
  const defaultSection =
    questionnaireSections &&
    (questionnaireSections.find(q => q.id.toString() === questionnaireLastViewedSectionId) ||
      questionnaireSections.find(q => q.status !== QuestionnaireSectionStatus.Complete) ||
      questionnaireSections[0]);

  return {
    questionnaireSections,
    defaultSectionId: defaultSection && defaultSection.id,
    error
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchQuestionnaireSectionsIfNeeded: () => dispatch(fetchQuestionnaireSectionsIfNeeded(organizationId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  OwnProps;

class QuestionnaireRedirect extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchQuestionnaireSectionsIfNeeded();
    this.redirectToDefaultSectionIdIfAvailable();
  }

  componentDidUpdate() {
    this.redirectToDefaultSectionIdIfAvailable();
  }

  redirectToDefaultSectionIdIfAvailable() {
    const {
      defaultSectionId,
      history,
      match: {
        params: { organizationId }
      }
    } = this.props;

    if (defaultSectionId && history) {
      history.replace(`/${organizationId}/questionnaire/${defaultSectionId}`);
    }
  }

  render() {
    return this.props.error ? <Error /> : <Loading />;
  }
}

export const QuestionnaireRedirectContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(QuestionnaireRedirect)
);
