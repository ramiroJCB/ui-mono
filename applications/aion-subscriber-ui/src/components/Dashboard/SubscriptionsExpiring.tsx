import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { DeepReadonly } from 'utility-types';
import { ISubscription } from '@pec/aion-ui-core/interfaces/subscription';
import { Message } from '@pec/aion-ui-components/components/Message';
import { localizeDate } from '@pec/aion-ui-i18next/helpers/localize';
import { useTranslation, Trans } from 'react-i18next';

type Props = {
  expiringSubscriptions: DeepReadonly<ISubscription[]>;
};

export const SubscriptionsExpiringComponent: React.FC<Props> = ({ expiringSubscriptions }) => {
  const { t } = useTranslation();

  return (
    <Grid item xs={12}>
      <Message
        primaryText={t('subscriber.dashboard.subscriptionsExpiring.title', 'Your Subscription is Expiring Soon')}
        variant="warning"
      >
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {expiringSubscriptions.map(({ id, typeDisplayName, expirationDate }) => (
            <li key={id}>
              <Typography variant="body1">
                {t('subscriber.dashboard.subscriptionsExpiring.expiredDate', {
                  typeDisplayName,
                  date: localizeDate(expirationDate, t),
                  defaultValue: '{{typeDisplayName}} expires on {{date}}'
                })}
              </Typography>
            </li>
          ))}
        </ul>
        <Typography variant="subtitle1">
          <Trans i18nKey="subscriber.dashboard.subscriptionsExpired.pleaseCall">
            Please call <a href="tel:1-844-768-9041">844-768-9041</a> to renew.
          </Trans>
        </Typography>
      </Message>
    </Grid>
  );
};
