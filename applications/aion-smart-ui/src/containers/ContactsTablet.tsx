import * as React from 'react';
import { connect } from 'react-redux';
import { ContactsTabletComponent } from 'components/ContactsTablet';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchContactsIfNeeded } from 'actions/contacts';
import { fetchSiteIfNeeded } from 'actions/fetchSite';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { NavContainer } from './Nav';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

type RouteParams = {
  organizationId: string;
  siteId: string;
  contactId: string;
  mode?: 'edit' | 'add';
};

const mapStateToProps = ({
  contacts: { contacts, isFetching: isFetchingContacts, error: contactsError },
  site: { site, isFetching: isFetchingSite, error: siteError }
}: RootState) => ({
  contacts,
  site,
  isFetching: isFetchingContacts || isFetchingSite,
  error: contactsError || siteError
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, siteId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchContactsIfNeeded: () => dispatch(fetchContactsIfNeeded(organizationId, siteId)),
  fetchSiteIfNeeded: () => dispatch(fetchSiteIfNeeded(organizationId, siteId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class ContactsTablet extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchContactsIfNeeded();
    props.fetchSiteIfNeeded();
  }

  componentDidUpdate() {
    const {
      contacts,
      history,
      match: {
        params: { siteId, organizationId, contactId, mode }
      }
    } = this.props;
    if (contacts && mode !== 'add') {
      if (contacts.length === 0) {
        history.replace(`/${organizationId}/sites/${siteId}/contacts/add`);
      } else if (!contactId && contacts[0].siteId === siteId) {
        history.replace(`/${organizationId}/sites/${siteId}/contacts/${contacts[0].id}`);
      }
    }
  }

  render() {
    const { match, contacts, site, error, isFetching, t } = this.props;
    return (
      <NavContainer title={t('smart.titles.contacts', 'Contacts')}>
        {!isFetching && contacts && site ? (
          <ContactsTabletComponent contacts={contacts} site={site} match={match} />
        ) : error ? (
          <Error />
        ) : (
          <Loading />
        )}
      </NavContainer>
    );
  }
}

export const ContactsTabletContainer = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ContactsTablet));
