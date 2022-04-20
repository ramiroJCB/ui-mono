import { makeStyles, createStyles } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';

export const useSharedTableStyles = makeStyles((theme: Theme) =>
  createStyles({
    dividedTable: {
      '& .MuiTableCell-root': {
        borderBottom: 'none !important'
      },
      marginTop: theme.spacing(4),
      borderLeftColor: theme.palette.divider,
      borderLeft: 'solid 1px'
    },
    pagination: { borderBottom: 0 },
    tableCell: {
      fontSize: 16
    }
  })
);
