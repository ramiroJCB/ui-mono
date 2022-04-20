import * as React from 'react';
import {
  Accordion,
  AccordionSummary,
  Button,
  createStyles,
  Grid,
  Typography,
  withStyles,
  WithStyles
} from '@material-ui/core';
import { GridSize } from '@material-ui/core/Grid';
import { IAllEmployeesRow } from 'reducers/allEmployeesTable';
import { IPECEmployee } from 'interfaces/PECEmployee';
import { IVerisourceEmployee } from 'interfaces/VerisourceEmployee';
import { PagingControls } from '../components/pagingControls';
import { TableColumnHeader } from './TableColumnHeader';
import { TableRow } from './TableRow';
import { UnlinkingDialogComponent } from './unlinkDialog';
import { TFunction } from 'i18next';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { localizeDate } from '@pec/aion-ui-i18next/helpers/localize';

const renderUnlinkButton = (action: (PECId: string) => () => void, t: TFunction) => (
  _: string,
  { pecEmployeeId }: IVerisourceEmployee
) => (
  <Button color="primary" style={{ padding: 0 }} onClick={action(pecEmployeeId || '')}>
    {t('employee.allEmployeesTable.unlink', 'UNLINK')}
  </Button>
);

type Row = IPECEmployee | IVerisourceEmployee;

const getHeaders = (t: TFunction) => [
  {
    label: t('employee.common.firstName', 'First Name'),
    id: 'traineeFirstName',
    expandedId: 'firstName',
    size: 2 as GridSize
  },
  {
    label: t('employee.common.lastName', 'Last Name'),
    id: 'traineeLastName',
    expandedId: 'lastName',
    size: 2 as GridSize
  },
  {
    label: t('employee.common.dob', 'DOB'),
    id: 'traineeBirthDate',
    expandedId: 'birthDate',
    size: 2 as GridSize
  },
  {
    label: t('employee.common.id', 'ID'),
    id: 'traineePecIdentifier',
    expandedId: 'oqsgId',
    isOrderable: false,
    size: 2 as GridSize
  },
  {
    label: t('employee.common.origin', 'Origin'),
    id: 'origin',
    isOrderable: false,
    size: 2 as GridSize
  },
  {
    label: t('employee.common.links', 'Links'),
    id: 'action',
    expandedId: 'unlink',
    isOrderable: false,
    size: 1 as GridSize,
    rtl: true
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
  count: number;
  handlePageChange: (_: React.MouseEvent<HTMLButtonElement, MouseEvent>, page: number) => void;
  pageNumber: number;
  expandedRows: string[];
  toggleExpandedRow: (employee: IPECEmployee) => () => void;
  rowsData: {
    [pecId: string]: IAllEmployeesRow;
  };
  unlinkingHandler: (id: string) => () => void;
  PECId: string;
  isModalOpen: boolean;
  cancelLinking: () => void;
  requestLinking: () => void;
  isFetching: boolean;
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

const AllEmployeesLinkTableComponent = ({
  classes,
  data,
  orderBy,
  handleSearch,
  search,
  handleSearchChange,
  sortClickHandler,
  order,
  count,
  expandedRows,
  handlePageChange,
  toggleExpandedRow,
  pageNumber,
  rowsData,
  unlinkingHandler,
  PECId,
  isModalOpen,
  cancelLinking,
  requestLinking,
  isFetching,
  t
}: Props) => (
  <Grid item md={12} lg={12} className={classes.container}>
    {PECId && isModalOpen && (
      <UnlinkingDialogComponent
        isModalOpen={isModalOpen}
        cancelLinking={cancelLinking}
        requestLinking={requestLinking}
        isFetching={isFetching}
      />
    )}
    <TableColumnHeader
      headers={getHeaders(t)}
      sortClickHandler={sortClickHandler}
      orderBy={orderBy}
      order={order}
      setSearch={handleSearch}
      tableName={t('employee.allEmployeesTable.allLinkedEmployees', 'All Linked Employees')}
      searchValue={search}
      onSearchChange={handleSearchChange}
    />
    {data.map((row: Row) => (
      <TableRow
        row={row}
        headers={getHeaders(t)}
        key={row.id}
        expanded={expandedRows.includes(row.id)}
        toggleExpandedRow={toggleExpandedRow}
        detailData={rowsData[row.id]}
        renderFunctions={{
          traineeBirthDate: (date: string) => localizeDate(date, t),
          unlink: renderUnlinkButton(unlinkingHandler, t),
          birthDate: (date: string) => localizeDate(date, t)
        }}
      />
    ))}
    <Accordion className={classes.tableFiller} expanded={false}>
      <AccordionSummary>
        {!data.length && (
          <Typography>
            {t('employee.allEmployeesTable.noLinkedEmployeesFound', 'No linked employees found.')}
          </Typography>
        )}
      </AccordionSummary>
    </Accordion>
    <PagingControls itemCount={count} handlePageChange={handlePageChange} currentPage={pageNumber} rowsPerPage={15} />
  </Grid>
);

export const AllEmployeesLinkTable = withStyles(styles)(withTranslation()(AllEmployeesLinkTableComponent));
