import * as React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  toggleLivesOnSite: () => Promise<void>;
  livesOnSite: boolean;
};

const styles = () => ({
  switch: {
    marginTop: 0
  }
});

type Props = WithStyles<typeof styles> & OwnProps;

const LivesOnSiteSwitchComponent: React.FC<Props> = ({ livesOnSite, toggleLivesOnSite, classes }) => {
  const { t } = useTranslation();
  return (
    <GridContainer direction="row" justify="center">
      <FormControlLabel
        control={
          <Switch
            value={livesOnSite.toString()}
            checked={livesOnSite}
            className={classes.switch}
            onChange={toggleLivesOnSite}
          />
        }
        label={<Typography variant="button">{t('smart.livesOnSite.livesOnSite', 'Lives On Site')}</Typography>}
      />
    </GridContainer>
  );
};

export const LivesOnSiteSwitch = withStyles(styles)(LivesOnSiteSwitchComponent);
