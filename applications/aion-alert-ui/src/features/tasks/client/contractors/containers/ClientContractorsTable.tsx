import * as React from 'react';
import { ClientContractorsTableComponent } from '../components/ClientContractorsTable';
import { IAssignee } from 'interfaces/assignee';
import { IClientContractorsTableOption } from 'interfaces/clientContractorsTableOption';
import { ITableHeader } from '@pec/aion-ui-components/interfaces/tableHeader';
import { TableFilterType } from '@pec/aion-ui-components/interfaces/tableFilter';
import { TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';
import { TaskStatusIcon } from 'components/TaskStatusIcon';
import { withEnhancedRouter, WithEnhancedRouterProps } from '@pec/aion-ui-core/hocs/withEnhancedRouter';

const { AwaitingAction, Complete, Incomplete } = TaskStatus;
const { SelectFilter, TextFilter } = TableFilterType;

type OwnProps = {
  contractors: IAssignee[];
  isFetching: boolean;
  totalClientContractorsCount: number;
  handleRowSelect: (option: IClientContractorsTableOption) => void;
};

type Props = OwnProps & WithEnhancedRouterProps;

export const defaultPageSize: number = 10;
export const defaultPage: number = 1;

class ClientContractorsTableContainer extends React.Component<Props> {
  headers: ITableHeader[] = [
    { id: 'status', label: 'Status', columnWidth: '10%', isSortable: true },
    { id: 'openTasksCount', label: 'Open Tasks', columnWidth: '15%' },
    { id: 'assigneeName', label: 'Contractor', isSortable: true }
  ];

  mapClientContractors = (contractors: IAssignee[]) =>
    contractors.map(
      ({
        assigneeId,
        assigneeName,
        status,
        assigneeRepliedCount,
        ownerRepliedCount,
        submittedCount,
        incompleteCount
      }) => {
        const openTasksCount = assigneeRepliedCount + ownerRepliedCount + submittedCount + incompleteCount;

        return {
          id: assigneeId,
          status: <TaskStatusIcon status={status} tooltipPlacement="right" />,
          assigneeName,
          openTasksCount: `${openTasksCount} Tasks`
        };
      }
    );

  render() {
    const {
      contractors,
      isFetching,
      totalClientContractorsCount,
      handlePageChange,
      handleQueryParamChange,
      handleRowSelect,
      handleSortChange,
      search: { assigneeName, order, orderBy, page, pageSize, status }
    } = this.props;

    return (
      <ClientContractorsTableComponent
        headers={this.headers}
        options={this.mapClientContractors(contractors)}
        order={(order as 'asc' | 'desc') || 'asc'}
        orderBy={(orderBy as string) || ''}
        handlePageChange={handlePageChange}
        page={page ? Number(page) : defaultPage}
        pageSize={pageSize ? Number(pageSize) : defaultPageSize}
        isFetchingData={isFetching}
        totalOptionsCount={totalClientContractorsCount}
        handleFilterChange={handleQueryParamChange}
        handleSortChange={handleSortChange}
        handleRowSelect={handleRowSelect}
        filters={[
          {
            id: 'status',
            initialValue: (status as string) || '',
            type: SelectFilter,
            options: [
              { id: AwaitingAction, label: 'Awaiting Action' },
              { id: Incomplete, label: 'Incomplete' },
              { id: Complete, label: 'Complete' }
            ]
          },
          {
            id: 'assigneeName',
            initialValue: (assigneeName as string) || '',
            type: TextFilter
          }
        ]}
      />
    );
  }
}

export const ClientContractorsTable = withEnhancedRouter(ClientContractorsTableContainer);
