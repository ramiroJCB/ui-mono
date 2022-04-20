import { Actions as TagsActions } from 'features/tasks/client/taskGroup/tags/actions';
import { Actions as ContractorTasksActions } from 'features/tasks/contractor/tasks/actions';
import { Actions as ClientTasksActions } from 'features/tasks/client/tasks/actions';
import { Actions as FetchTaskMessagesActions } from 'features/tasks/taskThread/taskMessages/actions/fetchTaskMessages';
import { Actions as ContractorsActions } from 'features/tasks/client/taskGroup/contractors/actions';
import { Actions as TaskGroupContractorsActions } from 'features/tasks/client/taskGroupContractors/actions';
import { Actions as TaskGroupsActions } from 'features/tasks/client/taskGroups/actions';
import { Actions as TaskAssigneeDetailsActions } from 'features/tasks/taskThread/taskAssigneeDetails/actions/fetchTaskAssigneeDetails';
import { Actions as ClientContractorsActions } from 'features/tasks/client/contractors/actions';
import { Actions as FetchTaskActions } from 'features/tasks/client/taskGroup/actions/fetchTaskGroup';
import { Actions as AddTaskActions } from 'features/tasks/client/taskGroup/actions/addTaskGroup';
import { Actions as TaskMessageActions } from 'features/tasks/taskThread/taskMessage/actions/addMessage';
import { Actions as ContractorTagsActions } from 'features/tasks/client/taskGroup/contractorTags/actions';
import { Actions as AssigneeActions } from 'features/tasks/assignee/actions';
import { RootActions as CommonRootActions } from '@pec/aion-ui-core/combineActions';

export type RootActions =
  | AddTaskActions
  | AssigneeActions
  | CommonRootActions
  | ClientContractorsActions
  | ClientTasksActions
  | TaskGroupContractorsActions
  | TaskGroupsActions
  | ContractorTagsActions
  | ContractorTasksActions
  | ContractorsActions
  | FetchTaskActions
  | TagsActions
  | TaskAssigneeDetailsActions
  | TaskMessageActions
  | FetchTaskMessagesActions;
