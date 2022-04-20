import * as React from 'react';
import AttachmentIcon from '@material-ui/icons/Attachment';
import { ClientTasksTableComponent } from '../components/ClientTasksTable';
import { formatDate } from '@pec/aion-ui-core/components/LocalizedDate';
import { getImpliedIconStatus } from 'helpers/status';
import { IClientTaskTableOption } from 'interfaces/clientTaskTableOption';
import { IconTooltip } from '@pec/aion-ui-components/components/IconTooltip';
import { ITableHeader } from '@pec/aion-ui-components/interfaces/tableHeader';
import { ITask } from '@pec/aion-ui-core/interfaces/task';
import { TableFilterType } from '@pec/aion-ui-components/interfaces/tableFilter';
import { TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';
import { TaskStatusIcon } from 'components/TaskStatusIcon';
import { withEnhancedRouter, WithEnhancedRouterProps } from '@pec/aion-ui-core/hocs/withEnhancedRouter';

const { AssigneeReplied, Complete, Incomplete, OwnerReplied, Submitted } = TaskStatus;
const { DateFilter, NumberFilter, SelectFilter, TextFilter } = TableFilterType;

type OwnProps = {
  clientTasks: ITask[];
  isFetching: boolean;
  totalClientTasksCount: number;
  handleRowSelect: (option: IClientTaskTableOption) => void;
};

type Props = OwnProps & WithEnhancedRouterProps;

export const defaultPageSize: number = 10;
export const defaultPage: number = 1;

class ClientTasksTableContainer extends React.Component<Props> {
  headers: ITableHeader[] = [
    { id: 'status', label: 'Status', columnWidth: '15%', isSortable: true },
    { id: 'taskNumber', label: 'Task Number', isSortable: true },
    { id: 'attachments', columnWidth: '5%' },
    { id: 'taskGroupSubject', label: 'Title', isSortable: true },
    { id: 'createdDateUtc', label: 'Assigned' },
    { id: 'dueDateUtc', label: 'Due Date', isSortable: true },
    { id: 'contractorName', label: 'Contractor', isSortable: true }
  ];

  mapClientTasks = (clientTasks: ITask[]) =>
    clientTasks.map(
      ({ id, status, hasAttachments, taskGroupSubject, dueDateUtc, contractorName, createdDateUtc, taskNumber }) => {
        return {
          id,
          status: <TaskStatusIcon status={getImpliedIconStatus(false, status)} tooltipPlacement="right" />,
          taskNumber,
          attachments: hasAttachments ? (
            <IconTooltip title="Has Attachments" icon={<AttachmentIcon color="disabled" />} />
          ) : (
            undefined
          ),
          taskGroupSubject,
          createdDateUtc: formatDate(createdDateUtc),
          dueDateUtc: formatDate(dueDateUtc),
          contractorName
        };
      }
    );

  render() {
    const {
      clientTasks,
      isFetching,
      totalClientTasksCount,
      handlePageChange,
      handleQueryParamChange,
      handleRowSelect,
      handleSortChange,
      search: { contractorName, dueDateUtc, order, orderBy, page, pageSize, status, taskGroupSubject, taskNumber }
    } = this.props;

    return (
      <ClientTasksTableComponent
        headers={this.headers}
        options={this.mapClientTasks(clientTasks)}
        handlePageChange={handlePageChange}
        order={(order as 'asc' | 'desc') || 'asc'}
        orderBy={(orderBy as string) || ''}
        page={page ? Number(page) : defaultPage}
        pageSize={pageSize ? Number(pageSize) : defaultPageSize}
        isFetchingData={isFetching}
        totalOptionsCount={totalClientTasksCount}
        handleFilterChange={handleQueryParamChange}
        handleSortChange={handleSortChange}
        handleRowSelect={handleRowSelect}
        filters={[
          {
            id: 'status',
            initialValue: (status as string) || '',
            type: SelectFilter,
            options: [
              { id: AssigneeReplied, label: 'Assignee Replied' },
              { id: Complete, label: 'Complete' },
              { id: Incomplete, label: 'Incomplete' },
              { id: OwnerReplied, label: 'Owner Replied' },
              { id: Submitted, label: 'Submitted' }
            ]
          },
          {
            id: 'taskNumber',
            initialValue: (taskNumber as string) || '',
            type: NumberFilter
          },
          {
            id: 'taskGroupSubject',
            initialValue: (taskGroupSubject as string) || '',
            type: TextFilter
          },
          {
            id: 'dueDateUtc',
            initialValue: (dueDateUtc as string) || '',
            type: DateFilter
          },
          {
            id: 'contractorName',
            initialValue: (contractorName as string) || '',
            type: TextFilter
          }
        ]}
      />
    );
  }
}

export const ClientTasksTable = withEnhancedRouter(ClientTasksTableContainer);
