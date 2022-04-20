import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Message } from '@pec/aion-ui-components/components/Message';
import { RouteComponentProps, withRouter } from 'react-router';
import { useTranslation, Trans } from 'react-i18next';

type RouteParams = {
  organizationId: string;
};

type OwnProps = {
  onDismiss: () => void;
};

type Props = RouteComponentProps<RouteParams> & OwnProps;

const VeriforceIntegration: React.FC<Props> = ({
  onDismiss,
  match: {
    params: { organizationId }
  }
}) => {
  const { t } = useTranslation();

  return (
    <Grid item xs={12}>
      <Message
        primaryText={t('subscriber.dashboard.veriforceIntegration.title', 'Link your Veriforce Organization')}
        onDismiss={onDismiss}
      >
        <Typography variant="subtitle1">
          <Trans i18nKey="subscriber.dashboard.veriforceIntegration.subtitle">
            PEC and Veriforce have merged{' '}
            <a href={`/veriforce-integration/${organizationId}`}>Link your Veriforce account now</a> so you’re ready to
            enjoy future enhancements and a streamlined user experience.
          </Trans>
        </Typography>
      </Message>
    </Grid>
  );
};
export const VeriforceIntegrationComponent = withRouter(VeriforceIntegration);
