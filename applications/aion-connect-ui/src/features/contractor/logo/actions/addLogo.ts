import axios, { AxiosError } from 'axios';
import Compressor from 'compressorjs';
import { enqueueRequestErrorSnackbar, enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IUploadedLogo } from 'interfaces/uploadedLogo';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

export const addLogoRequest = (payload: Blob) =>
  ({
    type: 'ADD_LOGO_REQUEST',
    payload
  } as const);

export const addLogoSuccess = (payload: Blob, metaData: IUploadedLogo) =>
  ({
    type: 'ADD_LOGO_SUCCESS',
    payload,
    metaData
  } as const);

export const addLogoFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_LOGO_FAILURE',
    error
  } as const;
};

export const addLogo = (
  organizationId: string,
  logo: Blob,
  name: string
): ThunkAction<Promise<Blob>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    dispatch(addLogoRequest(logo));
    const maxFileSize = 3145728; // 3MB

    try {
      const compressedLogo = await new Promise<Blob>((resolve, reject) => {
        new Compressor(logo, {
          quality: 0.8,
          maxHeight: 600,
          maxWidth: 600,
          success: resolve,
          error: reject
        });
      });

      const formData = new FormData();

      formData.append('value', compressedLogo, name);

      const { data: metaData } = await axios.post<IUploadedLogo>(
        `/api/v3.01/organizations(${organizationId})/logo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (compressedLogo.size < maxFileSize) {
        dispatch(addLogoSuccess(logo, metaData));
        resolve(logo);
      } else {
        dispatch(
          enqueueSnackbar({
            message: 'Your logo is too big. Its file size must be below 3MB.',
            options: {
              variant: 'error'
            }
          })
        );
      }
    } catch (error) {
      dispatch(addLogoFailure(error));
      dispatch(enqueueRequestErrorSnackbar());
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof addLogoRequest>
  | ReturnType<typeof addLogoSuccess>
  | ReturnType<typeof addLogoFailure>;
