import * as React from 'react';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { FiltersContainer } from '../containers/Filters';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Link } from 'react-router-dom';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

const styles = {
  paper: {
    width: 400
  }
};

type OwnProps = {
  isFiltered: boolean;
};

type Props = WithStyles<typeof styles> & OwnProps & I18nextProps;

type State = {
  open: boolean;
};

class Component extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      open: false
    };
  }

  close = () => {
    this.setState({ open: false });
  };

  open = () => {
    this.setState({ open: true });
  };

  render() {
    const { isFiltered, classes, t } = this.props;
    const { open } = this.state;

    return (
      <React.Fragment>
        <Button variant="outlined" onClick={this.open}>
          <Badge variant="dot" color="error" badgeContent={Number(isFiltered)}>
            {t('safetyPrograms.common.filters', 'Filters')}
          </Badge>
        </Button>
        <Drawer anchor="right" open={open} onClose={this.close} classes={classes}>
          <GridContainer justify="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h6">{t('safetyPrograms.common.filters', 'Filters')}</Typography>
            </Grid>
            <Grid item style={{ padding: 0 }}>
              <GridContainer>
                {isFiltered && (
                  <Grid item>
                    <Button onClick={this.close} color="primary" component={Link} to={{ search: '' }}>
                      {t('safetyPrograms.filters.clear', 'Clear')}
                    </Button>
                  </Grid>
                )}
                <Grid item>
                  <Button onClick={this.close}>{t('safetyPrograms.filters.close', 'Close')}</Button>
                </Grid>
              </GridContainer>
            </Grid>
            <Grid item xs={12} style={{ padding: 0 }}>
              <FiltersContainer open={open} />
            </Grid>
          </GridContainer>
        </Drawer>
      </React.Fragment>
    );
  }
}

export const FiltersDrawer = withStyles(styles)(withTranslation()(Component));
