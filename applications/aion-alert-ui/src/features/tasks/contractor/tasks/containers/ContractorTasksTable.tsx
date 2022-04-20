import * as React from 'react';
import AttachmentIcon from '@material-ui/icons/Attachment';
import ReactHtmlParser, { DomElement, domToReact } from 'html-react-parser';
import Typography from '@material-ui/core/Typography';
import { ContractorTasksTableComponent } from '../components/ContractorTasksTable';
import { formatDate } from '@pec/aion-ui-core/components/LocalizedDate';
import { getImpliedIconStatus } from 'helpers/status';
import { IconTooltip } from '@pec/aion-ui-components/components/IconTooltip';
import { IContractorTaskTableOption } from 'interfaces/contractorTaskTableOption';
import { ITableHeader } from '@pec/aion-ui-components/interfaces/tableHeader';
import { ITask } from '@pec/aion-ui-core/interfaces/task';
import { TableFilterType } from '@pec/aion-ui-components/interfaces/tableFilter';
import { TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';
import { TaskStatusIcon } from 'components/TaskStatusIcon';
import { withEnhancedRouter, WithEnhancedRouterProps } from '@pec/aion-ui-core/hocs/withEnhancedRouter';

const { AssigneeReplied, Complete, Incomplete, OwnerReplied, Submitted } = TaskStatus;
const { DateFilter, NumberFilter, SelectFilter, TextFilter } = TableFilterType;

type OwnProps = {
  contractorTasks: ITask[];
  isFetching: boolean;
  totalContractorTasksCount: number;
  handleRowSelect: (option: IContractorTaskTableOption) => void;
};

type Props = OwnProps & WithEnhancedRouterProps;

export const defaultPageSize: number = 10;
export const defaultPage: number = 1;

class ContractorTasksTableContainer extends React.Component<Props> {
  headers: ITableHeader[] = [
    { id: 'status', label: 'Status', columnWidth: '15%', isSortable: true },
    { id: 'taskNumber', label: 'Task Number', isSortable: true },
    { id: 'attachments', columnWidth: '5%' },
    { id: 'clientName', label: 'Client', isSortable: true },
    { id: 'taskGroupSubject', label: 'Title', isSortable: true },
    { id: 'taskGroupContent', label: 'Subject' },
    { id: 'dueDateUtc', label: 'Due Date', isSortable: true }
  ];

  formatContentText = (domNode: DomElement): React.ReactElement | object | undefined | false => {
    if (domNode.name === 'p') {
      return (
        <span>
          {domToReact(domNode.children || [], {
            replace: domNode => this.formatContentText(domNode)
          })}
        </span>
      );
    }

    if (domNode.name === 'ul' || domNode.name === 'ol' || domNode.name === 'li') {
      return React.createElement(
        domNode.name,
        { style: { display: 'inline-block', margin: 0, paddingInlineStart: domNode.name === 'li' ? 0 : 5 } },
        domToReact(domNode.children || [], {
          replace: domNode => this.formatContentText(domNode)
        })
      );
    }

    if (domNode.name === 'br') {
      return <React.Fragment />;
    }

    if (domNode.name === 'a') {
      return <u>{domToReact(domNode.children || [])}</u>;
    }

    return undefined;
  };

  mapContractorTasks = (contractorTasks: ITask[]) =>
    contractorTasks.map(
      ({ id, taskNumber, status, hasAttachments, taskGroupSubject, dueDateUtc, clientName, taskGroupContent }) => {
        return {
          id,
          status: <TaskStatusIcon status={getImpliedIconStatus(true, status)} tooltipPlacement="right" />,
          taskNumber,
          attachments: hasAttachments ? (
            <IconTooltip title="Has Attachments" icon={<AttachmentIcon color="disabled" />} />
          ) : (
            undefined
          ),
          clientName,
          taskGroupSubject,
          taskGroupContent: (
            <Typography variant="body2" component="div" noWrap>
              {ReactHtmlParser(taskGroupContent.substring(0, 100), {
                replace: domNode => this.formatContentText(domNode)
              })}
            </Typography>
          ),
          dueDateUtc: formatDate(dueDateUtc)
        };
      }
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
      search: { clientName, dueDateUtc, order, orderBy, page, pageSize, status, taskGroupSubject, taskNumber }
    } = this.props;

    return (
      <ContractorTasksTableComponent
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
            id: 'clientName',
            initialValue: (clientName as string) || '',
            type: TextFilter
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
          }
        ]}
      />
    );
  }
}

export const ContractorTasksTable = withEnhancedRouter(ContractorTasksTableContainer);
