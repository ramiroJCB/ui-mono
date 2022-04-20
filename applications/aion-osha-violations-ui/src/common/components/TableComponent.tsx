import Paper from '@material-ui/core/Paper';
import * as React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { ITableFilter } from '@pec/aion-ui-components/interfaces/tableFilter';
import { ITableHeader } from '@pec/aion-ui-components/interfaces/tableHeader';
import { IViolationsTableOption } from 'interfaces/violationsTableOption';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    borderRadius: 0
  },
  table: {
    cursor: 'pointer',
    '& thead th': {
      position: 'sticky',
      top: 0,
      backgroundColor: theme.palette.common.white,
      'z-index': 1
    },
    '& tbody th': {
      position: 'sticky',
      left: 0,
      'z-index': 2,
      backgroundColor: theme.palette.common.white
    }
  }
}));

type Props = {
  filters?: ITableFilter[];
  handlePageChange: (number: number) => void;
  headers: ITableHeader[];
  isFetchingData: boolean;
  options: IViolationsTableOption[];
  handleSortChange: (property: string, order: string) => void;
  order: 'asc' | 'desc';
  orderBy: string;
  page: number;
  pageSize: number;
  totalOptionsCount: number;
  handleChangeRowsPerPage?: (row: string) => void;
  pageSizes?: number[];
  tableTitle?: string;
  onClick: (id: string, name: string) => void;
};

export const TableComponent: React.FC<Props> = ({
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
        <Table aria-label={tableTitle ? tableTitle : ''} className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell key={headers[0].id} style={{ zIndex: 4, position: 'sticky', minWidth: 250, maxWidth: 250 }}>
                <Tooltip title={headers[0].tooltip ?? ''}>
                  <p>{headers[0].label}</p>
                </Tooltip>
              </TableCell>
              {headers.slice(1).map((header, index) => (
                <TableCell
                  key={header.id + index}
                  sortDirection={orderBy === header.id ? order : false}
                  align={header.align || 'inherit'}
                >
                  {header.isSortable ? (
                    <Tooltip
                      title={
                        header.tooltip
                          ? header.tooltip
                          : t('oshaViolations.common.sort', {
                              defaultValue: 'Sort by {{label}}',
                              label: header.label
                            }) || ''
                      }
                      enterDelay={300}
                    >
                      <TableSortLabel
                        active={orderBy === header.id}
                        direction={order}
                        onClick={() => handleRequestSort(header.id)}
                      >
                        {header.label}
                      </TableSortLabel>
                    </Tooltip>
                  ) : header.tooltip ? (
                    <Tooltip title={header.tooltip}>
                      <p style={{ margin: 0, padding: 0 }}>{header.label}</p>
                    </Tooltip>
                  ) : (
                    header.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {options.length > 0 ? (
              options.map((option, key) => {
                return (
                  <TableRow
                    style={{ minHeight: '7vh', height: '7vh' }}
                    hover={onClick ? true : false}
                    role="checkbox"
                    tabIndex={-1}
                    key={option.id + key}
                  >
                    {headers.map((header, key) => {
                      const value = option[header.id];
                      return (
                        <TableCell
                          component="th"
                          scope="row"
                          style={{ zIndex: header.id === 'oshaCompanyName' ? 3 : 0 }}
                          key={header.id + key}
                          onClick={() => {
                            if (header.id !== 'activity' && header.id !== 'view')
                              onClick(option.id, option.oshaCompanyName);
                          }}
                        >
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
                  <Typography color="primary" variant="h3" align="center">
                    {t('oshaViolations.common.noDataFound', 'No data found')}
                  </Typography>
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
