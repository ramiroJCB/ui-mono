import * as React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Barcode from 'react-barcode';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import WarningIcon from '@material-ui/icons/Warning';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { ITrainee } from '@pec/aion-ui-core/interfaces/trainee';
import { ITraineeCourseCredit } from 'interfaces/traineeCourseCredit';
import { IconListItem } from '@pec/aion-ui-components/components/IconListItem';
import { ProfileHeader } from './ProfileHeader';
import { Tabs } from './Tabs';
import { localizeDate } from '@pec/aion-ui-i18next/helpers/localize';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    position: 'relative'
  },
  paper: {
    padding: theme.spacing(1)
  },
  trainingGrid: {
    paddingBottom: theme.spacing(2)
  },
  good: {
    backgroundColor: theme.palette.secondary.main
  },
  bad: {
    backgroundColor: theme.palette.error.main
  },
  trainingDetail: {
    display: 'flex',
    paddingLeft: theme.spacing(2)
  },
  trainingData: {
    paddingLeft: theme.spacing(1)
  },
  gridItem: {
    display: 'flex'
  },
  h6: {
    fontWeight: 'bold'
  }
}));

type Props = {
  trainee: ITrainee;
  traineeCourseCredits: ITraineeCourseCredit[];
};

export const TrainingHistory: React.FC<Props> = ({ trainee, traineeCourseCredits }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();

  const filteredDuplicateCourses = traineeCourseCredits.filter(
    (course, i, traineeCourseCredits) =>
      i ===
      traineeCourseCredits.findIndex(
        t => t.courseName === course.courseName && t.courseExpired === course.courseExpired
      )
  );

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
          <Hidden mdUp>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <Barcode
                value={trainee.pecIdentifier}
                format="CODE128"
                background={theme.palette.background.default}
                lineColor={theme.palette.common.black}
                fontOptions="bold"
              />
            </Grid>
          </Hidden>
          <Grid item xs={12} sm={10} md={6}>
            <Grid container>
              <Grid item xs={12} className={classes.trainingGrid}>
                {filteredDuplicateCourses.length > 0 ? (
                  filteredDuplicateCourses.map(
                    ({
                      trainingCourseId,
                      courseName,
                      trainingLevel,
                      validatingCompanyName,
                      courseExpired,
                      completionDate
                    }) => (
                      <Accordion key={trainingCourseId + completionDate}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <IconListItem
                            icon={courseExpired ? <WarningIcon /> : <VerifiedUserIcon />}
                            primaryText={courseName}
                            className={courseExpired ? classes.bad : classes.good}
                          />
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container>
                            <Grid item xs={12} className={classes.trainingDetail}>
                              <Typography variant="body1" className={classes.h6}>
                                {t('user.profile.status', 'Status:')}
                              </Typography>
                              <Typography variant="body1" className={classes.trainingData}>
                                {courseExpired
                                  ? t('user.profile.expired', 'Expired')
                                  : t('user.profile.valid', 'Valid')}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} className={classes.trainingDetail}>
                              <Typography variant="body1" className={classes.h6}>
                                {t('user.profile.dateTaken', 'Date Taken:')}
                              </Typography>
                              <Typography variant="body1" className={classes.trainingData}>
                                {completionDate
                                  ? localizeDate(completionDate, t)
                                  : t('user.profile.noneProvided', 'None Provided')}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} className={classes.trainingDetail}>
                              <Typography variant="body1" className={classes.h6}>
                                {t('user.profile.validatingCompany', 'Validating Company:')}
                              </Typography>
                              <Typography variant="body1" className={classes.trainingData}>
                                {validatingCompanyName}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} className={classes.trainingDetail}>
                              <Typography variant="body1" className={classes.h6}>
                                {t('user.profile.trainingLevel', 'Training Level:')}
                              </Typography>
                              <Typography variant="body1" className={classes.trainingData}>
                                {trainingLevel}
                              </Typography>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    )
                  )
                ) : (
                  <Typography paragraph align="center">
                    {t('user.profile.noTraining', 'No training has been associated with this profile.')}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
        </GridContainer>
      </Grid>
    </GridContainer>
  );
};
