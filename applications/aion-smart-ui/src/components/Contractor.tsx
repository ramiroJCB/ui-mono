import * as React from 'react';
import AssignmentIcon from '@material-ui/icons/Assignment';
import BusinessIcon from '@material-ui/icons/Business';
import EmailIcon from '@material-ui/icons/Email';
import Grid from '@material-ui/core/Grid';
import HomeIcon from '@material-ui/icons/Home';
import List from '@material-ui/core/List';
import PhoneIcon from '@material-ui/icons/Phone';
import withWidth, { isWidthUp, WithWidth } from '@material-ui/core/withWidth';
import { DeepReadonly } from 'utility-types';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IconListItem } from '@pec/aion-ui-components/components/IconListItem';
import { IOrganization } from '@pec/aion-ui-core/interfaces/organization';
import { IRanking } from '@pec/aion-ui-core/interfaces/ranking';
import { Photo } from './Photo';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  organizationId: string;
  siteId: string;
  contractor: DeepReadonly<IOrganization>;
  ranking?: DeepReadonly<IRanking> | null;
};

type Props = WithWidth & OwnProps;

const Contractor: React.FC<Props> = ({
  ranking,
  contractor: {
    name: contractorName,
    logoUrl,
    primaryAddress,
    secondaryAddress,
    city,
    state,
    country,
    zipCode,
    phoneNumber,
    phoneNumberExtension,
    emailAddress
  },
  width
}) => {
  const { t } = useTranslation();
  return (
    <GridContainer spacing={isWidthUp('md', width) ? undefined : 0}>
      <Grid item xs={12} sm={6}>
        <Photo icon={BusinessIcon} photoUrl={logoUrl} primaryText={contractorName}>
          {ranking && ranking.overallRanking.label}
        </Photo>
      </Grid>
      <Grid item xs={12} sm={6}>
        <List component="nav">
          {ranking &&
            ranking.moduleRankings.map(({ name, value, color }) => (
              <IconListItem key={name} icon={<AssignmentIcon />} primaryText={name} style={{ backgroundColor: color }}>
                {value}
              </IconListItem>
            ))}
          {primaryAddress && (
            <IconListItem icon={<HomeIcon />} primaryText={primaryAddress}>
              {secondaryAddress && (
                <span>
                  {secondaryAddress}
                  <br />
                </span>
              )}
              {[city, state, country, zipCode].filter(s => !!s).join(', ')}
            </IconListItem>
          )}
          {phoneNumber && (
            <IconListItem
              href={`tel:${phoneNumber} x${phoneNumberExtension}`}
              icon={<PhoneIcon />}
              primaryText={phoneNumber}
            >
              {phoneNumberExtension &&
                t('smart.contractor.extension', {
                  defaultValue: 'Extension {{extension}}',
                  extension: phoneNumberExtension
                })}
            </IconListItem>
          )}
          {emailAddress && (
            <IconListItem href={`mailto:${emailAddress}`} icon={<EmailIcon />} primaryText={emailAddress} />
          )}
        </List>
      </Grid>
    </GridContainer>
  );
};

export const ContractorComponent = withWidth()(Contractor);
