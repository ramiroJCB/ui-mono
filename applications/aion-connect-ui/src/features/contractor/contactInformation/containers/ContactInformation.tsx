import * as React from 'react';
import { connect } from 'react-redux';
import { ContactInformationComponent } from '../components/ContactInformation';
import { RootState } from 'combineReducers';

const mapStateToProps = (state: RootState) => {
  const { contactInformation } = state.contactInformation;
  const { viewAsClient } = state.profile;

  return {
    contactInformation,
    viewAsClient
  };
};

type Props = ReturnType<typeof mapStateToProps>;

class ContactInformation extends React.Component<Props> {
  render() {
    const { contactInformation, viewAsClient } = this.props;

    return <ContactInformationComponent contactInformation={contactInformation} viewAsClient={viewAsClient} />;
  }
}

export const ContactInformationContainer = connect(mapStateToProps)(ContactInformation);
