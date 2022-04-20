import * as React from 'react';
import AttachmentIcon from '@material-ui/icons/Attachment';
import { AssigneeGroupType } from '@pec/aion-ui-core/interfaces/assigneeGroup';
import { formatDate } from '@pec/aion-ui-core/components/LocalizedDate';
import { IconTooltip } from '@pec/aion-ui-components/components/IconTooltip';
import { ITableHeader } from '@pec/aion-ui-components/interfaces/tableHeader';
import { ITag } from 'interfaces/tag';
import { ITaskGroup } from '@pec/aion-ui-core/interfaces/taskGroup';
import { ITaskGroupTableOption } from 'interfaces/taskGroupTableOption';
import { TableFilterType } from '@pec/aion-ui-components/interfaces/tableFilter';
import { Tags } from 'components/Tags';
import { TaskGroupsTableComponent } from '../components/TaskGroupsTable';
import { TaskStatusIcon } from 'components/TaskStatusIcon';
import { withEnhancedRouter, WithEnhancedRouterProps } from '@pec/aion-ui-core/hocs/withEnhancedRouter';

const { DateFilter, TextFilter } = TableFilterType;

type OwnProps = {
  taskGroups: ITaskGroup[];
  isFetching: boolean;
  totalTaskGroupsCount: number;
  handleRowSelect: (option: ITaskGroupTableOption) => void;
};

type Props = OwnProps & WithEnhancedRouterProps;

export const defaultPageSize: number = 10;
export const defaultPage: number = 1;

class TaskGroupsTableContainer extends React.Component<Props> {
  headers: ITableHeader[] = [
    { id: 'status', label: 'Status', columnWidth: '5%', isSortable: true },
    { id: 'attachments', columnWidth: '5%' },
    { id: 'subject', label: 'Title', isSortable: true },
    { id: 'createdDateUtc', label: 'Assignment Date', isSortable: true },
    { id: 'dueDateUtc', label: 'Due Date', isSortable: true },
    { id: 'assigneeCount', label: 'Contractor Count' },
    { id: 'tags', label: 'Tags' }
  ];

  mapTaskGroups = (taskGroups: ITaskGroup[]) =>
    taskGroups.map(
      ({ assigneeGroups, attachments, createdDateUtc, dueDateUtc, id, meta: { assigneeCount }, status, subject }) => {
        const tags: ITag[] = assigneeGroups
          ? assigneeGroups
              .filter(({ type }) => type === AssigneeGroupType.Tag)
              .map(({ id, name }) => ({ id: id || '', name: name || '' }))
          : [];

        return {
          id,
          status: <TaskStatusIcon status={status} tooltipPlacement="right" />,
          subject,
          attachments:
            attachments.length > 0 ? (
              <IconTooltip title="Has Attachments" icon={<AttachmentIcon color="disabled" />} />
            ) : (
              undefined
            ),
          dueDateUtc: formatDate(dueDateUtc),
          createdDateUtc: formatDate(createdDateUtc),
          assigneeCount: `${assigneeCount} Contractors`,
          tags: <Tags tags={tags} maxVisibleTags={2} />
        };
      }
    );

  render() {
    const {
      taskGroups,
      isFetching,
      totalTaskGroupsCount,
      handlePageChange,
      handleQueryParamChange,
      handleRowSelect,
      handleSortChange,
      search: { dueDateUtc, order, orderBy, page, pageSize, subject }
    } = this.props;

    return (
      <TaskGroupsTableComponent
        headers={this.headers}
        options={this.mapTaskGroups(taskGroups)}
        handlePageChange={handlePageChange}
        order={(order as 'asc' | 'desc') || 'asc'}
        orderBy={(orderBy as string) || ''}
        page={page ? Number(page) : defaultPage}
        pageSize={pageSize ? Number(pageSize) : defaultPageSize}
        isFetchingData={isFetching}
        totalOptionsCount={totalTaskGroupsCount}
        handleFilterChange={handleQueryParamChange}
        handleSortChange={handleSortChange}
        handleRowSelect={handleRowSelect}
        filters={[
          {
            id: 'subject',
            initialValue: (subject as string) || '',
            type: TextFilter
          },
          {
            id: 'dueDateUtc',
            initialValue: (dueDateUtc as string) || '',
            type: DateFilter
          }
        ]}
      />
    );
  }
}

export const TaskGroupsTable = withEnhancedRouter(TaskGroupsTableContainer);
