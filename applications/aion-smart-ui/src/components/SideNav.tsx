import * as React from 'react';
import Hidden from '@material-ui/core/Hidden';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import PlaceIcon from '@material-ui/icons/Place';
import { AppName } from '@pec/aion-ui-core/interfaces/appName';
import { DeepReadonly } from 'utility-types';
import { ISite } from 'interfaces/site';
import { NavLinkListItem } from '@pec/aion-ui-components/components/Nav/NavLinkListItem';
import { SectionContainer } from '@pec/aion-ui-components/containers/Nav/Section';
import { useTranslation } from 'react-i18next';
import { localizeNumber } from '@pec/aion-ui-i18next/helpers/localize';

type Props = {
  organizationId: string;
  site: DeepReadonly<ISite> | null;
};

const siteDetails = {
  paddingLeft: 84
};

export const SideNav: React.SFC<Props> = ({ organizationId, site }) => {
  const { t } = useTranslation();

  return (
    <SectionContainer id={AppName.AionSMARTUI} subheader="SMART" icon={<PersonPinIcon />}>
      <NavLinkListItem inset exact to={`/${organizationId}/sites`}>
        {t('smart.common.sites', 'Sites')}
      </NavLinkListItem>
      {site && (
        <React.Fragment>
          <NavLinkListItem inset exact to={`/${site.organizationId}/sites/${site.id}`} icon={<PlaceIcon />}>
            {site.name}
          </NavLinkListItem>
          <NavLinkListItem to={`/${site.organizationId}/sites/${site.id}/info`} style={siteDetails}>
            {t('smart.sideNav.siteInfo', 'Site Info')}
          </NavLinkListItem>
          <Hidden lgUp>
            <NavLinkListItem to={`/${site.organizationId}/sites/${site.id}/workers`} style={siteDetails}>
              {t('smart.workersCount', {
                count: site.numWorkersOnSite,
                defaultValue_plural: '{{count}} Workers on Site',
                defaultValue: '{{count}} Worker on Site'
              }).replace(site.numWorkersOnSite.toString(), localizeNumber(site.numWorkersOnSite, t))}
            </NavLinkListItem>
          </Hidden>
          <NavLinkListItem to={`/${site.organizationId}/sites/${site.id}/contacts`} style={siteDetails}>
            {t('smart.contactsCount', {
              count: site.numContacts,
              defaultValue_plural: '{{count}} Contacts',
              defaultValue: '{{count}} Contact'
            }).replace(site.numContacts.toString(), localizeNumber(site.numContacts, t))}
          </NavLinkListItem>
        </React.Fragment>
      )}
      <NavLinkListItem inset to={`/${organizationId}/reports`}>
        {t('smart.sideNav.reports', 'Reports')}
      </NavLinkListItem>
    </SectionContainer>
  );
};
