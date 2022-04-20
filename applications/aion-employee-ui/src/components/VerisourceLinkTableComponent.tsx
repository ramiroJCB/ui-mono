import * as React from 'react';
import Button from '@material-ui/core/Button';
import { Accordion, AccordionSummary, createStyles, Grid, withStyles, WithStyles } from '@material-ui/core';
import { GridSize } from '@material-ui/core/Grid';
import { IPECEmployee } from 'interfaces/PECEmployee';
import { IVerisourceEmployee } from 'interfaces/VerisourceEmployee';
import { NoMatches } from './verisourceNoResults';
import { PagingControls } from '../components/pagingControls';
import { TableColumnHeader } from './TableColumnHeader';
import { TableRow } from './TableRow';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { TFunction } from 'i18next';
import { localizeDate } from '@pec/aion-ui-i18next/helpers/localize';

const renderLinkButton = (
  action: (PECId: string, verisourceEmployee: IVerisourceEmployee) => () => void,
  PECId: string,
  t: TFunction
) => (_: string, verisourceEmployee: IVerisourceEmployee, mouseOver: boolean) => (
  <Button
    color="primary"
    variant={mouseOver ? 'contained' : 'text'}
    style={{ padding: 0 }}
    onClick={action(PECId, verisourceEmployee)}
  >
    {t('employee.common.link', 'Link')}
  </Button>
);

type Row = IPECEmployee | IVerisourceEmployee;

const getHeaders = (t: TFunction) => [
  {
    label: '',
    id: 'link',
    isOrderable: false,
    size: 1 as GridSize
  },
  {
    label: t('employee.common.firstName', 'First Name'),
    id: 'firstName',
    size: 2 as GridSize
  },
  {
    label: t('employee.common.lastName', 'Last Name'),
    id: 'lastName',
    size: 2 as GridSize
  },
  {
    label: t('employee.common.dob', 'DOB'),
    id: 'birthDate',
    size: 3 as GridSize
  },
  {
    label: t('employee.common.id', 'ID'),
    id: 'oqsgId',
    isOrderable: false,
    size: 2 as GridSize
  }
];

type OwnProps = {
  data: Row[];
  orderBy?: string | null;
  order: 'desc' | 'asc';
  handleSearch: (v: string) => void;
  search: string;
  handleSearchChange: (evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  sortClickHandler: (id: string) => () => void;
  selectedPECEmployee?: IPECEmployee;
  count: number;
  handlePageChange: (_: React.MouseEvent<HTMLButtonElement, MouseEvent>, page: number) => void;
  pageNumber: number;
  linkEmployees: (PECId: string, verisourceEmployee: IVerisourceEmployee) => () => void;
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

const VerisourceLinkTableComponent = ({
  classes,
  data,
  orderBy,
  handleSearch,
  search,
  handleSearchChange,
  sortClickHandler,
  order,
  selectedPECEmployee,
  count,
  handlePageChange,
  pageNumber,
  linkEmployees,
  t
}: Props) => (
  <Grid item md={12} lg={12} className={classes.container}>
    <TableColumnHeader
      headers={data.length > 0 ? getHeaders(t) : []}
      sortClickHandler={sortClickHandler}
      orderBy={orderBy}
      order={order}
      setSearch={handleSearch}
      tableName={t('employee.verisourceLink.originVeriSource', '2. Origin: VeriSource')}
      searchValue={search}
      onSearchChange={handleSearchChange}
    />
    {data.map((row: Row) => (
      <TableRow
        row={row}
        headers={getHeaders(t)}
        key={row.id}
        renderFunctions={{
          birthDate: (date: string) => localizeDate(date, t),
          link: renderLinkButton(linkEmployees, selectedPECEmployee ? selectedPECEmployee.id : '', t)
        }}
      />
    ))}
    <Accordion className={classes.tableFiller} expanded={false}>
      <AccordionSummary>{!data.length && <NoMatches employee={selectedPECEmployee} />}</AccordionSummary>
    </Accordion>
    <PagingControls itemCount={count} handlePageChange={handlePageChange} currentPage={pageNumber} rowsPerPage={15} />
  </Grid>
);

export const VerisourceLinkTable = withStyles(styles)(withTranslation()(VerisourceLinkTableComponent));
