import * as React from 'react';
import classNames from 'classnames';
import { DeepReadonly } from 'utility-types';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import PhoneIcon from '@material-ui/icons/Phone';
import Typography from '@material-ui/core/Typography';
import withWidth, { isWidthUp, WithWidth } from '@material-ui/core/withWidth';
import { Button, Paper, Theme, createStyles, WithStyles, withStyles } from '@material-ui/core';
import { IconCard } from '@pec/aion-ui-components/components/IconCard';
import { ISite } from 'interfaces/site';
import { Link } from 'react-router-dom';
import { millisToHoursString } from 'helpers/timeCalc';
import { Photo } from './Photo';
import { SiteLocationMapComponent } from './SiteLocationMap';
import { WorkersOnsiteIcon } from './WorkersOnsiteIcon';
import { IWorkGroup } from '@pec/aion-ui-core/interfaces/workGroup';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  site: DeepReadonly<ISite>;
  workgroups: DeepReadonly<IWorkGroup[]> | null;
};

const styles = (theme: Theme) =>
  createStyles({
    section: {
      margin: theme.spacing(2)
    },
    customDivider: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      margin: `0 -${theme.spacing(1.5)}px`
    },
    padding: {
      padding: `${theme.spacing(1.5)}px`
    },
    container: {
      height: '100%',
      minHeight: 'min-content',
      display: 'flex',
      margin: `0px 0px ${theme.spacing()}px ${theme.spacing()}px`
    },
    margin: {
      marginTop: `${theme.spacing(2.5)}px`
    },
    iconCard: {
      padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`
    }
  });

type Props = WithStyles<typeof styles> & WithWidth & OwnProps;

const SiteInfo: React.FC<Props> = ({ site, classes, width, workgroups }) => {
  const {
    organizationId,
    name,
    id,
    description,
    standardShiftDuration,
    latitude,
    longitude,
    formattedAddress,
    tags,
    status,
    numContacts,
    numWorkersOnSite,
    workGroups: siteWorkgroups = []
  } = site;

  const { t } = useTranslation();

  return (
    <Paper className={classes.container}>
      <Grid container spacing={isWidthUp('md', width) ? undefined : 0}>
        <Grid item classes={{ item: classes.padding }} xs={12} md={6}>
          {isWidthUp('md', width) ? (
            <Typography variant="h6">{name}</Typography>
          ) : (
            <Grid item xs={12}>
              <Photo
                primaryText={name}
                map={
                  <SiteLocationMapComponent
                    location={{ latitude, longitude, formattedAddress }}
                    isFetchingLocation={false}
                  />
                }
              >
                {status}
              </Photo>
            </Grid>
          )}
          <Grid container classes={{ container: classes.margin }} spacing={1} direction="column">
            <Grid item md={12} lg={8} xl={6}>
              <IconCard
                to={`/${organizationId}/sites/${id}/contacts`}
                classes={{ paper: classes.iconCard }}
                icon={<PhoneIcon />}
                primaryText={t('smart.contactsCount', {
                  count: numContacts,
                  defaultValue_plural: '{{count}} Contacts',
                  defaultValue: '{{count}} Contact'
                })}
              />
            </Grid>
            <Grid item md={12} lg={8} xl={6}>
              <IconCard
                to={`/${organizationId}/sites/${id}/workers`}
                icon={<WorkersOnsiteIcon />}
                classes={{ paper: classes.iconCard }}
                primaryText={t('smart.workersCount', {
                  count: numWorkersOnSite,
                  defaultValue_plural: '{{count}} Workers on Site',
                  defaultValue: '{{count}} Worker on Site'
                })}
              />
            </Grid>
          </Grid>
          <div className={classNames(classes.customDivider, classes.margin)} />
          <Grid container classes={{ container: classes.margin }} direction="row">
            <Grid item xs={12} sm={11}>
              {!!description && (
                <div className={classes.section}>
                  <Typography variant="caption">{t('smart.common.description', 'Description')}</Typography>
                  <Typography variant="body1">{description}</Typography>
                </div>
              )}
              <div className={classes.section}>
                <Typography variant="caption">{t('smart.smartInfo.location', 'Location')}</Typography>
                <Typography variant="body1">{formattedAddress || `${latitude}, ${longitude}`}</Typography>
              </div>
              {!!tags.length && (
                <div className={classes.section}>
                  <Typography variant="caption">{t('smart.common.tags', 'Tags')}</Typography>
                  <Typography variant="body1">{tags.join(', ')}</Typography>
                </div>
              )}
              {!!workgroups && siteWorkgroups && !!siteWorkgroups.length && (
                <div className={classes.section}>
                  <Typography variant="caption">{t('smart.smartInfo.workgroups', 'Workgroups')}</Typography>
                  <Typography variant="body1">
                    {workgroups
                      .filter(({ id }: IWorkGroup) => [...siteWorkgroups].includes(id))
                      .map(({ name }: IWorkGroup) => name)
                      .join(', ')}
                  </Typography>
                </div>
              )}
              {!!standardShiftDuration && (
                <div className={classes.section}>
                  <Typography variant="body1">
                    {t('smart.smartInfo.standardShiftLength', 'Standard Shift Length')}
                  </Typography>
                  <Typography>
                    {t('smart.siteInfo.standardShiftDuration', {
                      count: Number(millisToHoursString(standardShiftDuration)),
                      defaultValue_plural: '{{count}} hours',
                      defaultValue: '{{count}} hour'
                    })}
                  </Typography>
                </div>
              )}
            </Grid>
            <Grid
              item
              container
              justify="flex-end"
              alignItems="flex-start"
              direction="row"
              sm={isWidthUp('sm', width) ? 1 : 12}
            >
              <Button
                color="secondary"
                variant="contained"
                component={Link}
                to={`/${organizationId}/sites/${id}/edit/location`}
              >
                {t('smart.smartInfo.edit', 'Edit')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Hidden smDown>
          <Grid item container xs={6}>
            <SiteLocationMapComponent location={{ latitude, longitude, formattedAddress }} isFetchingLocation={false} />
          </Grid>
        </Hidden>
      </Grid>
    </Paper>
  );
};

export const SiteInfoComponent = withWidth()(withStyles(styles)(SiteInfo));
