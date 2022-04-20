import * as React from 'react';
import { connect } from 'react-redux';
import { EditDescriptionForm } from '../components/EditDescriptionForm';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchOrganizationIfNeeded } from '@pec/aion-ui-core/actions/organization';
import { IEditOrganizationDescriptionForm } from 'interfaces/editOrganizationDescription';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { updateOrganization } from '../actions/updateOrganizationDescription';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => state.organization;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchOrganizationIfNeeded: () => dispatch(fetchOrganizationIfNeeded(organizationId)),
  updateOrganizationDescription: (value: IEditOrganizationDescriptionForm) =>
    dispatch(updateOrganization(organizationId, value))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class EditDescription extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchOrganizationIfNeeded();
  }

  onSubmit = async (value: IEditOrganizationDescriptionForm) => await this.props.updateOrganizationDescription(value);

  render() {
    const { organization, fetchError } = this.props;

    return organization ? (
      <EditDescriptionForm initialValues={{ description: organization.description }} onSubmit={this.onSubmit} />
    ) : fetchError ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const EditDescriptionContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(EditDescription));
