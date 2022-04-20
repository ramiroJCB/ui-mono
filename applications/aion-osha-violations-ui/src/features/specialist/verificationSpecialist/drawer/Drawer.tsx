import * as React from 'react';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import FilterListIcon from '@material-ui/icons/FilterList';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IViolationsFilters } from 'interfaces/violationsFilters';
import { makeStyles } from '@material-ui/core/styles';
import { ViolationsFilterForm } from '../violationsFilterForm/ViolationsFilterForm';
import { useTranslation } from 'react-i18next';

type Props = {
  initialValues: IViolationsFilters;
  isFiltered: number;
};

const useStyles = makeStyles(() => ({
  paper: {
    width: 400
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row'
  },
  filters: {
    padding: '1rem'
  }
}));

export const FiltersDrawer: React.FC<Props> = ({ initialValues, isFiltered }) => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const toggleOpen = () => setOpen(!open);
  const { t } = useTranslation();

  return (
    <>
      <Grid className={classes.buttons}>
        <Button color="primary" className={classes.buttons} startIcon={<FilterListIcon />} onClick={toggleOpen}>
          <Badge variant="dot" color="error" badgeContent={isFiltered}>
            <Typography variant="button">{t('oshaViolations.common.filters', 'Filters')}</Typography>
          </Badge>
        </Button>
      </Grid>

      <Drawer anchor="right" open={open} onClose={toggleOpen} classes={{ paper: classes.paper }}>
        <GridContainer justify="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h6">{t('oshaViolations.common.filters', 'Filters')}</Typography>
          </Grid>
          <Grid item style={{ padding: 0 }}>
            <GridContainer>
              <Grid item>
                <Button color="primary" onClick={toggleOpen}>
                  {t('oshaViolations.common.close', 'Close')}
                </Button>
              </Grid>
            </GridContainer>
          </Grid>
          <Grid item xs={12} className={classes.filters}>
            <ViolationsFilterForm initialValues={initialValues} />
          </Grid>
        </GridContainer>
      </Drawer>
    </>
  );
};
