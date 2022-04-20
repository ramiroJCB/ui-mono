import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import MultipleTraineesTableRow from './MultipleTraineesTableRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { History } from 'history';
import { ITrainee } from '../interfaces/trainee';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const styles = (theme: Theme) => ({
  topGrid: {
    marginTop: -theme.spacing(1)
  },
  table: {
    marginRight: 'auto',
    marginLeft: 'auto',
    maxWidth: 700
  },
  tableHeader: {
    background: theme.palette.grey[200]
  },
  tableCell: {
    color: theme.palette.common.black,
    padding: theme.spacing(1)
  }
});

type OwnProps = {
  history: History;
  trainees: ITrainee[];
  handleRowClick: (trainee: ITrainee) => () => Promise<ITrainee>;
};

type Props = WithStyles<typeof styles> & OwnProps;

const MultipleTrainees: React.FC<Props> = ({ history, trainees, handleRowClick, classes }) => {
  const { t } = useTranslation();

  return (
    <GridContainer alignItems="center" justify="center">
      <Grid item xs={12} className={classes.topGrid}>
        <Typography variant="h6" align="center">
          {t('registration.multipleTrainees.selectRecord', 'Please select the record you want to use')}
        </Typography>
      </Grid>
      <Grid item xs={12} style={{ overflowX: 'auto' }}>
        <Table className={classes.table}>
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell className={classes.tableCell} style={{ textAlign: 'center' }}>
                {t('registration.multipleTrainees.photo', 'Photo')}
              </TableCell>
              <TableCell className={classes.tableCell}>{t('registration.multipleTrainees.name', 'Name')}</TableCell>
              <TableCell className={classes.tableCell}>
                {t('registration.multipleTrainees.employer', 'Employer')}
              </TableCell>
              <TableCell className={classes.tableCell} style={{ textAlign: 'right' }}>
                {t('registration.multipleTrainees.lastUpdated', 'Last Updated')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trainees.map(trainee => (
              <MultipleTraineesTableRow
                key={trainee.id}
                trainee={trainee}
                history={history}
                handleRowClick={handleRowClick}
              />
            ))}
          </TableBody>
        </Table>
      </Grid>
    </GridContainer>
  );
};

export default withStyles(styles)(MultipleTrainees);
