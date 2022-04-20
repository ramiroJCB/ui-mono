import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Link } from '@pec/aion-ui-components/components/Link';
import { withTranslation, Trans } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

type OwnProps = {
  hasPermission: boolean;
  pecOrganizationName: string;
  onSubmit: (username: string, password: string) => void;
  hasError: boolean;
  username: string;
  password: string;
};

type Props = OwnProps & I18nextProps;

type State = {
  username: string;
  password: string;
};

class Component extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { username, password } = props;
    this.state = {
      username,
      password
    };
  }

  handleChangeUsername = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ username: value.toUpperCase() });
  };

  handleChangePassword = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: value });
  };

  handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { username, password } = this.state;
    this.props.onSubmit(username, password);
  };

  render() {
    const { pecOrganizationName, hasPermission, t } = this.props;
    const { username, password } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <GridContainer>
          <Grid item xs={4}>
            <GridContainer>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {t('veriforceIntegration.organization.login.title', 'Log in to VeriSource™')}
                </Typography>
                {hasPermission ? (
                  <Typography>
                    {t(
                      'veriforceIntegration.organization.login.enterCredentials',
                      'To link your organizations, enter your VeriSource credentials.'
                    )}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="error">
                    <Trans i18nKey="veriforceIntegration.organization.login.authorizationError">
                      This user is not authorized to link {{ pecOrganizationName }} to a Veriforce organization.{' '}
                      <Link to="/">Please try again.</Link>
                    </Trans>
                  </Typography>
                )}
              </Grid>
              {hasPermission && (
                <React.Fragment>
                  {this.props.hasError && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="error">
                        {t(
                          'veriforceIntegration.organization.login.loginError',
                          'An error occurred while logging in. Please try again.'
                        )}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <TextField
                      label={t('veriforceIntegration.organization.login.username', 'VeriSource Username')}
                      name="username"
                      value={username}
                      onChange={this.handleChangeUsername}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label={t('veriforceIntegration.organization.login.password', 'VeriSource Password')}
                      name="password"
                      type="password"
                      value={password}
                      onChange={this.handleChangePassword}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" color="primary" type="submit">
                      {t('veriforceIntegration.organization.login.loginButton', 'Log in')}
                    </Button>
                  </Grid>
                </React.Fragment>
              )}
            </GridContainer>
          </Grid>
          <Grid item xs={8} style={{ marginTop: 40 }}>
            <GridContainer>
              <Grid item xs={12}>
                <Typography>
                  <Trans i18nKey="veriforceIntegration.organization.login.PECMergedWithVeriforce">
                    <strong>PEC has merged with Veriforce</strong>, a leading provider of OQ compliance and other
                    midstream solutions, to create a comprehensive supply chain safety and compliance platform.
                  </Trans>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  <Trans i18nKey="veriforceIntegration.organization.login.linkAccounts">
                    If you have login credentials for the Veriforce system, using them to{' '}
                    <strong>link your PEC and Veriforce accounts now</strong> will enable your organization to
                    immediately take advantage of future enhancements and a more streamlined user experience as we roll
                    out these benefits.
                  </Trans>
                </Typography>
              </Grid>
            </GridContainer>
          </Grid>
        </GridContainer>
      </form>
    );
  }
}

export const VeriforceLoginComponent = withTranslation()(Component);
