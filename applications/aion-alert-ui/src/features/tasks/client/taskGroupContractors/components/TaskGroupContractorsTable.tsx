import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { ITableFilter } from '@pec/aion-ui-components/interfaces/tableFilter';
import { ITableHeader } from '@pec/aion-ui-components/interfaces/tableHeader';
import { ITaskGroupContractorsTableOption } from 'interfaces/taskGroupContractorsTableOption';
import { Table } from '@pec/aion-ui-components/components/Table/Table';

type Props = {
  headers: ITableHeader[];
  options: ITaskGroupContractorsTableOption[];
  handlePageChange: (pageNumber: number) => void;
  totalOptionsCount: number;
  pageSize: number;
  page: number;
  isFetchingData: boolean;
  handleSortChange: (property: string, order: string) => void;
  handleRowSelect: (option: ITaskGroupContractorsTableOption) => void;
  filters: ITableFilter[];
  handleFilterChange: (property: string, value: string) => void;
  order: 'asc' | 'desc';
  orderBy: string;
};

export const TaskGroupContractorsTableComponent: React.FC<Props> = ({
  filters,
  isFetchingData,
  headers,
  handleFilterChange,
  handlePageChange,
  handleRowSelect,
  handleSortChange,
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
