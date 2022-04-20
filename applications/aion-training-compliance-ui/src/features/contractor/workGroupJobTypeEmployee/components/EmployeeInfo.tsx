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
import { IEmployee } from 'interfaces/employee';
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
  employee: IEmployee;
};

type Props = WithStyles<typeof styles> & OwnProps;

export const EmployeeInfo: React.FC<Props> = ({
  classes,
  employee: { name, addressLine1, addressLine2, city, state, emailAdress, phoneNumber, mobilePhoneNumber }
}) => {
  const { t } = useTranslation();

  return (
    <GridContainer>
      <Grid item sm={6} lg={4} xl={3}>
        <IconListItem
          className={classes.primaryColor}
          icon={<PersonIcon className={classes.icon} />}
          primaryText={name}
        />
      </Grid>
      {addressLine1 && city && state && (
        <Grid item sm={6} lg={4} xl={3}>
          <IconListItem
            className={classes.primaryColor}
            icon={<PlaceIcon className={classes.icon} />}
            primaryText={addressLine1}
          >
            {addressLine2 && <div className={classes.primaryColor}>{addressLine2}</div>}
            {`${city}, ${state}`}
          </IconListItem>
        </Grid>
      )}
      {emailAdress && (
        <Grid item sm={6} lg={4} xl={3}>
          <IconListItem
            className={classes.primaryColor}
            href={`mailto:${emailAdress}`}
            icon={<EmailIcon className={classes.icon} />}
            primaryText={emailAdress}
          >
            {t('trainingCompliance.common.email', 'Email')}
          </IconListItem>
        </Grid>
      )}
      {phoneNumber && (
        <Grid item sm={6} lg={4} xl={3}>
          <IconListItem
            className={classes.primaryColor}
            href={`tel:${phoneNumber}`}
            icon={<PhoneIcon className={classes.icon} />}
            primaryText={phoneNumber}
          >
            {t('trainingCompliance.contractor.workGroupJobTypeEmployee.work', 'Work')}
          </IconListItem>
        </Grid>
      )}
      {mobilePhoneNumber && (
        <Grid item sm={6} lg={4} xl={3}>
          <IconListItem
            className={classes.primaryColor}
            href={`tel:${mobilePhoneNumber}`}
            icon={<SmartPhoneIcon className={classes.icon} />}
            primaryText={mobilePhoneNumber}
          >
            {t('trainingCompliance.common.mobile', 'Mobile')}
          </IconListItem>
        </Grid>
      )}
    </GridContainer>
  );
};

export const EmployeeInfoComponent = withStyles(styles)(EmployeeInfo);
