import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { ITableHeader } from '@pec/aion-ui-components/interfaces/tableHeader';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { oshaRatio } from 'helpers/oshaRatio';
import { useTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%'
  },
  column: { color: theme.palette.text.secondary },
  table: {
    width: '100%',
    marginBottom: 24,

    '& th': {
      padding: '0px 24px 4px 0px '
    }
  },
  noDataRow: {
    borderBottom: 'none'
  },
  fonts: { color: theme.palette.text.primary, fontSize: 16, fontWeight: 500 }
}));

type Props = {
  headers: ITableHeader[];
  tableTitle: string;
  option: any;
  selected?: (id: string) => void;
  currentSelected?: string;
};

export const DetailsGrid: React.FC<Props> = ({ headers, tableTitle, option, selected, currentSelected }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();

  const veriforceMatch = (match: number) => `${oshaRatio(match)}% match`;

  const onSelected = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    selected && selected((event.target as HTMLButtonElement).value);
  };

  return (
    <>
      {tableTitle === 'VeriforceOrganizationInformation' && (
        <Grid container alignItems="center">
          <Radio
            checked={currentSelected === option.id}
            color="primary"
            onClick={onSelected}
            value={option.id}
            name="radio-button"
          />
          <Typography
            variant="subtitle1"
            className={classes.fonts}
            style={currentSelected === option.id ? { color: theme.palette.primary.main } : undefined}
          >
            {veriforceMatch(option.matchPercentage)}
          </Typography>
        </Grid>
      )}
      <Table
        aria-label={tableTitle ? tableTitle : ''}
        className={classes.table}
        style={
          ['VeriforceOrganizationInformation', 'VeriforceInformation'].includes(tableTitle)
            ? { marginLeft: 40 }
            : undefined
        }
        size="small"
      >
        <TableHead>
          <TableRow>
            {headers.map(header => (
              <TableCell
                variant="footer"
                className={classes.column}
                style={{
                  borderBottom: 'none',
                  minWidth: `${header.columnWidth}`,
                  width: `${header.columnWidth}`
                }}
                key={header.id}
                align={header.align || 'inherit'}
              >
                {header.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {option && Object.keys(option).length > 0 ? (
            <TableRow role="checkbox" tabIndex={-1} key={option.id} style={{ borderBottom: 'none' }}>
              {headers.map(header => {
                const value = option[header.id];
                return (
                  <TableCell
                    style={{
                      borderBottom: 'none',
                      fontSize: 16
                    }}
                    component="th"
                    scope="row"
                    key={header.id}
                  >
                    {value}
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
    </>
  );
};
