import { combineReducers } from 'redux';
import { commonRootReducer, CommonRootState } from '@pec/aion-ui-core/combineReducers';
import {
  reducer as taskGroupContractors,
  State as TaskGroupContractorsState
} from 'features/tasks/client/taskGroupContractors/reducer';
import {
  reducer as clientContractors,
  State as ClientContractorsState
} from 'features/tasks/client/contractors/reducer';
import { reducer as tags, State as TagsState } from 'features/tasks/client/taskGroup/tags/reducer';
import { reducer as assignee, State as AssigneeState } from 'features/tasks/assignee/reducer';
import { reducer as taskGroups, State as TaskGroupsState } from 'features/tasks/client/taskGroups/reducer';
import { reducer as contractorTasks, State as ContractorTasksState } from 'features/tasks/contractor/tasks/reducer';
import { reducer as clientTasks, State as ClientTasksState } from 'features/tasks/client/tasks/reducer';
import { reducer as taskGroup, State as TaskGroupState } from 'features/tasks/client/taskGroup/reducer';
import { reducer as contractors, State as ContractorsState } from 'features/tasks/client/taskGroup/contractors/reducer';
import {
  reducer as taskAssigneeDetails,
  State as TaskAssigneeDetailsState
} from 'features/tasks/taskThread/taskAssigneeDetails/reducer';
import { reducer as taskMessage, State as TaskMessageState } from 'features/tasks/taskThread/taskMessage/reducer';
import { reducer as taskMessages, State as TaskMessagesState } from 'features/tasks/taskThread/taskMessages/reducer';
import {
  reducer as contractorTags,
  State as ContractorTagsState
} from 'features/tasks/client/taskGroup/contractorTags/reducer';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

type AppRootState = {
  assignee: AssigneeState;
  clientContractors: ClientContractorsState;
  taskGroupContractors: TaskGroupContractorsState;
  taskGroups: TaskGroupsState;
  contractorTags: ContractorTagsState;
  clientTasks: ClientTasksState;
  contractorTasks: ContractorTasksState;
  contractors: ContractorsState;
  tags: TagsState;
  taskGroup: TaskGroupState;
  taskAssigneeDetails: TaskAssigneeDetailsState;
  taskMessage: TaskMessageState;
  taskMessages: TaskMessagesState;
};

export type RootState = AppRootState & CommonRootState;

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export const rootReducer = combineReducers<RootState>({
  ...commonRootReducer,
  assignee,
  clientContractors,
  clientTasks,
  taskGroupContractors,
  taskGroups,
  contractorTags,
  contractorTasks,
  contractors,
  tags,
  taskGroup,
  taskAssigneeDetails,
  taskMessage,
  taskMessages
});
