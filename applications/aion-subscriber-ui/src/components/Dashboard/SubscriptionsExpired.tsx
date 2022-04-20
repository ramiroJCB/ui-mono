import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { DeepReadonly } from 'utility-types';
import { ISubscription, SubscriptionStatus } from '@pec/aion-ui-core/interfaces/subscription';
import { Message } from '@pec/aion-ui-components/components/Message';
import { localizeDate } from '@pec/aion-ui-i18next/helpers/localize';
import { useTranslation, Trans } from 'react-i18next';

type Props = {
  expiredSubscriptions: DeepReadonly<ISubscription[]>;
};

export const SubscriptionsExpiredComponent: React.FC<Props> = ({ expiredSubscriptions }) => {
  const { t } = useTranslation();

  return (
    <Grid item xs={12}>
      <Message
        primaryText={t('subscriber.dashboard.subscriptionsExpired.title', 'Your Subscription has Expired')}
        variant="error"
      >
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {expiredSubscriptions.map(({ id, status, isExpired, typeDisplayName, expirationDate }) =>
            isExpired ? (
              <li key={id}>
                <Typography variant="body1">
                  {t('subscriber.dashboard.subscriptionsExpired.expiredDate', {
                    typeDisplayName,
                    date: localizeDate(expirationDate, t),
                    defaultValue: '{{typeDisplayName}} expired on {{date}}'
                  })}
                </Typography>
              </li>
            ) : (
              status === SubscriptionStatus.Inactive && (
                <li key={id}>
                  <Typography variant="body1">
                    {t('subscriber.dashboard.subscriptionsExpired.expired', {
                      typeDisplayName,
                      defaultValue: '{{typeDisplayName}} expired'
                    })}
                  </Typography>
                </li>
              )
            )
          )}
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
