import * as React from 'react';
import SchoolIcon from '@material-ui/icons/School';
import { AnchorListItem } from '@pec/aion-ui-components/components/Nav/AnchorListItem';
import { useTranslation } from 'react-i18next';

type Props = {
  navExpanded: boolean;
};

export const SideNav: React.FC<Props> = ({ navExpanded }) => {
  const { t } = useTranslation();

  return (
    <AnchorListItem divider tooltip={!navExpanded} icon={<SchoolIcon />} href="/eLearning">
      {t('user.sideNav.eLearning', 'eLearning')}
    </AnchorListItem>
  );
};
