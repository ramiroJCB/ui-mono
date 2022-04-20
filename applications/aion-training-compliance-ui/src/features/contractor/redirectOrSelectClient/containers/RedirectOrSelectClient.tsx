import * as React from 'react';
import BusinessIcon from '@material-ui/icons/Business';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchClientsIfNeeded } from '@pec/aion-ui-core/actions/selectClient';
import { IconCard } from '@pec/aion-ui-components/components/IconCard';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { SelectClientComponent } from '@pec/aion-ui-components/components/SelectClient';
import { ThunkDispatch } from 'redux-thunk';
import { Redirect } from 'react-router';
import { OrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';

const { TrainingCompliance } = OrganizationFeature;

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => state.clients;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchClientsIfNeeded: () => dispatch(fetchClientsIfNeeded(organizationId, [TrainingCompliance]))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class RedirectOrSelectClient extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchClientsIfNeeded();
  }

  render() {
    const {
      clients,
      isFetching,
      error,
      match: {
        params: { organizationId }
      }
    } = this.props;

    return clients && !isFetching ? (
      clients.length === 1 ? (
        <Redirect to={`/${organizationId}/training-compliance/clients/${clients[0].id}/work-groups`} />
      ) : (
        <SelectClientComponent clients={clients}>
          {({ id, name }) => (
            <IconCard
              to={`/${organizationId}/training-compliance/clients/${id}/work-groups`}
              icon={<BusinessIcon />}
              primaryText={name}
            />
          )}
        </SelectClientComponent>
      )
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const RedirectOrSelectClientContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RedirectOrSelectClient);
