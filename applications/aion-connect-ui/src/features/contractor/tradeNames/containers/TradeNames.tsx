import * as React from 'react';
import { connect } from 'react-redux';
import { deleteTradeName, deleteTradeNameSuccess } from 'features/contractor/tradeName/actions/deleteTradeName';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { TradeNamesComponent } from '../components/TradeNames';

type RouteParams = {
  organizationId: string;
  contractorId?: string;
};

const mapStateToProps = (state: RootState) => ({
  ...state.tradeNames,
  ...state.profile
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  deleteTradeName: (tradeNameId: string) => () => dispatch(deleteTradeName(organizationId, tradeNameId)),
  deleteSuccess: (tradeNameId: string) => () => dispatch(deleteTradeNameSuccess(tradeNameId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class TradeNames extends React.Component<Props> {
  render() {
    const { error, tradeNames, deleteTradeName, deleteSuccess, viewAsClient } = this.props;

    return (
      <TradeNamesComponent
        error={error}
        tradeNames={tradeNames}
        deleteTradeName={deleteTradeName}
        deleteSuccess={deleteSuccess}
        viewAsClient={viewAsClient}
      />
    );
  }
}

export const TradeNamesContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(TradeNames));
