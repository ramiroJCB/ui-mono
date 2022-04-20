import Grid from '@material-ui/core/Grid';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { CurrentStatus, IInspection } from 'interfaces/inspection';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  item: {
    padding: theme.spacing(2)
  },
  label: {
    marginTop: theme.spacing(1)
  }
}));

type Props = {
  inspection: IInspection;
};

export const MobileInspectionInfo: React.FC<Props> = ({
  inspection: {
    formName,
    status,
    contractorName,
    businessUnitName,
    createdByUserFirstName,
    createdByUserLastName,
    dateOfInspectionUtc
  }
}) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Grid container>
      <Grid item xs={12} classes={{ root: classes.item }}>
        <Typography variant="h5">{formName}</Typography>
        <Typography variant="subtitle2">
          <span
            style={{
              color: status === CurrentStatus.InProgress ? theme.palette.error.dark : theme.palette.secondary.main
            }}
          >
            {status === CurrentStatus.InProgress ? 'In Progress' : 'Submitted'}
          </span>
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" className={classes.label}>
          Contractor
        </Typography>
        <Typography variant="body1">{contractorName}</Typography>
        {businessUnitName && (
          <React.Fragment>
            <Typography variant="subtitle2" color="textSecondary" className={classes.label}>
              Business Unit
            </Typography>
            <Typography variant="body1">{businessUnitName}</Typography>
          </React.Fragment>
        )}
        <Typography variant="subtitle2" color="textSecondary" className={classes.label}>
          Report Contact
        </Typography>
        <Typography variant="body1">
          {createdByUserFirstName} {createdByUserLastName}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" className={classes.label}>
          Review Date
        </Typography>
        <Typography variant="body1">{new Date(dateOfInspectionUtc).toLocaleDateString()}</Typography>
      </Grid>
    </Grid>
  );
};
