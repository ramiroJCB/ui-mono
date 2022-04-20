import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Tooltip from '@material-ui/core/Tooltip';
import { clearUrl } from 'helpers/clearUrl';
import { CurrentStatus } from 'interfaces/oshaViolations';
import { Link, useParams } from 'react-router-dom';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { getTabsTooltips } from 'helpers/tooltips';
import { useHistory } from 'react-router';
import { useTypedSelector } from 'app/reducer';
import { useTranslation } from 'react-i18next';
import { localizeNumber } from '@pec/aion-ui-i18next/helpers/localize';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    borderBottom: '1px solid',
    borderBottomColor: theme.palette.grey[300]
  }
}));

export const TabFilter: React.FC = () => {
  const { status } = useParams<{ status: CurrentStatus }>();
  const { total: unMatchedTotal } = useTypedSelector(state => state.unMatchedViolations);
  const { total: associatedTotal } = useTypedSelector(state => state.associatedViolations);
  const { total: pendingTotal } = useTypedSelector(state => state.pendingViolations);
  const { total: unassociatedTotal } = useTypedSelector(state => state.unassociatedViolations);

  const classes = useStyles();
  const { t } = useTranslation();

  const {
    location: { search }
  } = useHistory();

  const tabsTooltips = getTabsTooltips(t);

  const currentSearch = clearUrl(search);

  return (
    <Grid item xs={12} style={{ padding: 0 }}>
      <Tabs
        className={classes.root}
        textColor="primary"
        indicatorColor="primary"
        value={
          status === 'pending'
            ? 0
            : status === 'associated'
            ? 1
            : status === 'unassociated'
            ? 2
            : status === 'other'
            ? 3
            : 0
        }
      >
        <Tab
          component={props => (
            <Tooltip title={tabsTooltips.Pending}>
              <Link {...props} />
            </Tooltip>
          )}
          label={t('oshaViolations.tabFilter.pending', {
            defaultValue: '{{pending}} Pending',
            pending: pendingTotal > 1000 ? localizeNumber(1000, t) + '+' : localizeNumber(pendingTotal, t)
          })}
          to={`/osha-violations/pending${currentSearch}`}
        />
        <Tab
          component={props => (
            <Tooltip title={tabsTooltips.Associated}>
              <Link {...props} />
            </Tooltip>
          )}
          label={t('oshaViolations.tabFilter.associated', {
            defaultValue: '{{associated}} Associated',
            associated: associatedTotal > 1000 ? localizeNumber(1000, t) + '+' : localizeNumber(associatedTotal, t)
          })}
          to={`/osha-violations/associated${currentSearch}`}
        />
        <Tab
          component={props => (
            <Tooltip title={tabsTooltips.Unassociated}>
              <Link {...props} />
            </Tooltip>
          )}
          label={t('oshaViolations.tabFilter.unassociated', {
            defaultValue: '{{unassociated}} Unassociated',
            unassociated:
              unassociatedTotal > 1000 ? localizeNumber(1000, t) + '+' : localizeNumber(unassociatedTotal, t)
          })}
          to={`/osha-violations/unassociated${currentSearch}`}
        />
        <Tab
          component={props => (
            <Tooltip title={tabsTooltips.Other}>
              <Link {...props} />
            </Tooltip>
          )}
          label={t('oshaViolations.tabFilter.other', {
            defaultValue: '{{other}} Other',
            other: unMatchedTotal > 1000 ? localizeNumber(1000, t) + '+' : localizeNumber(unMatchedTotal, t)
          })}
          to={`/osha-violations/other${currentSearch}`}
        />
      </Tabs>
    </Grid>
  );
};
