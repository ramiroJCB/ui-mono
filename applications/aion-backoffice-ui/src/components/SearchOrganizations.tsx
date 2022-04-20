import * as React from 'react';
import Search from './Search';
import { History } from 'history';
import { useTranslation } from 'react-i18next';

type Props = {
  searchTerm?: string;
  history: History;
};

const SearchOrganizations: React.FC<Props> = ({ searchTerm, history, children }) => {
  const { t } = useTranslation();

  return (
    <Search
      searchTerm={searchTerm}
      header={t('backoffice.searchOrganizations.organizations', 'Organizations')}
      label={t('backoffice.searchOrganizations.findOrganizations', 'Find an Organization')}
      placeholder={t('backoffice.searchOrganizations.searchByName', 'Search by Name')}
      uri="/organizations/search/%s/page/1"
      history={history}
    >
      {children}
    </Search>
  );
};

export default SearchOrganizations;
