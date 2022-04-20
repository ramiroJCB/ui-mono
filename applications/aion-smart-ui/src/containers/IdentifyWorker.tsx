import * as React from 'react';
import Box from '@material-ui/core/Box';
import withWidth, { isWidthDown, isWidthUp, WithWidth } from '@material-ui/core/withWidth';
import { addTraineeEmployer } from 'actions/addTraineeEmployer';
import { connect } from 'react-redux';
import { fetchTrainees } from 'actions/fetchTrainees';
import { IChangeEmployerForm } from 'interfaces/changeEmployerForm';
import { IdentifyWorkerForm } from 'components/IdentifyWorkerForm';
import { IdentifyWorkerResults } from 'components/IdentifyWorkerResults';
import { SeparatorComponent } from 'components/Separator';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { BarcodeScanButton } from 'components/BarcodeScanButton';
import { validatePecId } from '@pec/aion-ui-core/validators';

type RouteParams = {
  organizationId: string;
  siteId: string;
  contractorId: string;
  workerId?: string;
};

type OwnProps = {
  inputRef: React.RefObject<HTMLInputElement>;
};

const mapStateToProps = (state: RootState) => state.trainees;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  { history }: RouteComponentProps<RouteParams>
) => ({
  fetchTrainees: (pecIdentifier: string) => dispatch(fetchTrainees(pecIdentifier, history)),
  addTraineeEmployer: (newOrg: IChangeEmployerForm, traineeId: string) =>
    dispatch(addTraineeEmployer(newOrg, traineeId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  WithWidth &
  OwnProps &
  RouteComponentProps<RouteParams>;

const defaultProps = {
  bgcolor: 'background.paper',
  m: 1,
  border: 1,
  borderColor: 'text.disabled'
};
class IdentifyWorker extends React.Component<Props> {
  componentDidMount() {
    this.props.match.params.workerId &&
      this.props.match.params.workerId.includes('PEC', 0) &&
      Boolean(!validatePecId(this.props.match.params.workerId.substring(3, 12))) &&
      this.props.fetchTrainees(`${this.props.match.params.workerId}`);
  }
  onSubmit = async ({ pecIdentifier }: { pecIdentifier: string }) =>
    await this.props.fetchTrainees(`PEC${pecIdentifier}`);

  addEmployeeRecord = async (newOrg: IChangeEmployerForm, traineeId: string) =>
    await this.props.addTraineeEmployer(newOrg, traineeId);

  renderTraineesList = () => {
    const {
      isFetching,
      match: {
        params: { organizationId, siteId }
      },
      location: { state },
      pecIdentifier,
      trainees,
      width
    } = this.props;
    return state && state.showPecIdMatches && trainees && pecIdentifier ? (
      <IdentifyWorkerResults
        isFetching={isFetching}
        organizationId={organizationId}
        pecIdentifier={pecIdentifier}
        siteId={siteId}
        trainees={trainees}
        showBackButton={isWidthDown('sm', width)}
        handleChangeEmployer={this.addEmployeeRecord}
      />
    ) : null;
  };

  render() {
    const {
      inputRef,
      width,
      match: {
        params: { organizationId, siteId, workerId }
      },
      isFetching
    } = this.props;
    return isWidthUp('md', width) ? (
      <React.Fragment>
        <Box {...defaultProps}>
          <IdentifyWorkerForm onSubmit={this.onSubmit} workerId={workerId} inputRef={inputRef} />
        </Box>
        <SeparatorComponent />
        <Box {...defaultProps}>
          <BarcodeScanButton isFetching={isFetching} inCamera={false} organizationId={organizationId} siteId={siteId} />
        </Box>
        {this.renderTraineesList()}
      </React.Fragment>
    ) : (
      this.renderTraineesList() || (
        <React.Fragment>
          <IdentifyWorkerForm onSubmit={this.onSubmit} workerId={workerId} inputRef={inputRef} />
          <SeparatorComponent />
          <BarcodeScanButton isFetching={isFetching} inCamera={false} organizationId={organizationId} siteId={siteId} />
        </React.Fragment>
      )
    );
  }
}

export const IdentifyWorkerContainer = withWidth()(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(IdentifyWorker))
);
