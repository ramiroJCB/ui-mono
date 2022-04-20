import React from 'react';
import { Footer } from '@pec/aion-ui-components/containers/Footer';
import { NavContainer } from '@pec/aion-ui-components/containers/Nav';
import { SideNav } from 'app/SideNav';
import { useLocation } from 'react-router-dom';
import { useTypedSelector } from 'app/reducer';
import { useTranslation } from 'react-i18next';

export const Nav: React.FC = ({ children }) => {
  const { t } = useTranslation();
  const { navExpanded } = useTypedSelector(state => state.options);
  const location = useLocation();

  return (
    <NavContainer
      location={location}
      title={t('user.nav.userProfile', 'User Profile')}
      sideNav={<SideNav navExpanded={navExpanded} />}
    >
      {children}
      <Footer />
    </NavContainer>
  );
};
