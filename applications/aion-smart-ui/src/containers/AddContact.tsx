import * as React from 'react';
import withWidth, { isWidthUp, WithWidth } from '@material-ui/core/withWidth';
import { addContact } from 'actions/addContact';
import { connect } from 'react-redux';
import { ContactForm } from 'components/ContactForm';
import { IContact } from 'interfaces/contact';
import { NavContainer } from './Nav';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
  siteId: string;
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    history,
    match: {
      params: { organizationId, siteId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  addContact: (contactForm: IContact) => dispatch(addContact(organizationId, { ...contactForm, siteId }, history))
});

type Props = ReturnType<typeof mapDispatchToProps> & RouteComponentProps<RouteParams> & WithWidth;

class AddContact extends React.Component<Props> {
  onSubmit = async (contactForm: IContact) => await this.props.addContact(contactForm);

  render() {
    const {
      width,
      match: {
        params: { siteId }
      }
    } = this.props;
    return isWidthUp('md', width) ? (
      <ContactForm initialValues={{ siteId }} onSubmit={this.onSubmit} />
    ) : (
      <NavContainer title="Add a Contact">
        <ContactForm initialValues={{ siteId }} onSubmit={this.onSubmit} />
      </NavContainer>
    );
  }
}

export const AddContactContainer = withRouter(connect(null, mapDispatchToProps)(withWidth()(AddContact)));
