import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { IContractorTableOption } from 'interfaces/contractorTableOption';
import { ITableFilter } from '@pec/aion-ui-components/interfaces/tableFilter';
import { ITableHeader } from '@pec/aion-ui-components/interfaces/tableHeader';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    borderRadius: 0
  },
  table: {
    cursor: 'pointer',
    '& thead th': {
      top: 0,
      backgroundColor: theme.palette.common.white
    },

    '& tbody th': {
      backgroundColor: theme.palette.common.white
    }
  }
}));

type Props = {
  filters?: ITableFilter[];
  handlePageChange: (number: number) => void;
  headers: ITableHeader[];
  isFetchingData: boolean;
  options: IContractorTableOption[];
  handleSortChange?: (property: string, order: string) => void;
  order: 'asc' | 'desc';
  orderBy: string;
  page: number;
  pageSize: number;
  totalOptionsCount: number;
  handleChangeRowsPerPage?: (row: string) => void;
  pageSizes?: number[];
  tableTitle?: string;
  onClick?: (id: string, name: string) => void;
};

export const ContractorTableComponent: React.FC<Props> = ({
  handlePageChange,
  handleChangeRowsPerPage,
  headers,
  handleSortChange,
  order,
  orderBy,
  page,
  options,
  pageSize,
  pageSizes,
  totalOptionsCount,
  tableTitle,
  onClick
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();

  const handleRequestSort = (property: string) => {
    let newOrder: 'asc' | 'desc' = 'desc';

    if (orderBy === property && order === 'desc') {
      newOrder = 'asc';
    }

    if (handleSortChange) {
      handleSortChange(property, newOrder);
    }
  };

  const handlePage = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
    handlePageChange(page);
  };

  const handleRows = (_event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (handleChangeRowsPerPage) {
      handleChangeRowsPerPage(_event.target.value.toString());
    }
  };

  return (
    <Paper className={classes.root}>
      <TableContainer>
        <Table aria-label={tableTitle ?? ''} className={classes.table}>
          <TableHead>
            <TableRow>
              {headers.map((header, index) => {
                const { id: headerId, columnWidth, tooltip, label, align, isSortable } = header;
                return (
                  <TableCell
                    key={headerId + index}
                    sortDirection={orderBy === headerId ? order : false}
                    align={align || 'inherit'}
                    style={{
                      borderBottom: `1px solid ${theme.palette.primary}`,
                      maxWidth: columnWidth,
                      width: columnWidth
                    }}
                  >
                    {isSortable ? (
                      <Tooltip
                        title={
                          tooltip ??
                          (t('oshaViolations.common.sort', {
                            defaultValue: 'Sort by {{label}}',
                            label: label
                          }) ||
                            '')
                        }
                        enterDelay={300}
                      >
                        <TableSortLabel
                          active={orderBy === headerId}
                          direction={order}
                          onClick={() => handleRequestSort(headerId)}
                        >
                          {label}
                        </TableSortLabel>
                      </Tooltip>
                    ) : tooltip ? (
                      <Tooltip title={tooltip}>
                        <p style={{ margin: 0, padding: 0 }}>{label}</p>
                      </Tooltip>
                    ) : (
                      label
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {options.length > 0 ? (
              options.map((option, key) => {
                return (
                  <TableRow hover={onClick ? true : false} role="checkbox" tabIndex={-1} key={option.id + key}>
                    {headers.map((header, key) => {
                      const value = option[header.id];
                      return (
                        <TableCell component="th" scope="row" key={header.id + key}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={headers.length} style={{ height: 182 }}>
                  <Grid container spacing={2} direction="column" alignItems="center">
                    <Grid container item justify="center" xs={12}>
                      <ThumbUpIcon
                        style={{ height: '15%', width: '15%', alignSelf: 'center' }}
                        color="disabled"
                        fontSize="large"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6">
                        {t('oshaViolations.common.currentlyNoViolations', 'Currently No Violations')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography color="textSecondary">
                        {t(
                          'oshaViolations.common.searchedDaily',
                          'OSHA Violations are searched daily and will be listed here if found.'
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={pageSizes}
        component="div"
        count={totalOptionsCount}
        rowsPerPage={pageSize}
        page={page - 1}
        onChangePage={handlePage}
        onChangeRowsPerPage={handleRows}
      />
    </Paper>
  );
};
