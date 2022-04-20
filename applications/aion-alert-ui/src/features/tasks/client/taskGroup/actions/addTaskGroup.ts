import axios, { AxiosError } from 'axios';
import sanitizeHtml from 'sanitize-html';
import { AssigneeGroupType } from '@pec/aion-ui-core/interfaces/assigneeGroup';
import { History } from 'history';
import { IAddTaskGroupForm } from 'interfaces/taskGroupForm';
import { ITaskGroup } from '@pec/aion-ui-core/interfaces/taskGroup';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const addTaskGroupRequest = () =>
  ({
    type: 'ADD_TASK_GROUP_REQUEST'
  } as const);

const addTaskGroupSuccess = () =>
  ({
    type: 'ADD_TASK_GROUP_SUCCESS'
  } as const);

const addTaskGroupFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_TASK_GROUP_FAILURE',
    error
  } as const;
};

export const addTaskGroup = (
  taskGroupForm: IAddTaskGroupForm,
  organizationId: string,
  history: History
): ThunkAction<Promise<ITaskGroup>, RootState, null, Actions> => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(addTaskGroupRequest());

      const { Organization, Tag, AllReleasedContractors } = AssigneeGroupType;
      const { content, contractors, tags, ignoredAssigneeGroups, confirmContractorsByTags, ...rest } = taskGroupForm;
      const taskGroup: Partial<ITaskGroup> = {
        assigneeGroups: contractors
          .map(({ id: typeId, name }) =>
            typeId === AllReleasedContractors
              ? { typeId: null, type: AllReleasedContractors }
              : { name, typeId, type: Organization }
          )
          .concat(tags.map(({ id: typeId, name }) => ({ name, typeId, type: Tag }))),
        ignoredAssigneeGroups: ignoredAssigneeGroups.map(typeId => ({ typeId, type: Organization })),
        content: sanitizeHtml(content),
        ...rest
      };
      const {
        data: { id }
      } = await axios.post<ITaskGroup>('/api/v3.01/taskGroups', taskGroup);

      dispatch(addTaskGroupSuccess());
      resolve();

      history.push(`/${organizationId}/alerts/taskGroups/${id}`);
    } catch (error) {
      dispatch(addTaskGroupFailure(error));
      reject();
    }
  });
};

export type Actions =
  | ReturnType<typeof addTaskGroupRequest>
  | ReturnType<typeof addTaskGroupSuccess>
  | ReturnType<typeof addTaskGroupFailure>;
