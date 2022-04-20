import * as React from 'react';
import { connect } from 'react-redux';
import { getWorkersOffsetWhenLivesOnSiteChanges, getWorkersOffsetWhenStatusChanges } from 'helpers/updateWorker';
import { IWorker, WorkerStatus } from 'interfaces/worker';
import { LastActivityComponent } from 'components/LastActivity';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { updateWorker } from 'actions/updateWorker';

type RouteParams = {
  organizationId: string;
  siteId: string;
};

type OwnProps = {
  inputRef: React.RefObject<HTMLInputElement>;
};

const mapStateToProps = (state: RootState) => state.worker;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    history,
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  updateWorker: (worker: IWorker, workersOffset: number) =>
    dispatch(updateWorker(organizationId, worker, history, false, workersOffset))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  OwnProps &
  RouteComponentProps<RouteParams>;

class LastActivity extends React.Component<Props> {
  focusInput() {
    const { inputRef } = this.props;
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }
  changeStatus = (status: WorkerStatus) => async () => {
    const { worker } = this.props;
    const workersOffset = getWorkersOffsetWhenStatusChanges(!!(worker && worker.livesOnSite), status);
    this.focusInput();

    return await this.props.updateWorker(
      {
        ...(worker as IWorker),
        status
      },
      workersOffset
    );
  };

  toggleLivesOnSite = async () => {
    const { worker } = this.props;
    if (worker) {
      const livesOnSite = !worker.livesOnSite;
      const workersOffset = getWorkersOffsetWhenLivesOnSiteChanges(livesOnSite, worker.status);
      await this.props.updateWorker({ ...worker, livesOnSite }, workersOffset);
      this.focusInput();
    }
  };

  render() {
    const {
      worker,
      match: {
        params: { organizationId, siteId }
      }
    } = this.props;
    return worker && worker.siteId === siteId ? (
      <LastActivityComponent
        worker={worker}
        changeStatus={this.changeStatus}
        organizationId={organizationId}
        toggleLivesOnSite={this.toggleLivesOnSite}
      />
    ) : null;
  }
}

export const LastActivityContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(LastActivity));
