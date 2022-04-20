import * as React from 'react';
import EmailIcon from '@material-ui/icons/Email';
import Grid from '@material-ui/core/Grid';
import PersonIcon from '@material-ui/icons/Person';
import PhoneIcon from '@material-ui/icons/Phone';
import PlaceIcon from '@material-ui/icons/Place';
import SmartPhoneIcon from '@material-ui/icons/Smartphone';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IconListItem } from '@pec/aion-ui-components/components/IconListItem';
import { IContractor } from 'interfaces/contractor';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const styles = (theme: Theme) =>
  createStyles({
    primaryColor: {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.common.white
    },
    icon: {
      fontSize: 35
    }
  });

type OwnProps = {
  contractor: IContractor;
};

type Props = WithStyles<typeof styles> & OwnProps;

export const ContractorInfo: React.FC<Props> = ({
  classes,
  contractor: {
    contactName,
    contactJobTitle,
    description,
    address,
    city,
    state,
    contactEmail,
    contactPhoneNumber,
    contactMobileNumber
  }
}) => {
  const { t } = useTranslation();

  return (
    <GridContainer>
      {description && (
        <Grid item xs={12}>
          <Typography variant="body1">{description}</Typography>
        </Grid>
      )}
      <Grid item sm={6} lg={4} xl={3}>
        <IconListItem
          className={classes.primaryColor}
          icon={<PersonIcon className={classes.icon} />}
          primaryText={contactName}
        >
          {contactJobTitle && contactJobTitle}
        </IconListItem>
      </Grid>
      <Grid item sm={6} lg={4} xl={3}>
        <IconListItem
          className={classes.primaryColor}
          icon={<PlaceIcon className={classes.icon} />}
          primaryText={address}
        >
          {`${city}, ${state}`}
        </IconListItem>
      </Grid>
      {contactEmail && (
        <Grid item sm={6} lg={4} xl={3}>
          <IconListItem
            className={classes.primaryColor}
            href={`mailto:${address}`}
            icon={<EmailIcon className={classes.icon} />}
            primaryText={contactEmail}
          >
            {t('trainingCompliance.common.email', 'Email')}
          </IconListItem>
        </Grid>
      )}
      {contactPhoneNumber && (
        <Grid item sm={6} lg={4} xl={3}>
          <IconListItem
            className={classes.primaryColor}
            href={`tel:${contactPhoneNumber}`}
            icon={<PhoneIcon className={classes.icon} />}
            primaryText={contactPhoneNumber}
          >
            {t('trainingCompliance.operator.contractor.office', 'Office')}
          </IconListItem>
        </Grid>
      )}
      {contactMobileNumber && (
        <Grid item sm={6} lg={4} xl={3}>
          <IconListItem
            className={classes.primaryColor}
            href={`tel:${contactPhoneNumber}`}
            icon={<SmartPhoneIcon className={classes.icon} />}
            primaryText={contactMobileNumber}
          >
            {t('trainingCompliance.common.mobile', 'Mobile')}
          </IconListItem>
        </Grid>
      )}
    </GridContainer>
  );
};

export const ContractorInfoComponent = withStyles(styles)(ContractorInfo);
