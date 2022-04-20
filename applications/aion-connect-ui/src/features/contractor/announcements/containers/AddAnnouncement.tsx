import * as React from 'react';
import { addAnnouncement } from '../actions/addAnnouncement';
import { AddAnnouncementForm } from '../components/AddAnnouncementForm';
import { connect } from 'react-redux';
import { IAnnouncementForm } from 'interfaces/announcementForm';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  addAnnouncement: (values: IAnnouncementForm) => dispatch(addAnnouncement(organizationId, values))
});

type Props = ReturnType<typeof mapDispatchToProps> & RouteComponentProps<RouteParams>;

class AddAnnouncement extends React.Component<Props> {
  onSubmit = async (values: IAnnouncementForm) => await this.props.addAnnouncement(values);

  render() {
    const initialValues: IAnnouncementForm = {
      text: ''
    };

    return <AddAnnouncementForm initialValues={initialValues} onSubmit={this.onSubmit} />;
  }
}

export const AddAnnouncementContainer = withRouter(connect(null, mapDispatchToProps)(AddAnnouncement));
