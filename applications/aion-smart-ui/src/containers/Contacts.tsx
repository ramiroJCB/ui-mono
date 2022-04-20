import * as React from 'react';
import { connect } from 'react-redux';
import { ContactsComponent } from 'components/Contacts';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchContactsIfNeeded } from 'actions/contacts';
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
  contactId?: string;
  mode?: 'edit' | 'add';
};

const mapStateToProps = (state: RootState) => state.contacts;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, siteId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchContactsIfNeeded: () => dispatch(fetchContactsIfNeeded(organizationId, siteId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class Contacts extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchContactsIfNeeded();
  }

  render() {
    const {
      contacts,
      isFetching,
      error,
      match: {
        params: { organizationId, siteId }
      },
      t
    } = this.props;
    const children =
      contacts && !isFetching ? (
        <ContactsComponent organizationId={organizationId} siteId={siteId} contacts={contacts} />
      ) : error ? (
        <Error />
      ) : (
        <Loading />
      );

    return <NavContainer title={t('smart.titles.contacts', 'Contacts')}>{children}</NavContainer>;
  }
}

export const ContactsContainer = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Contacts));
