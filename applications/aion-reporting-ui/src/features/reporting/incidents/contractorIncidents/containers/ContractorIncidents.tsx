import * as React from 'react';
import { connect } from 'react-redux';
import { ContractorIncidentsComponent } from '../components/ContractorIncidents';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchIncidentsByContractorIfNeeded } from '../../actions/fetchIncidentsByContractor';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => state.incidents;

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>, { organizationId }: OwnProps) => ({
  fetchIncidentsByContractorIfNeeded: () => dispatch(fetchIncidentsByContractorIfNeeded(organizationId))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps;

class ContractorIncidents extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchIncidentsByContractorIfNeeded();
  }

  render() {
    const { incidents, isFetching, error, organizationId } = this.props;

    return incidents && !isFetching ? (
      <ContractorIncidentsComponent incidents={incidents} organizationId={organizationId} />
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const ContractorIncidentsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContractorIncidents);
