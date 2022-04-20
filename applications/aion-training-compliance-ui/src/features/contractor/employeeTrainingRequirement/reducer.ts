import { Actions as FetchEmployeeTrainingRequirementActions } from './actions/fetchEmployeeTrainingRequirement';
import { Actions as AddEmployeeTrainingRequirementDocumentActions } from './actions/addEmployeeTrainingRequirementDocument';
import { Actions as EditEmployeeTrainingRequirementActions } from './actions/editEmployeeTrainingRequirement';
import { Actions as DownloadEmployeeTrainingRequirementDocumentActions } from './actions/downloadEmployeeTrainingRequirementDocument';
import { Actions as DeleteEmployeeTrainingRequirementDocumentActions } from './actions/deleteEmployeeTrainingRequirementDocument';
import { AttachmentStatus } from '@pec/aion-ui-core/interfaces/attachmentStatus';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IDocumentWithStatus } from 'interfaces/documentWithStatus';
import { IEmployeeTrainingRequirement } from 'interfaces/employeeTrainingRequirement';
import i18next from 'i18next';

const { Downloading, Failed, Uploading, Uploaded } = AttachmentStatus;

export type State = DeepReadonly<{
  isFetching: boolean;
  employeeTrainingRequirement: IEmployeeTrainingRequirement | null;
  error: AxiosError | null;
  pendingDocuments: IDocumentWithStatus[];
}>;

type Actions =
  | FetchEmployeeTrainingRequirementActions
  | AddEmployeeTrainingRequirementDocumentActions
  | DeleteEmployeeTrainingRequirementDocumentActions
  | DownloadEmployeeTrainingRequirementDocumentActions
  | EditEmployeeTrainingRequirementActions;

export const initialState: State = {
  isFetching: false,
  employeeTrainingRequirement: null,
  error: null,
  pendingDocuments: []
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_EMPLOYEE_TRAINING_REQUIREMENT_REQUEST':
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case 'FETCH_EMPLOYEE_TRAINING_REQUIREMENT_SUCCESS':
      return {
        isFetching: false,
        employeeTrainingRequirement: {
          ...action.payload,
          metaData: action.payload.metaData.map(document => ({
            ...document,
            status: Uploaded
          }))
        },
        pendingDocuments: [],
        error: null
      };
    case 'EDIT_EMPLOYEE_TRAINING_REQUIREMENT_SUCCESS':
      return {
        ...state,
        isFetching: false,
        employeeTrainingRequirement: state.employeeTrainingRequirement && {
          ...state.employeeTrainingRequirement,
          ...action.payload
        },
        error: null
      };
    case 'FETCH_EMPLOYEE_TRAINING_REQUIREMENT_FAILURE':
    case 'EDIT_EMPLOYEE_TRAINING_REQUIREMENT_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case 'ADD_EMPLOYEE_TRAINING_REQUIREMENT_DOCUMENT_REQUEST':
      return {
        ...state,
        pendingDocuments: [
          ...state.pendingDocuments,
          ...action.rejectedFiles.map(file => ({
            id: '',
            isDeleted: false,
            fileName: file.name,
            mimeType: '',
            status: Failed,
            storagePath: '',
            causeOfFailure: file.reason
          })),
          ...action.payload.map(file => ({
            id: '',
            isDeleted: false,
            fileName: file.name,
            storagePath: '',
            mimeType: file.type,
            status: Uploading
          }))
        ]
      };
    case 'ADD_EMPLOYEE_TRAINING_REQUIREMENT_DOCUMENT_SUCCESS':
      return {
        ...state,
        pendingDocuments: state.pendingDocuments.map(document =>
          document.fileName === action.payload.fileName
            ? { ...document, status: Uploaded, id: action.payload.id }
            : document
        )
      };
    case 'ADD_EMPLOYEE_TRAINING_REQUIREMENT_DOCUMENT_FAILURE':
      return {
        ...state,
        pendingDocuments: state.pendingDocuments.map(document =>
          document.fileName === action.fileName
            ? {
                ...document,
                status: Failed,
                causeOfFailure: i18next.t(
                  'trainingCompliance.contractor.employeeTrainingRequirement.internalServerError',
                  'Internal server error'
                )
              }
            : document
        )
      };
    case 'DOWNLOAD_EMPLOYEE_TRAINING_REQUIREMENT_DOCUMENT_REQUEST':
      return {
        ...state,
        employeeTrainingRequirement: state.employeeTrainingRequirement
          ? {
              ...state.employeeTrainingRequirement,
              metaData: state.employeeTrainingRequirement.metaData.map(document =>
                document.id === action.payload
                  ? {
                      ...document,
                      status: Downloading
                    }
                  : document
              )
            }
          : state.employeeTrainingRequirement,
        pendingDocuments: state.pendingDocuments.map(document =>
          document.id === action.payload
            ? {
                ...document,
                status: Downloading
              }
            : document
        )
      };
    case 'DOWNLOAD_EMPLOYEE_TRAINING_REQUIREMENT_DOCUMENT_SUCCESS':
      return {
        ...state,
        employeeTrainingRequirement: state.employeeTrainingRequirement
          ? {
              ...state.employeeTrainingRequirement,
              metaData: state.employeeTrainingRequirement.metaData.map(document =>
                document.id === action.payload
                  ? {
                      ...document,
                      status: Uploaded
                    }
                  : document
              )
            }
          : state.employeeTrainingRequirement,
        pendingDocuments: state.pendingDocuments.map(document =>
          document.id === action.payload
            ? {
                ...document,
                status: Uploaded
              }
            : document
        )
      };
    case 'DOWNLOAD_EMPLOYEE_TRAINING_REQUIREMENT_DOCUMENT_FAILURE':
      return {
        ...state,
        employeeTrainingRequirement: state.employeeTrainingRequirement
          ? {
              ...state.employeeTrainingRequirement,
              metaData: state.employeeTrainingRequirement.metaData.map(document =>
                document.id === action.payload
                  ? {
                      ...document,
                      status: Failed,
                      causeOfFailure: action.error.message
                    }
                  : document
              )
            }
          : state.employeeTrainingRequirement,
        pendingDocuments: state.pendingDocuments.map(document =>
          document.id === action.payload
            ? {
                ...document,
                status: Failed,
                causeOfFailure: action.error.message
              }
            : document
        )
      };
    case 'DELETE_EMPLOYEE_TRAINING_REQUIREMENT_DOCUMENT_SUCCESS':
      return {
        ...state,
        employeeTrainingRequirement: state.employeeTrainingRequirement
          ? {
              ...state.employeeTrainingRequirement,
              metaData: state.employeeTrainingRequirement.metaData.filter(document => document.id !== action.payload)
            }
          : initialState.employeeTrainingRequirement,
        pendingDocuments: state.pendingDocuments.filter(document => document.id !== action.payload)
      };
    default:
      return state;
  }
}
