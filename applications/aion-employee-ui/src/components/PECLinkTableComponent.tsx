import * as React from 'react';
import { createStyles, Grid, withStyles, WithStyles } from '@material-ui/core';
import { GridSize } from '@material-ui/core/Grid';
import { IPECEmployee } from 'interfaces/PECEmployee';
import { PagingControls } from '../components/pagingControls';
import { TableColumnHeader } from './TableColumnHeader';
import { TableRow } from './TableRow';
import { TFunction } from 'i18next';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { localizeDate } from '@pec/aion-ui-i18next/helpers/localize';

const getHeaders = (t: TFunction) => [
  {
    label: t('employee.common.firstName', 'First Name'),
    id: 'traineeFirstName',
    size: 2 as GridSize
  },
  {
    label: t('employee.common.lastName', 'Last Name'),
    id: 'traineeLastName',
    size: 2 as GridSize
  },
  {
    label: t('employee.common.dob', 'DOB'),
    id: 'traineeBirthDate',
    size: 3 as GridSize
  },
  {
    label: t('employee.common.id', 'ID'),
    id: 'traineePecIdentifier',
    isOrderable: false,
    size: 2 as GridSize
  }
];

type OwnProps = {
  data: IPECEmployee[];
  orderBy?: string | null;
  order: 'desc' | 'asc';
  handleSearch: (v: string) => void;
  search: string;
  handleSearchChange: (evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  sortClickHandler: (id: string) => () => void;
  count: number;
  handlePageChange: (_: React.MouseEvent<HTMLButtonElement, MouseEvent>, page: number) => void;
  pageNumber: number;
  itemSelected: string;
  handleRowAction: (e: IPECEmployee) => () => void;
};

type Props = OwnProps & WithStyles & I18nextProps;

const styles = createStyles({
  container: {
    marginLeft: '5px',
    display: 'flex',
    flexDirection: 'column'
  },
  tableFiller: {
    flexGrow: 1
  }
});

const PECLinkTableComponent = ({
  classes,
  data,
  orderBy,
  handleSearch,
  search,
  handleSearchChange,
  sortClickHandler,
  order,
  count,
  handlePageChange,
  pageNumber,
  handleRowAction,
  itemSelected,
  t
}: Props) => (
  <Grid item md={12} lg={12} className={classes.container}>
    <TableColumnHeader
      headers={getHeaders(t)}
      sortClickHandler={sortClickHandler}
      orderBy={orderBy}
      order={order}
      setSearch={handleSearch}
      tableName={t('employee.pecLink.OriginPec', '1. Origin: PEC')}
      searchValue={search}
      onSearchChange={handleSearchChange}
    />
    {data.map((row: IPECEmployee) => (
      <TableRow
        row={row}
        headers={getHeaders(t)}
        key={row.id}
        renderFunctions={{
          traineeBirthDate: (date: string) => localizeDate(date, t)
        }}
        rowAction={handleRowAction}
        selected={itemSelected === row.id}
      />
    ))}
    <PagingControls itemCount={count} handlePageChange={handlePageChange} currentPage={pageNumber} rowsPerPage={15} />
  </Grid>
);

export const PECLinkTable = withStyles(styles)(withTranslation()(PECLinkTableComponent));
