import * as React from 'react';
import AttachmentIcon from '@material-ui/icons/Attachment';
import { getImpliedIconStatus } from 'helpers/status';
import { IconTooltip } from '@pec/aion-ui-components/components/IconTooltip';
import { ITableHeader } from '@pec/aion-ui-components/interfaces/tableHeader';
import { ITaskAssignee } from 'interfaces/taskAssignee';
import { ITaskGroupContractorsTableOption } from 'interfaces/taskGroupContractorsTableOption';
import { TableFilterType } from '@pec/aion-ui-components/interfaces/tableFilter';
import { TaskGroupContractorsTableComponent } from '../components/TaskGroupContractorsTable';
import { TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';
import { TaskStatusIcon } from 'components/TaskStatusIcon';
import { withEnhancedRouter, WithEnhancedRouterProps } from '@pec/aion-ui-core/hocs/withEnhancedRouter';

const { AwaitingAction, Complete, Incomplete } = TaskStatus;
const { SelectFilter, TextFilter } = TableFilterType;

type OwnProps = {
  taskGroupContractors: ITaskAssignee[];
  isFetching: boolean;
  totalTaskGroupContractorsCount: number;
  handleRowSelect: (option: ITaskGroupContractorsTableOption) => void;
};

type Props = OwnProps & WithEnhancedRouterProps;

export const defaultPageSize: number = 10;
export const defaultPage: number = 1;
export const defaultOrder: 'asc' | 'desc' = 'asc';
export const defaultOrderBy: string = 'assigneeName';

class TaskGroupsTableContainer extends React.Component<Props> {
  headers: ITableHeader[] = [
    { id: 'status', label: 'Status', columnWidth: '20%', isSortable: true },
    { id: 'attachments', columnWidth: '5%' },
    { id: 'assigneeName', label: 'Contractor', isSortable: true }
  ];

  mapTaskGroupContractors = (taskGroupContractors: ITaskAssignee[]) =>
    taskGroupContractors.map(({ taskId, assigneeId, assigneeName, hasAttachments, status }) => {
      return {
        id: assigneeId,
        taskId,
        status: <TaskStatusIcon status={getImpliedIconStatus(false, status)} tooltipPlacement="right" />,
        attachments: hasAttachments ? (
          <IconTooltip title="Has Attachments" icon={<AttachmentIcon color="disabled" />} />
        ) : (
          undefined
        ),
        assigneeName
      };
    });

  render() {
    const {
      taskGroupContractors,
      isFetching,
      totalTaskGroupContractorsCount,
      handlePageChange,
      handleQueryParamChange,
      handleRowSelect,
      handleSortChange,
      search: { assigneeName, order, orderBy, page, pageSize, status }
    } = this.props;

    return (
      <TaskGroupContractorsTableComponent
        headers={this.headers}
        options={this.mapTaskGroupContractors(taskGroupContractors)}
        handlePageChange={handlePageChange}
        page={page ? Number(page) : defaultPage}
        pageSize={pageSize ? Number(pageSize) : defaultPageSize}
        isFetchingData={isFetching}
        totalOptionsCount={totalTaskGroupContractorsCount}
        handleSortChange={handleSortChange}
        handleFilterChange={handleQueryParamChange}
        handleRowSelect={handleRowSelect}
        order={(order as 'asc' | 'desc') || defaultOrder}
        orderBy={(orderBy as string) || defaultOrderBy}
        filters={[
          {
            id: 'status',
            initialValue: (status as string) || '',
            type: SelectFilter,
            options: [
              { id: Incomplete, label: 'Incomplete' },
              { id: AwaitingAction, label: 'Awaiting Action' },
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

export const TaskGroupContractorsTable = withEnhancedRouter(TaskGroupsTableContainer);
