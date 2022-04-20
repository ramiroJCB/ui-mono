import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { ITrainee } from '../interfaces/trainee';
import { Link } from '@pec/aion-ui-components/components/Link';
import { Page } from './Page';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

const styles = (theme: Theme) => ({
  id: {
    color: '#e99842'
  },
  subtitle: {
    marginTop: theme.spacing(2)
  },
  img: {
    [theme.breakpoints.up('lg')]: {
      width: '50%',
      height: 'auto',
      marginLeft: '25%'
    },
    [theme.breakpoints.up('sm')]: {
      width: '75%',
      height: 'auto',
      marginLeft: '12.5%'
    },
    [theme.breakpoints.down('sm')]: {
      width: '50%',
      height: 'auto',
      marginLeft: '25%'
    },
    borderRadius: theme.shape.borderRadius
  }
});

type OwnProps = {
  trainee: ITrainee;
  onConfirm: () => Promise<ITrainee>;
};

type Props = WithStyles<typeof styles> & OwnProps & I18nextProps;

type State = {
  hasImgError: boolean;
};

class VerifyTraineeInfo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasImgError: false
    };
  }

  handleImgError = () => {
    this.setState({ hasImgError: true });
  };

  render() {
    const {
      trainee: { photoUrl, lastName, firstName, organizationName, phoneNumber, pecIdentifier },
      onConfirm,
      classes,
      t
    } = this.props;
    return (
      <Page title={t('registration.verifyTraineeinfo.verifyYourInfo', 'Verify Your Information')}>
        <GridContainer>
          <Grid item xs={12}>
            <Typography variant="h5" align="center" className={classes.id}>
              {t('registration.verifyTraineeinfo.id', 'ID:')} {pecIdentifier}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <img
              src={
                (!this.state.hasImgError && photoUrl) || `${process.env.PUBLIC_URL}/assets/images/default-avatar.svg`
              }
              alt={
                (!this.state.hasImgError && `${firstName} ${lastName}`) ||
                t('registration.verifyTraineeinfo.defaultUserAvatar', 'Default user avatar')
              }
              className={classes.img}
              onError={this.handleImgError}
            />
          </Grid>
          <Grid item sm={12} md={6}>
            <Typography variant="subtitle2">{t('registration.verifyTraineeinfo.name', 'Name')}</Typography>
            <Typography variant="body1">
              {lastName && firstName ? `${lastName}, ${firstName}` : lastName || firstName}
            </Typography>
            <Typography variant="subtitle2" className={classes.subtitle}>
              {t('registration.verifyTraineeinfo.employer', 'Employer')}
            </Typography>
            <Typography variant="body1">{organizationName}</Typography>
            <Typography variant="subtitle2" className={classes.subtitle}>
              {t('registration.verifyTraineeinfo.phone', 'Phone')}
            </Typography>
            <Typography variant="body1">
              {phoneNumber ? phoneNumber : t('registration.verifyTraineeinfo.notAvailable', 'n/a')}
            </Typography>
          </Grid>
        </GridContainer>
        <GridContainer>
          <Grid item xs={12} md={6}>
            <Button color="secondary" variant="contained" onClick={onConfirm} fullWidth>
              {t('registration.verifyTraineeinfo.thisIsMe', 'This is Me')}
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button color="primary" variant="contained" fullWidth component={Link} to="/enter-pec-id">
              {t('registration.verifyTraineeinfo.tryAnotherPEC', 'Try another PEC ID')}
            </Button>
          </Grid>
        </GridContainer>
      </Page>
    );
  }
}

export default withStyles(styles)(withTranslation()(VerifyTraineeInfo));
