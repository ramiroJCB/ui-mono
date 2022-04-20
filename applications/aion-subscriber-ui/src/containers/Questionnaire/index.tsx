import * as React from 'react';
import QuestionnaireComponent from 'components/Questionnaire';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import {
  fetchQuestionnaireSections,
  fetchQuestionnaireSectionsIfNeeded
} from '@pec/aion-ui-core/actions/questionnaireSections';
import { fetchRankings } from '@pec/aion-ui-core/actions/rankings';
import { getOptionsIfNeeded, setOption } from '@pec/aion-ui-core/actions/options';
import { History } from 'history';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  match: {
    params: {
      organizationId: string;
      questionnaireSectionId: string;
    };
  };
  history: History;
};

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
  const { questionnaireSections, error } = state.questionnaireSections;
  const {
    match: {
      params: { questionnaireSectionId }
    }
  } = ownProps;

  return {
    questionnaireSections,
    activeSection: questionnaireSections && questionnaireSections.find(q => q.id === +questionnaireSectionId),
    error
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, questionnaireSectionId }
    }
  }: OwnProps
) => ({
  fetchQuestionnaireSectionsIfNeeded: () => dispatch(fetchQuestionnaireSectionsIfNeeded(organizationId)),
  fetchQuestionnaireSections: () => dispatch(fetchQuestionnaireSections(organizationId)),
  fetchRankings: () => dispatch(fetchRankings(organizationId)),
  getOptionsIfNeeded: () => dispatch(getOptionsIfNeeded()),
  setQuestionnaireLastViewedSectionId: () =>
    dispatch(setOption('questionnaireLastViewedSectionId', questionnaireSectionId))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps;

class Questionnaire extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.setQuestionnaireLastViewedSectionId();
    props.fetchQuestionnaireSectionsIfNeeded();
    props.getOptionsIfNeeded();
  }

  render() {
    const {
      questionnaireSections,
      activeSection,
      error,
      match: {
        params: { organizationId }
      },
      history
    } = this.props;

    return activeSection ? (
      <QuestionnaireComponent
        questionnaireSections={questionnaireSections}
        activeSection={activeSection}
        organizationId={organizationId}
        fetchQuestionnaireSections={this.props.fetchQuestionnaireSections}
        fetchRankings={this.props.fetchRankings}
        history={history}
      />
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const QuestionnaireContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Questionnaire);
