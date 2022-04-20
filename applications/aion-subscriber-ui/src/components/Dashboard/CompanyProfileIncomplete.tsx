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
  profileIsIncomplete: boolean;
  additionalInfoIsIncomplete: boolean;
};

type Props = RouteComponentProps<RouteParams> & OwnProps;

const CompanyProfileIncomplete: React.FC<Props> = ({
  match: {
    params: { organizationId }
  },
  profileIsIncomplete,
  additionalInfoIsIncomplete
}) => {
  const { t } = useTranslation();

  return profileIsIncomplete ? (
    <Grid item xs={12}>
      <Message
        primaryText={t(
          'subscriber.dashboard.companyProfileIncomplete.completeCompanyProfileMessage',
          'Next Step: Complete your Company Profile'
        )}
        variant="info"
      >
        <Typography variant="subtitle1">
          <Link to={`/${organizationId}/questionnaire/1`}>
            {t(
              'subscriber.dashboard.companyProfileIncomplete.completeCompanyProfileLink',
              'Please complete your Company Profile to begin receiving Releases.'
            )}
          </Link>
        </Typography>
      </Message>
    </Grid>
  ) : additionalInfoIsIncomplete ? (
    <Grid item xs={12}>
      <Message
        primaryText={t(
          'subscriber.dashboard.companyProfileIncomplete.completeAdditionalCompanyInfoMessage',
          'Next Step: Complete your Additional Company Information'
        )}
        variant="info"
      >
        <Typography variant="subtitle1">
          <Link to={`/${organizationId}/questionnaire/224`}>
            {t(
              'subscriber.dashboard.companyProfileIncomplete.completeAdditionalCompanyInfoLink',
              'Please complete your Additional Company Information.'
            )}
          </Link>
        </Typography>
      </Message>
    </Grid>
  ) : null;
};

export const CompanyProfileIncompleteComponent = withRouter(CompanyProfileIncomplete);
