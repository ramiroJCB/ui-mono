import * as React from 'react';
import { addContactInformation } from '../actions/addContactInformation';
import { AddEditContactInformationForm } from '../components/AddEditContactInformationForm';
import { connect } from 'react-redux';
import { ContactType, IContactInformation } from 'interfaces/contactInformation';
import { editContactInformation } from '../actions/editContactInformation';
import { fetchContactInformationIfNeeded } from '../actions/fetchContactInformation';
import { IContactInformationForm } from 'interfaces/contactInformationForm';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => state.contactInformation;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchContactInformationIfNeeded: () => dispatch(fetchContactInformationIfNeeded(organizationId)),
  addContactInformation: (values: IContactInformationForm) => dispatch(addContactInformation(organizationId, values)),
  editContactInformation: (values: IContactInformation) => dispatch(editContactInformation(organizationId, values))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class AddEditContactInformation extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchContactInformationIfNeeded();
  }

  onSubmit = async (values: IContactInformation | IContactInformationForm) => {
    const { contactInformation, addContactInformation, editContactInformation } = this.props;

    return new Promise<void>(async (resolve, reject) => {
      try {
        if (contactInformation) {
          await editContactInformation(values as IContactInformation);
        } else {
          await addContactInformation(values);
        }

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  render() {
    const { contactInformation } = this.props;
    let initialValues: IContactInformation | IContactInformationForm;

    if (contactInformation) {
      initialValues = {
        ...contactInformation
      };
    } else {
      initialValues = {
        type: ContactType.Primary,
        phoneNumber: null,
        emailAddress: null,
        websiteUrl: null
      };
    }

    return <AddEditContactInformationForm initialValues={initialValues} onSubmit={this.onSubmit} />;
  }
}

export const AddEditContactInformationContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AddEditContactInformation)
);
