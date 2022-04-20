import * as React from 'react';
import { AnnouncementsComponent } from '../components/Announcements';
import { connect } from 'react-redux';
import { deleteAnnouncement } from 'features/contractor/announcements/actions/deleteAnnouncement';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
  contractorId?: string;
};

const mapStateToProps = (state: RootState) => ({
  ...state.announcement,
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
  deleteAnnouncement: (announcementId: string) => () => dispatch(deleteAnnouncement(organizationId, announcementId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class Announcements extends React.Component<Props> {
  render() {
    const { error, announcement, deleteAnnouncement, viewAsClient } = this.props;

    return (
      <AnnouncementsComponent
        error={error}
        announcement={announcement}
        deleteAnnouncement={deleteAnnouncement}
        viewAsClient={viewAsClient}
      />
    );
  }
}

export const AnnouncementsContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Announcements));
