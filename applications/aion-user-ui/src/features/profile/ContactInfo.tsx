import * as React from 'react';
import CreateIcon from '@material-ui/icons/Create';
import EmailIcon from '@material-ui/icons/Email';
import Grid from '@material-ui/core/Grid';
import PersonIcon from '@material-ui/icons/Person';
import PhoneIcon from '@material-ui/icons/Phone';
import Typography from '@material-ui/core/Typography';
import { FloatingActionButton } from '@pec/aion-ui-components/components/FloatingActionButton';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IconListItem } from '@pec/aion-ui-components/components/IconListItem';
import { ITrainee } from '@pec/aion-ui-core/interfaces/trainee';
import { ITraineeCourseCredit } from 'interfaces/traineeCourseCredit';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { ProfileHeader } from './ProfileHeader';
import { Tabs } from './Tabs';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    position: 'relative'
  },
  paper: {
    padding: theme.spacing(1)
  },
  gridItem: {
    display: 'flex'
  },
  h6: {
    fontWeight: 'bold'
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    zIndex: 1000
  },
  contactListItem: {
    '& li': {
      alignItems: 'flex-start'
    }
  }
}));

type Props = {
  trainee: ITrainee;
  traineeCourseCredits: ITraineeCourseCredit[];
};

export const ContactInfo: React.FC<Props> = ({ trainee, traineeCourseCredits }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const {
    emailAddress,
    phoneNumber,
    emergencyContactName,
    emergencyContactPhoneNumber,
    emergencyContactRelation
  } = trainee;

  return (
    <GridContainer>
      <Grid item xs={12}>
        <Tabs trainee={trainee} traineeCourseCredits={traineeCourseCredits} />
      </Grid>
      <Grid item xs={12}>
        <GridContainer alignContent="center" justify="center" className={classes.container}>
          <Grid item xs={12}>
            <ProfileHeader trainee={trainee} />
          </Grid>
          <Grid item xs={12} sm={10} md={6}>
            <Paper className={classes.paper}>
              <Grid item xs={12}>
                {!emailAddress &&
                  !phoneNumber &&
                  !emergencyContactName &&
                  !emergencyContactPhoneNumber &&
                  !emergencyContactRelation && (
                    <Typography variant="body1" align="center">
                      {t('user.profile.noneProvided', 'None Provided')}
                    </Typography>
                  )}
                {emailAddress && (
                  <Grid item xs={12} className={classes.gridItem}>
                    <IconListItem icon={<EmailIcon />} primaryText={t('user.profile.emailAddress', 'Email Address')}>
                      {emailAddress}
                    </IconListItem>
                  </Grid>
                )}
                {phoneNumber && (
                  <Grid item xs={12} className={classes.gridItem}>
                    <IconListItem icon={<PhoneIcon />} primaryText={t('user.profile.phoneNumber', 'Phone Number')}>
                      {phoneNumber}
                    </IconListItem>
                  </Grid>
                )}
                {(emergencyContactName || emergencyContactPhoneNumber || emergencyContactRelation) && (
                  <Grid item xs={12} className={classes.contactListItem}>
                    <IconListItem
                      icon={<PersonIcon />}
                      primaryText={t('user.profile.emergencyContact', 'Emergency Contact')}
                    >
                      {emergencyContactRelation && (
                        <React.Fragment>
                          {emergencyContactRelation} <br />
                        </React.Fragment>
                      )}
                      {emergencyContactName && (
                        <React.Fragment>
                          {emergencyContactName} <br />
                        </React.Fragment>
                      )}
                      {emergencyContactPhoneNumber && emergencyContactPhoneNumber}
                    </IconListItem>
                  </Grid>
                )}
                <FloatingActionButton
                  to={`/edit-contact-info`}
                  icon={<CreateIcon />}
                  size="small"
                  label={t('user.profile.editContactInfo', 'Edit Contact Info')}
                  className={classes.fab}
                />
              </Grid>
            </Paper>
          </Grid>
        </GridContainer>
      </Grid>
    </GridContainer>
  );
};
