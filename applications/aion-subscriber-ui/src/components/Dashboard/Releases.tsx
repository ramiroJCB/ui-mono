import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import { Message } from '@pec/aion-ui-components/components/Message';
import { RouteComponentProps, withRouter } from 'react-router';
import { useTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
};

type OwnProps = {
  hasPendingReleases: boolean | null;
};

type Props = RouteComponentProps<RouteParams> & OwnProps;

const Releases: React.FC<Props> = ({
  hasPendingReleases,
  match: {
    params: { organizationId }
  }
}) => {
  const { t } = useTranslation();

  return hasPendingReleases ? (
    <Grid item xs={12}>
      <Message primaryText={t('subscriber.dashboard.releases.title', 'New Releases are Pending')} variant="warning">
        <Typography variant="subtitle1">
          <Link to={`/${organizationId}/questionnaire/3`}>
            {t('subscriber.dashboard.releases.subtitle', 'Please accept or reject them from the Releases Page.')}
          </Link>
        </Typography>
      </Message>
    </Grid>
  ) : null;
};

export const ReleasesComponent = withRouter(Releases);
