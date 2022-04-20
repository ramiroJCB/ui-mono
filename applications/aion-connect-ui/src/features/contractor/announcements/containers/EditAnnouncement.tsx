import * as React from 'react';
import { connect } from 'react-redux';
import { editAnnouncement } from '../actions/editAnnouncement';
import { EditAnnouncementForm } from '../components/EditAnnouncementForm';
import { IAnnouncement } from 'interfaces/announcement';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

type OwnProps = {
  initialValues: IAnnouncement;
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  editAnnouncement: (values: IAnnouncement) => dispatch(editAnnouncement(organizationId, values))
});

type Props = ReturnType<typeof mapDispatchToProps> & RouteComponentProps<RouteParams> & OwnProps;

class EditAnnouncement extends React.Component<Props> {
  onSubmit = async (values: IAnnouncement) => await this.props.editAnnouncement(values);

  render() {
    const { initialValues } = this.props;
    return <EditAnnouncementForm initialValues={initialValues} onSubmit={this.onSubmit} />;
  }
}

export const EditAnnouncementContainer = withRouter(connect(null, mapDispatchToProps)(EditAnnouncement));
