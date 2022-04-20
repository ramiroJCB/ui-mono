import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { DeepReadonly } from 'utility-types';
import { IVerification } from 'interfaces/verification';
import { Link } from 'react-router-dom';
import { Message } from '@pec/aion-ui-components/components/Message';
import { RouteComponentProps, withRouter } from 'react-router';
import { localizeDate } from '@pec/aion-ui-i18next/helpers/localize';
import { useTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
};

type OwnProps = {
  expiringVerifications: DeepReadonly<IVerification[]>;
};

type Props = RouteComponentProps<RouteParams> & OwnProps;

const VerificationsExpiring: React.FC<Props> = ({
  match: {
    params: { organizationId }
  },
  expiringVerifications
}) => {
  const { t } = useTranslation();

  return (
    <Grid item xs={12}>
      <Message
        primaryText={t('subscriber.dashboard.verificationsExpiring.title', 'Your Verifications are Expiring Soon')}
        variant="warning"
      >
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {expiringVerifications.map(({ name, questionnaireSectionId, expirationDate }) => (
            <li key={questionnaireSectionId}>
              <Typography variant="body1">
                <Link to={`/${organizationId}/questionnaire/${questionnaireSectionId}`}>
                  {t('subscriber.dashboard.verificationsExpiring.expiredDate', {
                    name,
                    date: expirationDate && localizeDate(expirationDate, t),
                    defaultValue: '{{name}} expires on {{date}}'
                  })}
                </Link>
              </Typography>
            </li>
          ))}
        </ul>
        <Typography variant="subtitle1">
          {t(
            'subscriber.dashboard.verificationsExpiring.subtitle',
            'Please follow the links above to upload new documents.'
          )}
        </Typography>
      </Message>
    </Grid>
  );
};

export const VerificationsExpiringComponent = withRouter(VerificationsExpiring);
