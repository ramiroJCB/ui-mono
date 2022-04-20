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
  expiredVerifications: DeepReadonly<IVerification[]>;
};

type Props = RouteComponentProps<RouteParams> & OwnProps;

const VerificationsExpired: React.FC<Props> = ({
  match: {
    params: { organizationId }
  },
  expiredVerifications
}) => {
  const { t } = useTranslation();

  return (
    <Grid item xs={12}>
      <Message
        primaryText={t('subscriber.dashboard.verificationsExpired.title', 'Your Verifications have Expired')}
        variant="error"
      >
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {expiredVerifications.map(({ name, questionnaireSectionId, expirationDate }) => (
            <li key={questionnaireSectionId}>
              <Typography variant="body1">
                <Link to={`/${organizationId}/questionnaire/${questionnaireSectionId}`}>
                  {t('subscriber.dashboard.verificationsExpired.expiredDate', {
                    name,
                    date: expirationDate && localizeDate(new Date(expirationDate), t),
                    defaultValue: '{{name}} expired on {{date}}'
                  })}
                </Link>
              </Typography>
            </li>
          ))}
        </ul>
        <Typography variant="subtitle1">
          {t(
            'subscriber.dashboard.verificationsExpired.subtitle',
            'Please follow the links above to upload new documents.'
          )}
        </Typography>
      </Message>
    </Grid>
  );
};

export const VerificationsExpiredComponent = withRouter(VerificationsExpired);
