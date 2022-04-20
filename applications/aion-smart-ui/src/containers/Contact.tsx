import * as React from 'react';
import withWidth, { isWidthUp, WithWidth } from '@material-ui/core/withWidth';
import { connect } from 'react-redux';
import { ContactComponent } from 'components/Contact';
import { ContactForm } from 'components/ContactForm';
import { deleteContact } from 'actions/deleteContact';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchContactIfNeeded } from 'actions/fetchContact';
import { IContact } from 'interfaces/contact';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { NavContainer } from './Nav';
import { RootActions } from '@pec/aion-ui-core/combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { updateContact } from 'actions/updateContact';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

type RouteParams = {
  organizationId: string;
  siteId: string;
  contactId: string;
  mode?: 'edit';
};

const mapStateToProps = (state: RootState) => state.contact;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    history,
    match: {
      params: { organizationId, siteId, contactId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchContactIfNeeded: () => dispatch(fetchContactIfNeeded(organizationId, siteId, contactId)),
  updateContact: (contactForm: IContact) => dispatch(updateContact(organizationId, contactForm, history)),
  deleteContact: () => dispatch(deleteContact(organizationId, siteId, contactId, history))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  WithWidth &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class EditContact extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.props.fetchContactIfNeeded();
  }

  componentDidUpdate({
    match: {
      params: { contactId: prevContactId }
    }
  }: Props) {
    if (prevContactId && prevContactId !== this.props.match.params.contactId) {
      this.props.fetchContactIfNeeded();
    }
  }

  onSubmit = async (contactForm: IContact) => await this.props.updateContact(contactForm);

  onDeleteConfirm = async () => await this.props.deleteContact();

  render() {
    const {
      contact,
      isFetching,
      isDeleting,
      error,
      match: {
        params: { organizationId, mode }
      },
      width,
      t
    } = this.props;

    const children =
      contact && !isFetching && !isDeleting ? (
        mode === 'edit' ? (
          <ContactForm onSubmit={this.onSubmit} onDeleteConfirm={this.onDeleteConfirm} initialValues={contact} />
        ) : (
          <ContactComponent organizationId={organizationId} contact={contact} />
        )
      ) : error ? (
        <Error />
      ) : (
        <Loading />
      );

    return isWidthUp('md', width) ? (
      children
    ) : (
      <NavContainer title={t('smart.titles.contact', 'Contact')}>{children}</NavContainer>
    );
  }
}

export const EditContactContainer = withWidth()(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(EditContact)))
);
