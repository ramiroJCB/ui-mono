import * as React from 'react';
import AttachmentIcon from '@material-ui/icons/Attachment';
import { formatDate } from '@pec/aion-ui-core/components/LocalizedDate';
import { getImpliedIconStatus } from 'helpers/status';
import { IClientContractorTasksTableOption } from 'interfaces/clientContractorTasksTableOption';
import { IconTooltip } from '@pec/aion-ui-components/components/IconTooltip';
import { ITableHeader } from '@pec/aion-ui-components/interfaces/tableHeader';
import { ITask } from '@pec/aion-ui-core/interfaces/task';
import { TableFilterType } from '@pec/aion-ui-components/interfaces/tableFilter';
import { TaskGroupContractorsTableComponent } from '../components/ClientContractorTasksTable';
import { TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';
import { TaskStatusIcon } from 'components/TaskStatusIcon';
import { withEnhancedRouter, WithEnhancedRouterProps } from '@pec/aion-ui-core/hocs/withEnhancedRouter';

const { AwaitingAction, Complete, Incomplete } = TaskStatus;
const { DateFilter, SelectFilter, TextFilter } = TableFilterType;

type OwnProps = {
  contractorTasks: ITask[];
  isFetching: boolean;
  totalContractorTasksCount: number;
  handleRowSelect: (option: IClientContractorTasksTableOption) => void;
};

type Props = OwnProps & WithEnhancedRouterProps;

export const defaultPageSize: number = 10;
export const defaultPage: number = 1;

class ClientContractorTasksTableContainer extends React.Component<Props> {
  headers: ITableHeader[] = [
    { id: 'status', label: 'Status', columnWidth: '5%', isSortable: true },
    { id: 'attachments', label: '', columnWidth: '5%' },
    { id: 'taskGroupSubject', label: 'Title', columnWidth: '40%' },
    { id: 'assignmentDate', label: 'Assignment Date', isSortable: true },
    { id: 'dueDate', label: 'Due Date', isSortable: true }
  ];

  mapContractorTasks = (contractorTasks: ITask[]) =>
    contractorTasks.map(
      ({ id, createdDateUtc, dueDateUtc, taskGroupId, taskGroupSubject, hasAttachments, status }) => ({
        id,
        taskGroupId,
        taskGroupSubject,
        status: <TaskStatusIcon status={getImpliedIconStatus(false, status)} tooltipPlacement="right" />,
        assignmentDate: formatDate(createdDateUtc),
        dueDate: formatDate(dueDateUtc),
        attachments: hasAttachments ? (
          <IconTooltip title="Has Attachments" icon={<AttachmentIcon color="disabled" />} />
        ) : (
          undefined
        )
      })
    );

  render() {
    const {
      contractorTasks,
      isFetching,
      totalContractorTasksCount,
      handlePageChange,
      handleQueryParamChange,
      handleRowSelect,
      handleSortChange,
      search: { dueDate, order, orderBy, page, pageSize, status, taskGroupSubject }
    } = this.props;

    return (
      <TaskGroupContractorsTableComponent
        headers={this.headers}
        options={this.mapContractorTasks(contractorTasks)}
        handlePageChange={handlePageChange}
        order={(order as 'asc' | 'desc') || 'asc'}
        orderBy={(orderBy as string) || ''}
        page={page ? Number(page) : defaultPage}
        pageSize={pageSize ? Number(pageSize) : defaultPageSize}
        isFetchingData={isFetching}
        totalOptionsCount={totalContractorTasksCount}
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
            id: 'taskGroupSubject',
            initialValue: (taskGroupSubject as string) || '',
            type: TextFilter
          },
          {
            id: 'dueDate',
            initialValue: (dueDate as string) || '',
            type: DateFilter
          }
        ]}
      />
    );
  }
}

export const ClientContractorTasksTable = withEnhancedRouter(ClientContractorTasksTableContainer);
