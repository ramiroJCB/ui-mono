import * as React from 'react';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { connect } from 'react-redux';
import { deleteTraining } from '../actions/deleteTraining';
import { editTraining } from '../actions/editTraining';
import { fetchTrainingIfNeeded } from '../actions/fetchTraining';
import { fetchUserInfoIfNeeded, hasPermission } from '@pec/aion-ui-core/actions/userInfo';
import { FormApi } from 'final-form';
import { ITrainingRequirement } from '@pec/aion-ui-core/interfaces/trainingRequirement';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { TrainingGeneralInfoComponent } from '../components/TrainingGeneralInfo';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';

type RouteParams = {
  organizationId: string;
  trainingRequirementId: string;
};

const mapStateToProps = ({
  userInfo: { userInfo, isFetching: isFetchingUserInfo, error: userInfoError },
  training: { training, isFetching: isFetchingTraining, error: trainingError }
}: RootState) => ({
  isFetching: isFetchingUserInfo || isFetchingTraining,
  training,
  userInfo,
  error: userInfoError || trainingError
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, trainingRequirementId }
    },
    history
  }: RouteComponentProps<RouteParams>
) => ({
  fetchTrainingIfNeeded: () => dispatch(fetchTrainingIfNeeded(trainingRequirementId)),
  editTraining: (values: ITrainingRequirement) => dispatch(editTraining(trainingRequirementId, values)),
  deleteTraining: (trainingRequirementId: string) => () =>
    dispatch(deleteTraining(history, organizationId, trainingRequirementId)),
  fetchUserInfoIfNeeded: () => dispatch(fetchUserInfoIfNeeded())
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class TrainingGeneralInfo extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchTrainingIfNeeded();
    props.fetchUserInfoIfNeeded();
  }

  componentDidUpdate() {
    this.redirectIfDeleted();
  }

  redirectIfDeleted() {
    const {
      training,
      history,
      match: {
        params: { organizationId }
      }
    } = this.props;

    if (training && training.isDeleted) {
      history.replace(`/${organizationId}/training-compliance/training`);
    }
  }

  hasGlobalPermission = (action: ActivityAction, resourceName: ActivityResourceName) =>
    hasPermission(this.props.userInfo, action, resourceName);

  hasOrganizationPermission = (action: ActivityAction, resourceName: ActivityResourceName) => {
    const {
      userInfo,
      match: {
        params: { organizationId }
      }
    } = this.props;

    return organizationId
      ? hasPermission(userInfo, action, resourceName, [
          {
            type: UserInfoActivitiesType.Organization,
            id: organizationId
          }
        ])
      : false;
  };

  onSubmit = async (values: ITrainingRequirement, form: FormApi<ITrainingRequirement>) => {
    await this.props.editTraining(values);
    form.reset();
  };

  render() {
    const { training, isFetching, error, deleteTraining } = this.props;
    return (
      <TrainingGeneralInfoComponent
        training={training}
        isFetching={isFetching}
        error={error}
        onSubmit={this.onSubmit}
        hasGlobalPermission={this.hasGlobalPermission}
        hasOrganizationPermission={this.hasOrganizationPermission}
        deleteTraining={deleteTraining}
      />
    );
  }
}

export const TrainingGeneralInfoContainer = connect(mapStateToProps, mapDispatchToProps)(TrainingGeneralInfo);
