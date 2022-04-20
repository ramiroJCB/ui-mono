import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IClientContractorTasksTableOption } from 'interfaces/clientContractorTasksTableOption';
import { ITableFilter } from '@pec/aion-ui-components/interfaces/tableFilter';
import { ITableHeader } from '@pec/aion-ui-components/interfaces/tableHeader';
import { Table } from '@pec/aion-ui-components/components/Table/Table';

type Props = {
  filters: ITableFilter[];
  headers: ITableHeader[];
  order: 'asc' | 'desc';
  orderBy: string;
  options: IClientContractorTasksTableOption[];
  handleFilterChange: (property: string, value: string) => void;
  handlePageChange: (pageNumber: number) => void;
  totalOptionsCount: number;
  pageSize: number;
  page: number;
  isFetchingData: boolean;
  handleSortChange: (property: string, order: string) => void;
  handleRowSelect: (option: IClientContractorTasksTableOption) => void;
};

export const TaskGroupContractorsTableComponent: React.FC<Props> = ({
  filters,
  handleFilterChange,
  options,
  isFetchingData,
  headers,
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
        order={order}
        orderBy={orderBy}
        isFetchingOptions={isFetchingData}
        handleSort={handleSortChange}
        handleRowSelect={handleRowSelect}
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
