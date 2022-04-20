import axios, { AxiosError } from 'axios';
import { defaultOrder, defaultOrderBy, defaultPage, defaultPageSize } from '../containers/EnvelopesTable';
import { EnvelopeStatus, IEnvelope } from '@pec/aion-ui-core/interfaces/envelope';
import { FilterOptionValueType } from '@pec/aion-ui-odata/types/odataFilterOption';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { ParsedUrlQuery } from 'querystring';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const { Contains, Equals, In } = OdataComparator;
const { AssigneeAssigned, Pending } = EnvelopeStatus;

const fetchEnvelopesRequest = () =>
  ({
    type: 'FETCH_ENVELOPES_REQUEST'
  } as const);

const fetchEnvelopesSuccess = (payload: IEnvelope[], totalCount: number) =>
  ({
    type: 'FETCH_ENVELOPES_SUCCESS',
    payload,
    totalCount
  } as const);

const fetchEnvelopesFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_ENVELOPES_FAILURE',
    error
  } as const;
};

const shouldFetchEnvelopes = ({ envelopes: { isFetching } }: RootState) => !isFetching;

const fetchEnvelopes = (
  isClientOrg: boolean,
  organizationId: string,
  {
    assigneeTypeName,
    createdBy,
    documentFileName,
    order,
    orderBy,
    ownerTypeName,
    page,
    status,
    updatedDateUtc
  }: ParsedUrlQuery
): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchEnvelopesRequest());

    const top = defaultPageSize;
    const sortOrder = orderBy && order ? `${orderBy} ${order}` : `${defaultOrderBy} ${defaultOrder}`;

    if (status === Pending || status === AssigneeAssigned) {
      status = [Pending, AssigneeAssigned];
    }

    const odataParams = new QueryBuilder()
      .orderBy(sortOrder)
      .top(top)
      .skipByPage(page || defaultPage.toString(), top)
      .filter(f =>
        f
          .filterBy('assigneeTypeName', Contains, assigneeTypeName)
          .filterBy('createdBy', Contains, createdBy)
          .filterBy('ownerTypeName', Contains, ownerTypeName)
          .filterBy('status', In, status, {
            valueType: FilterOptionValueType.EnumType
          })
          .filterBy('updatedDateUtc', Equals, updatedDateUtc)
          .filterBy(isClientOrg ? 'ownerTypeId' : 'assigneeTypeId', Equals, organizationId)
      )
      .toQueryParam();

    const { data } = await axios.get<{ value: IEnvelope[]; '@odata.count': number }>('/api/v3.01/eSignatureEnvelopes', {
      params: {
        ...odataParams,
        documentFileName
      }
    });

    const envelopes = data.value;
    const totalCount = data['@odata.count'] !== undefined ? data['@odata.count'] : 0;

    dispatch(fetchEnvelopesSuccess(envelopes, totalCount));
  } catch (error) {
    dispatch(fetchEnvelopesFailure(error));
  }
};

export const fetchEnvelopesIfNeeded = (
  isClientOrg: boolean,
  organizationId: string,
  search: ParsedUrlQuery
): ThunkAction<void, RootState, null, Actions> => (dispatch, getState) => {
  if (shouldFetchEnvelopes(getState())) {
    dispatch(fetchEnvelopes(isClientOrg, organizationId, search));
  }
};

export type Actions =
  | ReturnType<typeof fetchEnvelopesRequest>
  | ReturnType<typeof fetchEnvelopesSuccess>
  | ReturnType<typeof fetchEnvelopesFailure>;
