import * as React from 'react';
import { Breadcrumbs } from '@pec/aion-ui-components/components/Breadcrumbs';
import { connect } from 'react-redux';
import { fetchTrainingIfNeeded } from 'features/operator/training/actions/fetchTraining';
import { IBreadcrumbLink } from '@pec/aion-ui-core/interfaces/breadcrumbLink';
import { matchPath, RouteComponentProps, withRouter } from 'react-router-dom';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  trainingRequirementId?: string;
};

const mapStateToProps = ({ training: { training, isFetching: isFetchingTraining } }: RootState) => ({
  isFetchingTraining,
  training
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { trainingRequirementId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchTrainingIfNeeded: () => trainingRequirementId && dispatch(fetchTrainingIfNeeded(trainingRequirementId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class TrainingRequirementsBreadcrumbs extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchTrainingIfNeeded();
  }

  render() {
    const {
      isFetchingTraining,
      training,
      location,
      match: {
        params: { organizationId, trainingRequirementId }
      },
      t
    } = this.props;

    const links: IBreadcrumbLink[] = [
      {
        to: `/${organizationId}/training-compliance/training`,
        label: t('trainingCompliance.common.trainingRequirements', 'Training Requirements')
      }
    ];

    if (matchPath(location.pathname, '/:organizationId/training-compliance/training/add')) {
      links.push({
        to: { pathname: `/${organizationId}/training-compliance/training/add` },
        label: t('trainingCompliance.common.newCustomTrainingRequirement', 'New Custom Training Requirement')
      });
    }

    if (trainingRequirementId && !isFetchingTraining && training) {
      links.push({
        to: { pathname: `/${organizationId}/training-compliance/training/${trainingRequirementId}/general-info` },
        label: training.name
      });
    }

    return <Breadcrumbs links={links.map((link, i) => ({ ...link, i }))} />;
  }
}

export const TrainingRequirementsBreadcrumbsContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(TrainingRequirementsBreadcrumbs))
);
