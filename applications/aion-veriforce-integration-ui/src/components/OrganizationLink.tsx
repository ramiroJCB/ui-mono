import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IOrganizationLink } from '@pec/aion-ui-core/interfaces/organizationLink';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

type OwnProps = {
  organizationLink: IOrganizationLink;
  onClickUnlinkOrganizations: () => void;
};

type Props = OwnProps & I18nextProps;

type State = {
  isConfirmingUnlink: boolean;
};

const onClickContinue = () => window.location.assign('/');

class Component extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isConfirmingUnlink: false
    };
  }

  handleToggleConfirmUnlink = () => {
    this.setState(prevState => ({
      isConfirmingUnlink: !prevState.isConfirmingUnlink
    }));
  };

  render() {
    const {
      organizationLink: { pecOrganizationName, veriforceOrganizationName },
      onClickUnlinkOrganizations,
      t
    } = this.props;
    const { isConfirmingUnlink } = this.state;

    return (
      <GridContainer justify="space-between">
        <Grid item xs={12}>
          {isConfirmingUnlink ? (
            <Typography variant="h6" color="error">
              {t(
                'veriforceIntegration.organization.confirmingUnlink',
                'Are you sure you want to unlink these organizations?'
              )}
            </Typography>
          ) : (
            <Typography variant="h6" color="secondary">
              {t('veriforceIntegration.organization.organizationsLinked', 'Your organizations have been linked!')}
            </Typography>
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
        {isConfirmingUnlink ? (
          <React.Fragment>
            <Grid item>
              <Button variant="contained" color="primary" onClick={onClickUnlinkOrganizations}>
                {t('veriforceIntegration.organization.unlink', 'Yes, Unlink Them')}
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={this.handleToggleConfirmUnlink}>
                {t('veriforceIntegration.organization.cancel', 'No, Cancel')}
              </Button>
            </Grid>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Grid item>
              <Button variant="contained" color="primary" onClick={onClickContinue}>
                {t('veriforceIntegration.organization.continue', {
                  hostname: window.location.hostname,
                  defaultValue: 'Continue to {{hostname}}'
                })}
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={this.handleToggleConfirmUnlink}>
                {t('veriforceIntegration.organization.unlinkOrganizations', 'Unlink Organizations')}
              </Button>
            </Grid>
          </React.Fragment>
        )}
      </GridContainer>
    );
  }
}

export const OrganizationLinkComponent = withTranslation()(Component);
