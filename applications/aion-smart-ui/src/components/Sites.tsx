import * as React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import List from '@material-ui/core/List';
import PlaceIcon from '@material-ui/icons/Place';
import withWidth, { isWidthUp, WithWidth } from '@material-ui/core/withWidth';
import { DeepReadonly } from 'utility-types';
import { FloatingActionButton } from '@pec/aion-ui-components/components/FloatingActionButton';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { History } from 'history';
import { IconCard } from '@pec/aion-ui-components/components/IconCard';
import { IconListItem } from '@pec/aion-ui-components/components/IconListItem';
import { ISite, SiteStatus } from 'interfaces/site';
import { Search } from '@pec/aion-ui-components/components/Search';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { Typography, Button, Badge } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  organizationId: string;
  sites: DeepReadonly<ISite[]>;
  history: History;
  handleSearch: (query: string) => void;
  searchQuery: string | null;
  openDrawer: () => void;
  selectedTags: number;
};

const styles = (theme: Theme) => ({
  activeSiteIcon: {
    backgroundColor: theme.palette.secondary.main
  }
});

type Props = WithStyles<typeof styles> & WithWidth & OwnProps;

const Sites: React.FC<Props> = ({
  width,
  organizationId,
  sites,
  classes,
  handleSearch,
  searchQuery,
  openDrawer,
  selectedTags
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <GridContainer style={{ flex: 0 }} direction="row" alignItems="center" justify="space-between">
        <Grid item sm={6} xs={12}>
          <Typography variant="h5">{t('smart.sites.selectASite', 'Select a Site')}</Typography>
        </Grid>
        <Grid item container md={4} sm={6} xs={12} alignItems="center">
          <Grid item sm={10}>
            <Search
              label={t('smart.sites.searchSites', 'Search Sites')}
              searchTerm={searchQuery || ''}
              isFetching={false}
              handleSearch={handleSearch}
              fullWidth
            />
          </Grid>
          <Grid item sm={2}>
            <Button onClick={openDrawer}>
              <Badge variant="dot" color="error" invisible={!selectedTags}>
                {t('smart.common.tags', 'Tags')}
              </Badge>
            </Button>
          </Grid>
        </Grid>
      </GridContainer>
      <GridContainer spacing={isWidthUp('md', width) ? undefined : 0}>
        {sites.length > 0 ? (
          isWidthUp('md', width) ? (
            sites.map(({ id, name, numWorkersOnSite, status }) => (
              <Grid item xs={6} lg={4} key={id}>
                <IconCard
                  to={`/${organizationId}/sites/${id}`}
                  icon={<PlaceIcon />}
                  primaryText={name}
                  className={status === SiteStatus.Active ? classes.activeSiteIcon : undefined}
                >
                  {t('smart.workersCount', {
                    count: numWorkersOnSite,
                    defaultValue_plural: '{{count}} Workers on Site',
                    defaultValue: '{{count}} Worker on Site'
                  })}
                </IconCard>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <List component="nav">
                {sites.map(({ id, name, numWorkersOnSite, status }) => (
                  <IconListItem
                    key={id}
                    to={`/${organizationId}/sites/${id}`}
                    icon={<PlaceIcon />}
                    primaryText={name}
                    className={status === SiteStatus.Active ? classes.activeSiteIcon : undefined}
                  >
                    {t('smart.workersCount', {
                      count: numWorkersOnSite,
                      defaultValue_plural: '{{count}} Workers on Site',
                      defaultValue: '{{count}} Worker on Site'
                    })}
                  </IconListItem>
                ))}
              </List>
            </Grid>
          )
        ) : (
          <Grid item xs={12}>
            <List>
              <IconListItem
                icon={<HelpOutlineIcon />}
                primaryText={
                  searchQuery != null
                    ? t('smart.sites.noResultsFound', 'No results found')
                    : t('smart.sites.addYourFirstSite', 'Add Your First Site')
                }
              >
                {searchQuery != null
                  ? t('smart.sites.tryChangingYourSearch', 'Try changing your search query or adding a new site.')
                  : t('smart.sites.useTheButton', 'Use the button in the bottom right to add your first site.')}
              </IconListItem>
            </List>
          </Grid>
        )}
        <Grid item xs={12}>
          <FloatingActionButton
            to={`/${organizationId}/sites/add/location`}
            icon={<AddIcon />}
            label={t('smart.sites.addASite', 'Add a Site')}
          />
        </Grid>
      </GridContainer>
    </React.Fragment>
  );
};

export const SitesComponent = withStyles(styles)(withWidth()(Sites));
