import * as React from 'react';
import withWidth, { isWidthUp, WithWidth } from '@material-ui/core/withWidth';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchRankings } from '@pec/aion-ui-core/actions/rankings';
import { fetchTrainingRequirementsIfNeeded } from 'actions/trainingRequirements';
import { fetchWorkerIfNeeded } from 'actions/fetchWorker';
import { getWorkersOffsetWhenLivesOnSiteChanges, getWorkersOffsetWhenStatusChanges } from 'helpers/updateWorker';
import { IRanking } from '@pec/aion-ui-core/interfaces/ranking';
import { IWorker, WorkerStatus } from 'interfaces/worker';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { NavContainer } from './Nav';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { updateWorker } from 'actions/updateWorker';
import { WorkerComponent } from 'components/Worker';
import { fetchEmployeeWorkTrainings } from 'actions/fetchEmployeeJobTraining';
import { _DeepReadonlyArray } from 'utility-types/dist/mapped-types';
import { fetchWorkGroups } from '@pec/aion-ui-core/actions/fetchWorkGroups';
import { WorkerWorkGroupComponent } from 'components/workerWorkGroup';
import { IEmployeeTrainingByWorkGroup } from 'interfaces/employeeTrainingByWorkgroup';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

type State = {
  isStepOne: boolean;
  workGroup: IEmployeeTrainingByWorkGroup | null;
  nameWorkGroupSelected: string;
  firstName: string;
  lastName: string;
};

type RouteParams = {
  organizationId: string;
  siteId: string;
  employeeId: string;
};

const mapStateToProps = (
  {
    worker: { worker, isFetching: isFetchingWorker, error: workerError },
    trainingRequirements: {
      trainingRequirements,
      isFetching: isFetchingTrainingRequirements,
      error: trainingRequirementsError
    },
    rankings: { rankings, isFetching: isFetchingRankings },
    site: { site },
    trainingProgramsByWorkgroup: { isFetching: isFetchingTrainingProgramsByWorkgroup, workGroups: trainingData },
    workGroups: { workGroups, isFetching: isFetchingWorkgroups }
  }: RootState,
  {
    match: {
      params: { organizationId: clientId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  trainingProgramsByWorkgroup: { trainingData },
  ranking: rankings && rankings.find(({ organization: { id } }: IRanking) => id === clientId),
  worker,
  trainingRequirements,
  isFetching:
    isFetchingWorker ||
    isFetchingTrainingRequirements ||
    isFetchingRankings ||
    isFetchingTrainingProgramsByWorkgroup ||
    isFetchingWorkgroups,
  error: workerError || trainingRequirementsError,
  siteWorkgroups: site?.workGroups || null,
  workgroups:
    (!!trainingData &&
      Object.keys(trainingData).map((k: string) => ({
        name: workGroups?.find(({ id }) => id === k)?.name,
        isCompliant: Object.values(trainingData[k].jobTypes).every(({ trainingRequirements }) =>
          trainingRequirements.every(({ isCompliant }) => isCompliant)
        ),
        id: k
      }))) ||
    null
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId: clientId, siteId, employeeId }
    },
    history
  }: RouteComponentProps<RouteParams>
) => ({
  fetchRankings: (contractorId: string) => dispatch(fetchRankings(clientId, contractorId)),
  fetchTrainingRequirementsIfNeeded: () => dispatch(fetchTrainingRequirementsIfNeeded(employeeId)),
  fetchWorkerIfNeeded: () => dispatch(fetchWorkerIfNeeded(clientId, siteId, employeeId)),
  updateWorker: (worker: IWorker, workersOffset: number, shouldRedirect: boolean) =>
    dispatch(updateWorker(clientId, worker, history, shouldRedirect, workersOffset)),
  fetchEmployeeWorkTrainings: (siteWorkgroups: _DeepReadonlyArray<string>) =>
    dispatch(fetchEmployeeWorkTrainings(clientId, employeeId, siteWorkgroups)),
  fetchWorkGroups: () => dispatch(fetchWorkGroups(clientId, null))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  WithWidth &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class Worker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.props.fetchWorkerIfNeeded();
    this.props.fetchTrainingRequirementsIfNeeded();
    this.props.fetchWorkGroups();
    props.siteWorkgroups && this.props.fetchEmployeeWorkTrainings(props.siteWorkgroups);
    this.state = {
      isStepOne: true,
      workGroup: null,
      nameWorkGroupSelected: '',
      firstName: '',
      lastName: ''
    };
  }

  componentDidUpdate({ worker: prevWorker }: Props) {
    const { worker, siteWorkgroups } = this.props;
    if (worker && (!prevWorker || prevWorker.id !== worker.id)) {
      this.props.fetchRankings(worker.organizationId);
      siteWorkgroups && this.props.fetchEmployeeWorkTrainings(siteWorkgroups);
    }
    this.props.fetchWorkerIfNeeded();
    this.props.fetchTrainingRequirementsIfNeeded();
  }

  changeStatus = (status: WorkerStatus) => async () => {
    const { worker } = this.props;
    const workersOffset = getWorkersOffsetWhenStatusChanges(!!(worker && worker.livesOnSite), status);
    return await this.props.updateWorker(
      {
        ...(worker as IWorker),
        status
      },
      workersOffset,
      true
    );
  };

  handleWorkGroupClick = (id: string, name: string, firstName: string, lastName: string) => () => {
    this.setState({
      nameWorkGroupSelected: name,
      firstName,
      lastName,
      workGroup:
        this.props.trainingProgramsByWorkgroup.trainingData !== null
          ? Object.values(this.props.trainingProgramsByWorkgroup.trainingData).reduce(
              (a: IEmployeeTrainingByWorkGroup, item) => {
                if (item.workGroupId === id) return { item };
                return a || null;
              },
              {} as IEmployeeTrainingByWorkGroup | null
            )
          : null
    });
  };

  handleGoBackWorkerSelected = () => {
    this.setState({ workGroup: null, nameWorkGroupSelected: '', firstName: '', lastName: '' });
  };

  handleStepChange = () => {
    this.setState(prevState => ({
      isStepOne: !prevState.isStepOne
    }));
  };
  handleClose = () => {
    this.setState({ isStepOne: true });
  };

  toggleLivesOnSite = async () => {
    const { worker } = this.props;
    if (worker) {
      const livesOnSite = !worker.livesOnSite;
      const workersOffset = getWorkersOffsetWhenLivesOnSiteChanges(livesOnSite, worker.status);
      await this.props.updateWorker({ ...worker, livesOnSite }, workersOffset, false);
    }
  };

  render() {
    const {
      ranking,
      worker,
      trainingRequirements,
      isFetching,
      error,
      match: {
        params: { organizationId, siteId, employeeId }
      },
      width,
      history,
      workgroups,
      t
    } = this.props;
    const { isStepOne, workGroup, nameWorkGroupSelected, firstName, lastName } = this.state;
    const children =
      worker && trainingRequirements && !isFetching ? (
        <React.Fragment>
          {!workGroup ? (
            <WorkerComponent
              overallRanking={ranking && ranking.overallRanking}
              worker={worker}
              trainingRequirements={trainingRequirements}
              changeStatus={this.changeStatus}
              organizationId={organizationId}
              siteId={siteId}
              toggleLivesOnSite={this.toggleLivesOnSite}
              history={history}
              showBackButton={!!employeeId}
              isStepOne={isStepOne}
              handleStepChange={this.handleStepChange}
              handleClose={this.handleClose}
              workgroups={workgroups}
              handleWorkGroupClick={this.handleWorkGroupClick}
            />
          ) : (
            <WorkerWorkGroupComponent
              workGroup={workGroup}
              handleGoBackWorkerSelected={this.handleGoBackWorkerSelected}
              nameWorkGroupSelected={nameWorkGroupSelected}
              firstName={firstName}
              lastName={lastName}
            />
          )}
        </React.Fragment>
      ) : error ? (
        <Error />
      ) : (
        <Loading />
      );

    return isWidthUp('md', width) ? (
      <React.Fragment>{children}</React.Fragment>
    ) : (
      <NavContainer title={t('smart.titles.identifiedWorker', 'Identified Worker')}>{children}</NavContainer>
    );
  }
}

export const WorkerContainer = withWidth()(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Worker)))
);
