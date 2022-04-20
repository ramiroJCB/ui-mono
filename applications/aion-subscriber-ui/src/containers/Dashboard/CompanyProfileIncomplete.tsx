import * as React from 'react';
import { CompanyProfileIncompleteComponent } from 'components/Dashboard/CompanyProfileIncomplete';
import { connect } from 'react-redux';
import { fetchQuestionnaireSectionsIfNeeded } from '@pec/aion-ui-core/actions/questionnaireSections';
import { QuestionnaireSectionStatus } from '@pec/aion-ui-core/interfaces/questionnaireSection';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';

const { Complete } = QuestionnaireSectionStatus;

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => {
  const { questionnaireSections } = state.questionnaireSections;
  let profileIsIncomplete = false;
  let additionalInfoIsIncomplete = false;

  if (questionnaireSections) {
    profileIsIncomplete = questionnaireSections.some(qs => qs.id === 1 && qs.status !== Complete);
    additionalInfoIsIncomplete = questionnaireSections.some(qs => qs.id === 224 && qs.status !== Complete);
  }

  return {
    profileIsIncomplete,
    additionalInfoIsIncomplete
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
  fetchQuestionnaireSectionsIfNeeded: () => dispatch(fetchQuestionnaireSectionsIfNeeded(organizationId)),
  organizationId
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class CompanyProfileIncomplete extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchQuestionnaireSectionsIfNeeded();
  }

  render() {
    const { profileIsIncomplete, additionalInfoIsIncomplete } = this.props;

    return (
      <CompanyProfileIncompleteComponent
        profileIsIncomplete={profileIsIncomplete}
        additionalInfoIsIncomplete={additionalInfoIsIncomplete}
      />
    );
  }
}

export const CompanyProfileIncompleteContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CompanyProfileIncomplete)
);
