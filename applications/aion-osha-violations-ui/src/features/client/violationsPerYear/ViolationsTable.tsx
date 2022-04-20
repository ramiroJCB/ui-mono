import Grid from '@material-ui/core/Grid';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { ITableHeader } from '@pec/aion-ui-components/interfaces/tableHeader';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { useTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const useStyles = makeStyles((theme: Theme) => ({
  column: { color: theme.palette.text.secondary, fontSize: 18, fontWeight: 500 },
  table: {
    marginBottom: 24,
    width: '100%',
    '& th': {
      padding: '0px 5px 0px 0px '
    }
  },
  noDataRow: {
    borderBottom: 'none'
  },
  fonts: { color: theme.palette.text.primary, fontSize: 36, fontWeight: 500 }
}));

interface IViolationsPerYearOptions {
  [year: string]: {
    year: string;
    count: number;
    types: {
      O: number;
      R: number;
      S: number;
      W: number;
    };
  };
}

type Props = {
  headers: ITableHeader[];
  tableTitle?: string;
  options: IViolationsPerYearOptions;
};

export const ViolationsTable: React.FC<Props> = ({ headers, tableTitle, options }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <Table aria-label={tableTitle ?? ''} className={classes.table}>
      <TableHead>
        <TableRow>
          {headers.map((header, index) => (
            <TableCell
              variant="footer"
              className={classes.column}
              style={{
                borderBottom: `1px solid ${theme.palette.primary}`,
                width: `${header.columnWidth}`,
                marginLeft: 10
              }}
              key={header.id}
              align={header.align || 'inherit'}
            >
              <Grid container justify="center" item alignItems="center">
                {index === 0 ? header.label + '*' : header.label}
              </Grid>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {options ? (
          <TableRow role="checkbox" tabIndex={-1} style={{ borderBottom: `1px solid ${theme.palette.primary}` }}>
            {headers.map(header => {
              const value = options[header.id];
              return (
                <TableCell
                  style={{
                    borderBottom: `1px solid ${theme.palette.primary}`,
                    fontSize: 18,
                    fontWeight: 500,
                    color: `${theme.palette.grey[600]}`,
                    justifyContent: 'center'
                  }}
                  component="th"
                  scope="row"
                  key={header.id}
                >
                  <Grid
                    container
                    style={{
                      justifyContent: 'center'
                    }}
                    spacing={1}
                  >
                    <Grid item>{value.count}</Grid>
                    {value.count > 0 && (
                      <Tooltip
                        title={
                          <>
                            <p>
                              {t('oshaViolations.violationsGrid.repeat', {
                                defaultValue: '{{type}} Repeat',
                                type: value.types.R
                              })}
                            </p>
                            <p>
                              {t('oshaViolations.violationsGrid.willful', {
                                defaultValue: '{{type}} Willful',
                                type: value.types.W
                              })}
                            </p>
                            <p>
                              {t('oshaViolations.violationsGrid.serious', {
                                defaultValue: '{{type}} Serious',
                                type: value.types.S
                              })}
                            </p>
                            <p>
                              {t('oshaViolations.violationsGrid.other', {
                                defaultValue: '{{type}} Other',
                                type: value.types.O
                              })}
                            </p>
                          </>
                        }
                      >
                        <Grid item style={{ display: 'flex', padding: 0 }}>
                          <InfoOutlinedIcon style={{ alignSelf: 'center' }} fontSize="small" />
                        </Grid>
                      </Tooltip>
                    )}
                  </Grid>
                </TableCell>
              );
            })}
          </TableRow>
        ) : (
          <TableRow>
            <TableCell className={classes.noDataRow} colSpan={headers.length}>
              <Typography color="primary" variant="h3" align="center">
                {t('oshaViolations.common.noDataFound', 'No data found')}
              </Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
