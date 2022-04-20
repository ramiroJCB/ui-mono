import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IClientContractorsTableOption } from 'interfaces/clientContractorsTableOption';
import { ITableFilter } from '@pec/aion-ui-components/interfaces/tableFilter';
import { ITableHeader } from '@pec/aion-ui-components/interfaces/tableHeader';
import { Table } from '@pec/aion-ui-components/components/Table/Table';

type Props = {
  filters: ITableFilter[];
  headers: ITableHeader[];
  options: IClientContractorsTableOption[];
  handleFilterChange: (property: string, value: string) => void;
  handlePageChange: (pageNumber: number) => void;
  totalOptionsCount: number;
  pageSize: number;
  page: number;
  isFetchingData: boolean;
  handleSortChange: (property: string, order: string) => void;
  handleRowSelect: (option: IClientContractorsTableOption) => void;
  order: 'asc' | 'desc';
  orderBy: string;
};

export const ClientContractorsTableComponent: React.FC<Props> = ({
  filters,
  options,
  isFetchingData,
  headers,
  handleFilterChange,
  handlePageChange,
  handleRowSelect,
  handleSortChange,
  order,
  orderBy,
  page,
  pageSize,
  totalOptionsCount
}) => (
  <GridContainer>
    <Grid item xs={12}>
      <Table
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
