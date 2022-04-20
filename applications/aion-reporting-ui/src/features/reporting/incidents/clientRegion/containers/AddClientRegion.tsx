import * as React from 'react';
import { addClientIncidentRegion } from '../actions/addClientIncidentRegion';
import { ClientRegionForm } from './ClientRegionForm';
import { ClientRegionsContainer } from '../../clientRegions/containers/ClientRegions';
import { connect } from 'react-redux';
import { IIncidentRegion } from 'interfaces/incidentRegion';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => state.options;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  addClientIncidentRegion: (form: IIncidentRegion, showInactiveRegions: boolean) =>
    dispatch(addClientIncidentRegion(form, organizationId, showInactiveRegions))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class AddClientRegion extends React.Component<Props> {
  onSubmit = (form: IIncidentRegion) => this.props.addClientIncidentRegion(form, this.props.showInactiveRegions);

  render() {
    const {
      history,
      match: {
        params: { organizationId }
      }
    } = this.props;

    return (
      <ClientRegionsContainer history={history} organizationId={organizationId}>
        <ClientRegionForm onSubmit={this.onSubmit} />
      </ClientRegionsContainer>
    );
  }
}

export const AddClientRegionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddClientRegion);
