import * as React from 'react';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import List from '@material-ui/core/List';
import UpdateIcon from '@material-ui/icons/Update';
import { DeepReadonly } from 'utility-types';
import { ISubscription, SubscriptionStatus } from '@pec/aion-ui-core/interfaces/subscription';
import { IVerification } from 'interfaces/verification';
import { IconListItem } from '@pec/aion-ui-components/components/IconListItem';
import { RouteComponentProps, withRouter } from 'react-router';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { Tile } from 'components/Tile';
import { localizeDate } from '@pec/aion-ui-i18next/helpers/localize';
import { useTranslation } from 'react-i18next';

type RouteParams = {
  organizationId?: string;
};

type OwnProps = {
  subscriptions: DeepReadonly<ISubscription[]>;
  verifications: DeepReadonly<IVerification[]>;
};

const styles = (theme: Theme) => ({
  good: {
    backgroundColor: theme.palette.secondary.main
  },
  bad: {
    backgroundColor: theme.palette.error.main
  }
});

type Props = WithStyles<typeof styles> & RouteComponentProps<RouteParams> & OwnProps;

const VerificationsTile: React.FC<Props> = ({
  match: {
    params: { organizationId }
  },
  subscriptions,
  verifications,
  classes
}) => {
  const { t } = useTranslation();

  return (
    <Tile primaryText={t('subscriber.dashboard.verificationsTile.title', 'Subscription & Verifications')}>
      <List>
        {subscriptions.length + verifications.length > 0 &&
          subscriptions.map(({ id, isExpired, expirationDate, status, typeDisplayName }) =>
            isExpired ? (
              <IconListItem
                key={id}
                className={classes.bad}
                icon={<CloseIcon />}
                title={status}
                primaryText={t('subscriber.dashboard.verificationsTile.expiredDate', {
                  typeDisplayName,
                  date: localizeDate(expirationDate, t),
                  defaultValue: '{{typeDisplayName}} expired on {{date}}'
                })}
              />
            ) : status === SubscriptionStatus.Inactive ? (
              <IconListItem
                key={id}
                className={classes.bad}
                icon={<CloseIcon />}
                title={status}
                primaryText={t('subscriber.dashboard.verificationsTile.expire', {
                  typeDisplayName,
                  defaultValue: '{{typeDisplayName}} expired'
                })}
              />
            ) : (
              <IconListItem
                key={id}
                className={classes.good}
                icon={<DoneIcon />}
                title={status}
                primaryText={t('subscriber.dashboard.verificationsTile.expiresOn', {
                  typeDisplayName,
                  date: localizeDate(expirationDate, t),
                  defaultValue: '{{typeDisplayName}} expires on {{date}}'
                })}
              />
            )
          )}
        {verifications.map(({ legacyId, name, status, isVerified }) =>
          isVerified ? (
            <IconListItem
              key={legacyId}
              className={classes.good}
              icon={<DoneIcon />}
              title={status}
              primaryText={name}
            />
          ) : isVerified === false ? (
            <IconListItem
              key={legacyId}
              className={classes.bad}
              icon={<CloseIcon />}
              title={status}
              primaryText={name}
            />
          ) : (
            <IconListItem key={legacyId} icon={<UpdateIcon />} title={status} primaryText={name} />
          )
        )}
        {verifications.length === 0 && (
          <IconListItem
            to={`/${organizationId}/questionnaire`}
            icon={<ArrowForwardIosIcon />}
            primaryText={t('subscriber.dashboard.verificationsTile.noVerifications', 'No Verifications are Available')}
          >
            {t(
              'subscriber.dashboard.verificationsTile.completeSections',
              'Please complete the appropriate sections of your questionnaire.'
            )}
          </IconListItem>
        )}
      </List>
    </Tile>
  );
};

export const VerificationsTileComponent = withStyles(styles)(withRouter(VerificationsTile));
