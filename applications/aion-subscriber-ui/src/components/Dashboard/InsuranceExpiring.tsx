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
  expiringInsurances: DeepReadonly<IInsurance[]>;
};

type Props = RouteComponentProps<RouteParams> & OwnProps;

const InsuranceExpiring: React.FC<Props> = ({
  match: {
    params: { organizationId }
  },
  expiringInsurances
}) => {
  const { t } = useTranslation();

  return expiringInsurances.length > 0 ? (
    <Grid item xs={12}>
      <Message
        primaryText={t('subscriber.dashboard.insuranceExpiring.title', 'Your Insurance is Expiring Soon')}
        variant="warning"
      >
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {expiringInsurances.map(({ organizationName, questionSectionId, earliestPolicyExpirationDate }) => (
            <li key={questionSectionId}>
              <Typography variant="body1">
                <Link to={`/${organizationId}/questionnaire/${questionSectionId}`}>
                  {t('subscriber.dashboard.insuranceExpiring.expiredDate', {
                    organizationName,
                    date: localizeDate(earliestPolicyExpirationDate, t),
                    defaultValue: '{{organizationName}} expires on {{date}}'
                  })}
                </Link>
              </Typography>
            </li>
          ))}
        </ul>
        <Typography variant="subtitle1">
          {t(
            'subscriber.dashboard.insuranceExpiring.subtitle',
            'Please follow the links above to upload new insurance documents.'
          )}
        </Typography>
      </Message>
    </Grid>
  ) : null;
};

export const InsuranceExpiringComponent = withRouter(InsuranceExpiring);
