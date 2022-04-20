import * as React from 'react';
import BusinessIcon from '@material-ui/icons/Business';
import { connect } from 'react-redux';
import { fetchFlexTrackNotificationsCountByClientIfNeeded } from '../actions';
import { IClient } from '@pec/aion-ui-core/interfaces/client';
import { IconCard } from '@pec/aion-ui-components/components/IconCard';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  client: IClient;
  organizationId: string;
};

const mapStateToProps = ({ flexTrackNotificationsByClient }: RootState, { client: { id: clientId } }: OwnProps) => {
  const flexTrackNotificationsCount =
    flexTrackNotificationsByClient[clientId] && flexTrackNotificationsByClient[clientId].flexTrack;
  return { flexTrackNotificationsCount };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  { client: { id: clientId }, organizationId }: OwnProps
) => ({
  fetchFlexTrackNotificationsCountByClientIfNeeded: () =>
    dispatch(fetchFlexTrackNotificationsCountByClientIfNeeded(organizationId, clientId))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps;

class FlexTrackNotificationsByClient extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchFlexTrackNotificationsCountByClientIfNeeded();
  }

  render() {
    const {
      client: { id, name },
      flexTrackNotificationsCount,
      organizationId
    } = this.props;

    return (
      <IconCard
        to={`/${organizationId}/reporting/regional/clients/${id}`}
        icon={<BusinessIcon />}
        primaryText={name}
        badgeContent={flexTrackNotificationsCount ? flexTrackNotificationsCount : 0}
      />
    );
  }
}

export const FlexTrackNotificationsByClientContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FlexTrackNotificationsByClient);
