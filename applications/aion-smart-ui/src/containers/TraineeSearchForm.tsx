import * as React from 'react';
import { connect } from 'react-redux';
import { createEmployedTrainee } from 'actions/createEmployedTrainee';
import { formatSelectedTrainee, formatUserInput } from 'helpers/formatTrainee';
import { IEmployedTrainee } from 'interfaces/employedTrainee';
import { ISearchTraineesForm } from 'interfaces/searchTraineesForm';
import { ITraineeWithEmployees } from '@pec/aion-ui-core/interfaces/trainee';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { searchTraineesIfNeeded } from 'actions/searchTrainees';
import { ThunkDispatch } from 'redux-thunk';
import { TraineeSearchFormComponent } from 'components/TraineeSearchForm';
import { TraineeSearchResults } from 'components/TraineeSearchResults';

type RouteParams = {
  organizationId: string;
  siteId: string;
};

const mapStateToProps = ({
  searchTrainees: {
    isFetching: isFetchingSearchTrainees,
    error: searchTraineesError,
    searchTrainees,
    userProvidedInfo
  },
  employedTrainee: { isFetching: isFetchingEmployedTrainee, error: employedTraineeError }
}: RootState) => ({
  isFetching: isFetchingSearchTrainees || isFetchingEmployedTrainee,
  error: searchTraineesError || employedTraineeError,
  searchTrainees,
  userProvidedInfo
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    history,
    match: {
      params: { organizationId, siteId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  searchTraineesIfNeeded: (searchTraineesForm: ISearchTraineesForm) =>
    dispatch(searchTraineesIfNeeded(searchTraineesForm, history, organizationId, siteId)),
  createEmployedTrainee: (selectedTrainee: IEmployedTrainee) =>
    dispatch(createEmployedTrainee(selectedTrainee, history, organizationId, siteId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class TraineeSearchFormContainer extends React.Component<Props> {
  onSubmit = async (searchTraineesForm: ISearchTraineesForm) =>
    await this.props.searchTraineesIfNeeded(searchTraineesForm);

  handleTraineeNotFound = (userProvidedInfo: ISearchTraineesForm) => () => {
    const formattedUserInput = formatUserInput(userProvidedInfo);
    this.props.createEmployedTrainee(formattedUserInput);
  };

  handleItemClick = (trainee: ITraineeWithEmployees, selectedEmployee?: number) => () => {
    const {
      match: {
        params: { organizationId: orgId, siteId }
      },
      userProvidedInfo,
      history
    } = this.props;

    if (selectedEmployee !== undefined && trainee.userId) {
      history.push(`/${orgId}/sites/${siteId}/workers/${trainee.employees[selectedEmployee].id}`);
    } else {
      if (userProvidedInfo) {
        const selectedTrainee = formatSelectedTrainee(userProvidedInfo, trainee, selectedEmployee);
        this.props.createEmployedTrainee(selectedTrainee);
      }
    }
  };

  render() {
    const {
      match: {
        params: { organizationId, siteId }
      },
      location: { state },
      searchTrainees,
      isFetching,
      userProvidedInfo
    } = this.props;

    return !isFetching ? (
      state && state.showTraineeSearchResults && searchTrainees && userProvidedInfo ? (
        <TraineeSearchResults
          organizationId={organizationId}
          showBackButton
          siteId={siteId}
          trainees={searchTrainees}
          handleItemClick={this.handleItemClick}
          handleTraineeNotFound={this.handleTraineeNotFound}
          userProvidedInfo={userProvidedInfo}
        />
      ) : (
        <TraineeSearchFormComponent onSubmit={this.onSubmit} />
      )
    ) : (
      <Loading />
    );
  }
}

export const TraineeSearchForm = withRouter(connect(mapStateToProps, mapDispatchToProps)(TraineeSearchFormContainer));
