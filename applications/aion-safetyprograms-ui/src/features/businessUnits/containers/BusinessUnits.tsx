import * as React from 'react';
import { BusinessUnitsComponent } from '../components/BusinessUnits';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchBusinessUnits } from '../actions/fetchBusinessUnits';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  clientId: string;
};

const mapStateToProps = (state: RootState) => state.businessUnits;

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>, { clientId }: OwnProps) => ({
  fetchBusinessUnits: () => dispatch(fetchBusinessUnits(clientId))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps;

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchBusinessUnits();
  }

  render() {
    const { businessUnits, isFetching, error } = this.props;

    return !isFetching && businessUnits ? (
      <BusinessUnitsComponent businessUnits={businessUnits} />
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const BusinessUnitsContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
