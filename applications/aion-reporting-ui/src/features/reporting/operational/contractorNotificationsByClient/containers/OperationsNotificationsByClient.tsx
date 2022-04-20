import * as React from 'react';
import BusinessIcon from '@material-ui/icons/Business';
import { connect } from 'react-redux';
import { fetchOperationsNotificationsCountByClientIfNeeded } from '../actions';
import { IClient } from '@pec/aion-ui-core/interfaces/client';
import { IconCard } from '@pec/aion-ui-components/components/IconCard';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  client: IClient;
  organizationId: string;
};

const mapStateToProps = ({ operationsNotificationsByClient }: RootState, { client: { id: clientId } }: OwnProps) => {
  const operationsNotificationsCount =
    operationsNotificationsByClient[clientId] && operationsNotificationsByClient[clientId].operations;
  return { operationsNotificationsCount };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  { client: { id: clientId }, organizationId }: OwnProps
) => ({
  fetchOperationsNotificationsCountByClientIfNeeded: () =>
    dispatch(fetchOperationsNotificationsCountByClientIfNeeded(organizationId, clientId))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps;

class OperationsNotificationsByClient extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchOperationsNotificationsCountByClientIfNeeded();
  }

  render() {
    const {
      client: { id, name },
      operationsNotificationsCount,
      organizationId
    } = this.props;

    return (
      <IconCard
        to={`/${organizationId}/reporting/operations/clients/${id}`}
        icon={<BusinessIcon />}
        primaryText={name}
        badgeContent={operationsNotificationsCount ? operationsNotificationsCount : 0}
      />
    );
  }
}

export const OperationsNotificationsByClientContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(OperationsNotificationsByClient);
