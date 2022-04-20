import * as React from 'react';
import { connect } from 'react-redux';
import { fetchSafetyProgram } from '../actions/fetchSafetyProgram';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { SafetyProgramComponent } from '../components/SafetyProgram';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  safetyProgramId: string;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

const mapStateToProps = (state: RootState) => state.safetyProgram;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { safetyProgramId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchSafetyProgram: () => dispatch(fetchSafetyProgram(safetyProgramId))
});

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchSafetyProgram();
  }

  render() {
    const {
      safetyProgram,
      isFetching,
      error,
      match: {
        params: { safetyProgramId }
      }
    } = this.props;

    return (
      <SafetyProgramComponent
        safetyProgramId={safetyProgramId}
        safetyProgram={safetyProgram}
        isFetching={isFetching}
        error={error}
      />
    );
  }
}

export const SafetyProgramContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
