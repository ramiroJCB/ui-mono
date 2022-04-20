import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IClientTaskTableOption } from 'interfaces/clientTaskTableOption';
import { ITableFilter } from '@pec/aion-ui-components/interfaces/tableFilter';
import { ITableHeader } from '@pec/aion-ui-components/interfaces/tableHeader';
import { Table } from '@pec/aion-ui-components/components/Table/Table';

type Props = {
  filters: ITableFilter[];
  handleFilterChange: (property: string, value: string) => void;
  handlePageChange: (pageNumber: number) => void;
  handleRowSelect: (option: IClientTaskTableOption) => void;
  handleSortChange: (property: string, order: string) => void;
  headers: ITableHeader[];
  isFetchingData: boolean;
  options: IClientTaskTableOption[];
  order: 'asc' | 'desc';
  orderBy: string;
  page: number;
  pageSize: number;
  totalOptionsCount: number;
};

export const ClientTasksTableComponent: React.FC<Props> = ({
  filters,
  handleFilterChange,
  handlePageChange,
  handleRowSelect,
  handleSortChange,
  headers,
  isFetchingData,
  options,
  order,
  orderBy,
  page,
  pageSize,
  totalOptionsCount
}) => (
  <GridContainer>
    <Grid item xs={12}>
      <Table
        fixed
        headers={headers}
        options={options}
        isFetchingOptions={isFetchingData}
        handleSort={handleSortChange}
        handleRowSelect={handleRowSelect}
        order={order}
        orderBy={orderBy}
        pagingProps={{
          currentPage: page - 1,
          pageSize,
          onPageChange: handlePageChange,
          totalOptionsCount
        }}
        filterProps={{
          onFilterChange: handleFilterChange,
          filters
        }}
      />
    </Grid>
  </GridContainer>
);
