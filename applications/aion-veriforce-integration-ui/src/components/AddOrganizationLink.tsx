import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Link } from '@pec/aion-ui-components/components/Link';
import { useTranslation, Trans } from 'react-i18next';

type Props = {
  pecOrganizationName: string;
  veriforceOrganizationName: string;
  onClickLinkOrganizations: () => void;
  onClickBackToLogin: () => void;
  hasAuthorizationError: boolean;
  hasOrganizationTypeError: boolean;
  existingLinkPecOrganizationName?: string;
};

export const AddOrganizationLinkComponent: React.FC<Props> = ({
  pecOrganizationName,
  veriforceOrganizationName,
  onClickLinkOrganizations,
  onClickBackToLogin,
  hasAuthorizationError,
  hasOrganizationTypeError,
  existingLinkPecOrganizationName
}) => {
  const { t } = useTranslation();

  return (
    <GridContainer justify="space-between">
      <Grid item xs={12}>
        {hasAuthorizationError || hasOrganizationTypeError || existingLinkPecOrganizationName ? (
          <React.Fragment>
            <Typography variant="h6" color="error" gutterBottom>
              {t(
                'veriforceIntegration.organization.organizationCannotBeLinked',
                'These organizations cannot be linked'
              )}
            </Typography>
            {hasAuthorizationError ? (
              <Typography>
                <Trans i18nKey="veriforceIntegration.organization.authorizationError">
                  This user is not authorized to link these organizations.
                  <Link to="/">Please try again.</Link>
                </Trans>
              </Typography>
            ) : hasOrganizationTypeError ? (
              <Typography>
                <Trans i18nKey="veriforceIntegration.organization.organizationTypeError">
                  You have tried to link a Contractor organization to a Client organization. Organizations can only be
                  linked if the organization type is the same.{' '}
                  <Link to="/">Please select a different organization to link</Link> or contact Veriforce for support.
                </Trans>
              </Typography>
            ) : (
              <Typography>
                <Trans i18nKey="veriforceIntegration.organization.organizationAlreadyLinked">
                  {{ existingLinkPecOrganizationName }} is already linked to {{ veriforceOrganizationName }}.{' '}
                  <Link to="/">Please select a different organization to link.</Link>
                </Trans>
              </Typography>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography variant="h6" gutterBottom>
              {t('veriforceIntegration.organization.linkYourOrganizations', 'Link Your PEC & Veriforce Organizations')}
            </Typography>
            <Typography>
              {t(
                'veriforceIntegration.organization.confirmationMessage',
                'You are linking your PEC organization with your Veriforce organization. Are you sure you want to link these organizations?'
              )}
            </Typography>
          </React.Fragment>
        )}
      </Grid>
      <Grid item xs={12}>
        <Typography>{t('veriforceIntegration.common.PECOrganization', 'PEC Organization')}</Typography>
        <Typography variant="body1">{pecOrganizationName}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography>{t('veriforceIntegration.common.veriforceOrganization', 'Veriforce Organization')}</Typography>
        <Typography variant="body1">{veriforceOrganizationName}</Typography>
      </Grid>
      {!hasAuthorizationError && !hasOrganizationTypeError && !existingLinkPecOrganizationName && (
        <React.Fragment>
          <Grid item>
            <Button variant="contained" color="primary" onClick={onClickLinkOrganizations}>
              {t('veriforceIntegration.organization.linkOrganizations', 'Link Organizations')}
            </Button>
          </Grid>
          <Grid item>
            <Button onClick={onClickBackToLogin}>{t('common.back', 'Back')}</Button>
          </Grid>
        </React.Fragment>
      )}
    </GridContainer>
  );
};
