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
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => ({
  column: { color: theme.palette.text.secondary },
  table: {
    marginBottom: 24,
    width: '100%',
    '& th': {
      padding: '0px 10px 0px 0px '
    }
  },
  noDataRow: {
    borderBottom: 'none'
  },
  fonts: { color: theme.palette.text.primary, fontSize: 16, fontWeight: 500 }
}));
interface IContractorOptions {
  year: string;
  count: number;
  types: {
    O: number;
    R: number;
    S: number;
    W: number;
  };
}

type Props = {
  headers: ITableHeader[];
  tableTitle?: string;
  options: IContractorOptions[];
};

export const ViolationsGrid: React.FC<Props> = ({ headers, tableTitle, options }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <>
      <Table aria-label={tableTitle ?? ''} className={classes.table} size="small">
        <TableHead>
          <TableRow>
            {headers.map(header => (
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
                  {header.label}
                </Grid>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {options?.length > 0 ? (
            options.map((option: any, index: any) => (
              <TableRow
                role="checkbox"
                tabIndex={-1}
                key={index}
                style={{ borderBottom: `1px solid ${theme.palette.primary}` }}
              >
                {headers.map(header => {
                  const value = option[header.id];
                  return (
                    <TableCell
                      style={{
                        borderBottom: `1px solid ${theme.palette.primary}`,
                        fontSize: `${header.id === 'count' ? '20px' : '16px'}`,
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
                          justifyContent: 'center',
                          paddingLeft: index === 0 && header.id === 'year' ? 8 : 0
                        }}
                        spacing={1}
                      >
                        <Grid item>{index === 0 && header.id === 'year' ? value + '*' : value}</Grid>
                        {header.id === 'count' && value > 0 && (
                          <Tooltip
                            title={
                              <>
                                <p>
                                  {t('oshaViolations.violationsGrid.repeat', {
                                    defaultValue: '{{type}} Repeat',
                                    type: option.types.R
                                  })}
                                </p>
                                <p>
                                  {t('oshaViolations.violationsGrid.willful', {
                                    defaultValue: '{{type}} Willful',
                                    type: option.types.W
                                  })}
                                </p>
                                <p>
                                  {t('oshaViolations.violationsGrid.serious', {
                                    defaultValue: '{{type}} Serious',
                                    type: option.types.S
                                  })}
                                </p>
                                <p>
                                  {t('oshaViolations.violationsGrid.other', {
                                    defaultValue: '{{type}} Other',
                                    type: option.types.O
                                  })}
                                </p>
                              </>
                            }
                          >
                            <Grid item style={{ display: 'flex', padding: 0 }}>
                              <InfoOutlinedIcon style={{ alignSelf: 'center' }} fontSize="small" color="action" />
                            </Grid>
                          </Tooltip>
                        )}
                      </Grid>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
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
    </>
  );
};
