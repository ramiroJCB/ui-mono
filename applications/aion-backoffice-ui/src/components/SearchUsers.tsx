import * as React from 'react';
import Search from './Search';
import { History } from 'history';
import { useTranslation } from 'react-i18next';

type Props = {
  searchTerm?: string;
  history: History;
};

const SearchUsers: React.FC<Props> = ({ searchTerm, history, children }) => {
  const { t } = useTranslation();

  return (
    <Search
      searchTerm={searchTerm}
      header={t('backoffice.searchUsers.users', 'Users')}
      label={t('backoffice.searchUsers.findUser', 'Find a User')}
      placeholder={t('backoffice.searchUsers.searchByName', 'Search by Name, Username, or Email')}
      uri="/users/search/%s/page/1"
      history={history}
    >
      {children}
    </Search>
  );
};

export default SearchUsers;
