import * as React from 'react';
import BusinessIcon from '@material-ui/icons/Business';
import Grid from '@material-ui/core/Grid';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import withWidth, { isWidthUp, WithWidth } from '@material-ui/core/withWidth';
import { DeepReadonly } from 'utility-types';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { History } from 'history';
import { IconCard } from '@pec/aion-ui-components/components/IconCard';
import { IconListItem } from '@pec/aion-ui-components/components/IconListItem';
import { IUserOrganization } from '@pec/aion-ui-core/interfaces/userOrganization';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  userOrganizations: DeepReadonly<IUserOrganization[]>;
  history: History;
};

type Props = WithWidth & OwnProps;

const UserOrganizations: React.FC<Props> = ({ userOrganizations, width }) => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <Hidden smDown>
        <GridContainer style={{ flex: 0 }}>
          <Grid item xs={12}>
            <Typography variant="h5">
              {t('smart.userOrganizations.selectAnOrganization', 'Select an Organization')}
            </Typography>
          </Grid>
        </GridContainer>
      </Hidden>
      <GridContainer spacing={isWidthUp('md', width) ? undefined : 0}>
        {userOrganizations.length > 0 ? (
          isWidthUp('md', width) ? (
            userOrganizations.map(({ id, name }) => (
              <Grid item xs={6} lg={4} key={id}>
                <IconCard key={id} to={`/${id}/sites`} primaryText={name} icon={<BusinessIcon />} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <List component="nav">
                {userOrganizations.map(({ id, name }) => (
                  <IconListItem key={id} to={`/${id}/sites`} icon={<BusinessIcon />} primaryText={name} />
                ))}
              </List>
            </Grid>
          )
        ) : (
          <Grid item xs={12}>
            <List>
              <IconListItem
                icon={<HelpOutlineIcon />}
                primaryText={t('smart.userOrganizations.noOrganizationsAvailable', 'No Organizations Available')}
              >
                {t(
                  'smart.userOrganizations.weAreSorry',
                  'We’re sorry, your username is not yet associated with any organizations. Please contact PEC Safety at 866-647-2338.'
                )}
              </IconListItem>
            </List>
          </Grid>
        )}
      </GridContainer>
    </React.Fragment>
  );
};

export const UserOrganizationsComponent = withWidth()(UserOrganizations);
