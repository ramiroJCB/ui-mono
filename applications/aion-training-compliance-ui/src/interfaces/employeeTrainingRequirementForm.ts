import { FileWithPath } from 'react-dropzone';
import { IEmployeeTrainingRequirement } from './employeeTrainingRequirement';
import { InvalidFileUpload } from '@pec/aion-ui-core/interfaces/invalidFileUpload';

export interface IEmployeeTrainingRequirementForm extends IEmployeeTrainingRequirement {
  uploadedFiles: IUploadedFiles;
}

export interface IUploadedFiles {
  acceptedFiles: FileWithPath[];
  rejectedFiles: InvalidFileUpload[];
}
