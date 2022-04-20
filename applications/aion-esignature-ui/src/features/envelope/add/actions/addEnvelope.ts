import axios, { AxiosError } from 'axios';
import { AssigneeGroupType } from '@pec/aion-ui-core/interfaces/assigneeGroup';
import { enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IAddEnvelopeForm } from 'interfaces/envelopeForm';
import { IEnvelope } from '@pec/aion-ui-core/interfaces/envelope';
import { OptionType } from '@pec/aion-ui-form/types/option';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';
import i18next from 'i18next';

const { AllReleasedContractors, Organization } = AssigneeGroupType;

const addEnvelopeRequest = () =>
  ({
    type: 'ADD_ENVELOPE_REQUEST'
  } as const);

const addEnvelopeSuccess = () =>
  ({
    type: 'ADD_ENVELOPE_SUCCESS'
  } as const);

const addEnvelopeFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'ADD_ENVELOPE_FAILURE',
    error
  } as const;
};

const shouldAddEnvelope = ({ envelope: { isFetching } }: RootState) => !isFetching;

const addEnvelope = ({
  assigneeGroups,
  document,
  documentType,
  templateId
}: IAddEnvelopeForm): ThunkAction<Promise<IEnvelope>, RootState, null, Actions> => async dispatch => {
  return new Promise(async (resolve, reject) => {
    try {
      dispatch(addEnvelopeRequest());

      const assignToAllReleaseContractors = assigneeGroups.some(assignee => assignee.id === AllReleasedContractors);

      const payload = {
        templateId,
        assigneeGroups: assignToAllReleaseContractors
          ? [{ type: AllReleasedContractors, typeId: null }]
          : assigneeGroups.map(({ id, name }: OptionType) => ({
              type: Organization,
              typeId: id,
              name: name
            })),
        documents: documentType === 'custom' ? [document] : []
      };

      const { data } = await axios.post<IEnvelope>('/api/v3.01/eSignatureEnvelopeGroups', payload);

      dispatch(addEnvelopeSuccess());

      dispatch(
        enqueueSnackbar({
          message: i18next.t(
            'eSignature.envelope.add.documentWasAssigned',
            'Document has been assigned to the selected contractor(s).'
          ),
          options: {
            variant: 'success'
          }
        })
      );

      resolve(data);
    } catch (error) {
      dispatch(addEnvelopeFailure(error));

      dispatch(
        enqueueSnackbar({
          message: i18next.t('eSignature.envelope.add.errorOccurred', 'An error has occurred.'),
          options: {
            variant: 'error'
          }
        })
      );

      reject();
    }
  });
};

export const addEnvelopeIfNeeded = (addEnvelopeForm: IAddEnvelopeForm): ThunkAction<void, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  if (shouldAddEnvelope(getState())) {
    return dispatch(addEnvelope(addEnvelopeForm));
  }

  return;
};

export type Actions =
  | ReturnType<typeof addEnvelopeRequest>
  | ReturnType<typeof addEnvelopeSuccess>
  | ReturnType<typeof addEnvelopeFailure>;
