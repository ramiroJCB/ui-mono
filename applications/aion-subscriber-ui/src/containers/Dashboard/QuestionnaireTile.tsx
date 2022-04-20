import * as React from 'react';
import { connect } from 'react-redux';
import { fetchQuestionnaireSectionsIfNeeded } from '@pec/aion-ui-core/actions/questionnaireSections';
import { getOptionsIfNeeded, setOption } from '@pec/aion-ui-core/actions/options';
import { QuestionnaireTileComponent } from 'components/Dashboard/QuestionnaireTile';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';
import { Tile } from 'components/Tile';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = ({
  options: { questionnaireTileShowCompletedSections },
  questionnaireSections: { questionnaireSections, error }
}: RootState) => ({
  questionnaireTileShowCompletedSections,
  questionnaireSections,
  error
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchQuestionnaireSectionsIfNeeded: () => dispatch(fetchQuestionnaireSectionsIfNeeded(organizationId)),
  getOptionsIfNeeded: () => dispatch(getOptionsIfNeeded()),
  setQuestionnaireTileShowCompletedSections: (value: boolean) =>
    dispatch(setOption('questionnaireTileShowCompletedSections', value))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class QuestionnaireTile extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.getOptionsIfNeeded();
    props.fetchQuestionnaireSectionsIfNeeded();
  }

  handleCheckboxClick = () => {
    const { questionnaireTileShowCompletedSections: currentValue } = this.props;
    this.props.setQuestionnaireTileShowCompletedSections(!currentValue);
  };

  render() {
    const { questionnaireSections, error, questionnaireTileShowCompletedSections, t } = this.props;

    return questionnaireSections ? (
      <QuestionnaireTileComponent
        questionnaireSections={questionnaireSections}
        questionnaireTileShowCompletedSections={questionnaireTileShowCompletedSections}
        handleCheckboxClick={this.handleCheckboxClick}
      />
    ) : (
      <Tile
        isLoading={!error}
        hasError={!!error}
        primaryText={t('subscriber.dashboard.questionnaireTile.title', 'Questionnaire Progress')}
      />
    );
  }
}

export const QuestionnaireTileContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(QuestionnaireTile))
);
