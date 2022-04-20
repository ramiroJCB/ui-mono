import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { DeepReadonly } from 'utility-types';
import { IInsurance } from 'interfaces/insurance';
import { Link } from 'react-router-dom';
import { Message } from '@pec/aion-ui-components/components/Message';
import { RouteComponentProps, withRouter } from 'react-router';
import { localizeDate } from '@pec/aion-ui-i18next/helpers/localize';
import { useTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
};

type OwnProps = {
  expiredInsurances: DeepReadonly<IInsurance[]>;
};

type Props = RouteComponentProps<RouteParams> & OwnProps;

const InsuranceExpired: React.FC<Props> = ({
  match: {
    params: { organizationId }
  },
  expiredInsurances
}) => {
  const { t } = useTranslation();

  return expiredInsurances.length > 0 ? (
    <Grid item xs={12}>
      <Message
        primaryText={t('subscriber.dashboard.insuranceExpired.title', 'Your Insurance has Expired')}
        variant="error"
      >
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {expiredInsurances.map(({ organizationName, questionSectionId, earliestPolicyExpirationDate }) => (
            <li key={questionSectionId}>
              <Typography variant="body1">
                <Link to={`/${organizationId}/questionnaire/${questionSectionId}`}>
                  {t('subscriber.dashboard.insuranceExpired.expiredDate', {
                    organizationName,
                    date: localizeDate(earliestPolicyExpirationDate, t),
                    defaultValue: '{{organizationName}} expired on {{date}'
                  })}
                </Link>
              </Typography>
            </li>
          ))}
        </ul>
        <Typography variant="subtitle1">
          {t(
            'subscriber.dashboard.insuranceExpired.subtitle',
            'Please follow the links above to upload new insurance documents.'
          )}
        </Typography>
      </Message>
    </Grid>
  ) : null;
};

export const InsuranceExpiredComponent = withRouter(InsuranceExpired);
