import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import HelpIcon from '@material-ui/icons/Help';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import SchoolIcon from '@material-ui/icons/School';
import WorkIcon from '@material-ui/icons/Work';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Link } from 'react-router-dom';
import { RouteComponentProps, withRouter } from 'react-router';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { Tile } from 'components/Tile';
import { useTranslation } from 'react-i18next';

const styles = (theme: Theme) => ({
  buttonIcon: {
    marginRight: theme.spacing(1)
  }
});

type RouteParams = {
  organizationId: string;
};

type Props = WithStyles<typeof styles> & RouteComponentProps<RouteParams>;

const INFORMATION_RELEASE_SECTION_ID = 3;

const OfferingsTileComponent: React.FC<Props> = ({
  match: {
    params: { organizationId }
  },
  classes
}) => {
  const { t } = useTranslation();

  return (
    <Tile primaryText={t('subscriber.dashboard.offeringsTile.title', 'PEC Offerings')}>
      <GridContainer>
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            href="http://www.pecsafety.com/pec-training.html"
            target="_blank"
          >
            <SchoolIcon className={classes.buttonIcon} />
            {t('subscriber.dashboard.offeringsTile.viewTrainingOfferings', 'View Training Offerings')}
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            href="http://www.pecsafety.com/safety-meetings.html"
            target="_blank"
          >
            <LocalHospitalIcon className={classes.buttonIcon} />
            {t('subscriber.dashboard.offeringsTile.accessSafetyMeetings', 'Access Safety Meetings')}
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            component={Link}
            to={`/${organizationId}/questionnaire/${INFORMATION_RELEASE_SECTION_ID}`}
            target="_blank"
            fullWidth
            variant="outlined"
            color="primary"
          >
            <WorkIcon className={classes.buttonIcon} />
            {t('subscriber.dashboard.offeringsTile.getHired', 'Get Hired')}
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button fullWidth variant="outlined" color="primary" href="http://www.pecsafety.com/contact" target="_blank">
            <HelpIcon className={classes.buttonIcon} />
            {t('subscriber.dashboard.offeringsTile.getHelp', 'Get Help')}
          </Button>
        </Grid>
      </GridContainer>
    </Tile>
  );
};

export const OfferingsTile = withStyles(styles)(withRouter(OfferingsTileComponent));
