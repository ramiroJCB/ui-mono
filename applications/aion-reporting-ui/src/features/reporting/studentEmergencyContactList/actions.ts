import axios, { AxiosError } from 'axios';
import FileSaver from 'file-saver';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const downloadStudentEmergencyContactListReportRequest = () =>
  ({
    type: 'DOWNLOAD_STUDENT_EMERGENCY_CONTACT_LIST_REPORT_REQUEST'
  } as const);

const downloadStudentEmergencyContactListReportSuccess = () =>
  ({
    type: 'DOWNLOAD_STUDENT_EMERGENCY_CONTACT_LIST_REPORT_SUCCESS'
  } as const);

const downloadStudentEmergencyContactListReportFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'DOWNLOAD_STUDENT_EMERGENCY_CONTACT_LIST_REPORT_FAILURE',
    error
  } as const;
};

export const downloadStudentEmergencyContactListReport = (
  id: string
): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(downloadStudentEmergencyContactListReportRequest());

    const { data, headers } = await axios.get<BlobPart>(
      `/files/reporting/v3.01/studentEmergencyContactListReport(${id})`,
      {
        responseType: 'arraybuffer'
      }
    );

    const blob = new Blob([data], { type: headers['content-type'] });
    FileSaver.saveAs(blob, 'StudentEmergencyContactList.csv');

    dispatch(downloadStudentEmergencyContactListReportSuccess());
  } catch (error) {
    dispatch(downloadStudentEmergencyContactListReportFailure(error));
  }
};

export type Actions =
  | ReturnType<typeof downloadStudentEmergencyContactListReportRequest>
  | ReturnType<typeof downloadStudentEmergencyContactListReportSuccess>
  | ReturnType<typeof downloadStudentEmergencyContactListReportFailure>;
