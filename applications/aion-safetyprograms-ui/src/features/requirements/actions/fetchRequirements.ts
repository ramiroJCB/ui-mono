import axios, { AxiosError } from 'axios';
import { IClientRequirement, IExpandedRequirement } from 'interfaces/requirement';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { SafetyProgramRequirementStatus } from '@pec/aion-ui-core/interfaces/safetyProgramRequirementStatus';
import { ThunkAction } from 'redux-thunk';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';

export const $top = 25;

const { Equals, In, NotEquals } = OdataComparator;

type ResponseData = { value: IExpandedRequirement[]; '@odata.count': number };
type ClientResponseData = { value: IClientRequirement[]; '@odata.count': number };

const fetchRequirementsRequest = (search: string) =>
  ({
    type: 'FETCH_REQUIREMENTS_REQUEST',
    search
  } as const);

const fetchRequirementsSuccess = (data: ResponseData) =>
  ({
    type: 'FETCH_REQUIREMENTS_SUCCESS',
    payload: data.value,
    total: data['@odata.count']
  } as const);

const fetchClientRequirementsSuccess = (data: ClientResponseData) =>
  ({
    type: 'FETCH_CLIENT_REQUIREMENTS_SUCCESS',
    payload: data.value,
    total: data['@odata.count']
  } as const);

const fetchRequirementsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_REQUIREMENTS_FAILURE',
    error
  } as const;
};

export const fetchClientRequirements = (
  search: string,
  organizationId?: string
): ThunkAction<Promise<ClientResponseData>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchRequirementsRequest(search));
      const {
        orderby: _orderby = 'lastContractorActivityDateUtc desc',
        overrideStatuses,
        page: _page = '0',
        contractors,
        safetyPrograms,
        statuses,
        isOverridden,
        hasGracePeriod
      } = parse(search);
      const orderby = _orderby.toString();
      const page = parseInt(_page.toString());

      const clientParams = new QueryBuilder()
        .top($top)
        .skip(page * $top)
        .filter(({ filterBy }) => {
          const filter = filterBy('clientId', Equals, organizationId);

          contractors && filter.and(f => f.filterBy('contractorId', In, contractors.toString().split(',')));
          safetyPrograms && filter.and(f => f.filterBy('safetyProgramId', In, safetyPrograms.toString().split(',')));
          statuses && filter.and(f => f.filterBy('safetyProgramRequirementStatus', In, statuses.toString().split(',')));
          overrideStatuses && filter.and(f => f.filterBy('overrideStatus', In, overrideStatuses.toString().split(',')));

          isOverridden && filter.and(f => f.filterBy('isOverridden', Equals, true));
          hasGracePeriod && filter.and(f => f.filterBy('effectiveGracePeriod', NotEquals, null));
          return filter;
        })
        .toQueryParam();

      const [property, direction] = orderby.split(' ');
      const orderbyParams =
        property === 'safetyProgramRequirementStatus'
          ? {
              orderByRequirementStatus: true,
              desc: direction === 'desc'
            }
          : property === 'overrideStatus'
          ? {
              orderByOverrideStatus: true,
              orderOverridesDesc: direction === 'desc'
            }
          : { $orderby: orderby };

      const { data } = await axios.get<ClientResponseData>('/api/v3.01/clientSafetyProgramRequirements', {
        params: {
          ...orderbyParams,
          ...clientParams
        }
      });

      dispatch(fetchClientRequirementsSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchRequirementsFailure(error));
      reject(error);
    }
  });

export const fetchContractorRequirements = (
  organizationId: string,
  search: string
): ThunkAction<Promise<ResponseData>, RootState, null, Actions> => async (dispatch, getState) =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchRequirementsRequest(search));
      const { userInfo } = getState().userInfo;

      const { page: _page = '0' } = parse(search);
      const page = parseInt(_page.toString());

      const { data } = await axios.get<ResponseData>('/api/v3.01/safetyProgramRequirements', {
        params: {
          $expand: 'Clients,ClientScoreOverrides,ClientGracePeriods',
          $top,
          $skip: page * $top,
          $orderby: 'SafetyProgramTitle',
          $filter: `contractorId eq ${organizationId}`
        },
        headers: {
          'X-Aion-OrganizationId': userInfo?.primaryOrganizationId
        }
      });

      dispatch(fetchRequirementsSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchRequirementsFailure(error));
      reject(error);
    }
  });

export const fetchFilteredRequirements = (
  search: string,
  organizationId?: string
): ThunkAction<Promise<ResponseData>, RootState, null, Actions> => async dispatch =>
  new Promise(async (resolve, reject) => {
    try {
      dispatch(fetchRequirementsRequest(search));

      const {
        orderby: _orderby = 'lastContractorActivityDateUtc desc',
        overrideStatuses,
        page: _page = '0',
        clients,
        contractors,
        safetyPrograms,
        statuses,
        hasUnreadContractorComments,
        isOverridden,
        hasGracePeriod
      } = parse(search);

      const orderby = _orderby.toString();
      const page = parseInt(_page.toString());
      const filters = [];
      const { Completable, CompletableNotApplicable } = SafetyProgramRequirementStatus;

      if (contractors) {
        filters.push(`contractorId in (${contractors})`);
      }

      if (safetyPrograms) {
        filters.push(`safetyProgramId in (${safetyPrograms})`);
      }

      if (statuses) {
        const updatedStatuses = statuses.includes(Completable)
          ? statuses.toString().replace(Completable, `${Completable},${CompletableNotApplicable}`)
          : statuses;
        filters.push(
          updatedStatuses
            .toString()
            .split(',')
            .map(status => `status eq '${status}'`)
            .join(' or ')
        );
      }

      if (overrideStatuses) {
        filters.push(
          overrideStatuses
            .toString()
            .split(',')
            .map(status => `overrideStatus eq '${status}'`)
            .join(' or ')
        );
      }

      if (hasUnreadContractorComments) {
        filters.push(`hasUnreadContractorComments eq ${hasUnreadContractorComments}`);
      }

      if (isOverridden === 'true') {
        filters.push('hasOverride eq true');
      }

      if (hasGracePeriod === 'true') {
        filters.push('hasGracePeriod eq true');
      }

      const [property, direction] = orderby.split(' ');
      const orderbyParams =
        property === 'requirementStatus'
          ? {
              orderByRequirementStatus: true,
              desc: direction === 'desc'
            }
          : { $orderby: orderby };

      const { data } = await axios.get<ResponseData>('/api/v3.01/safetyProgramRequirements', {
        params: {
          $expand: 'Clients,ClientScoreOverrides,ClientGracePeriods',
          $top,
          $skip: page * $top,
          ...orderbyParams,
          clientIds: organizationId || clients,
          $filter: filters.map(filter => `(${filter})`).join(' and ') || undefined,
          isOverridden: isOverridden === 'true' || undefined
        },
        headers: {
          'X-Aion-OrganizationId': '00000000-0000-0000-0000-000000000000'
        }
      });

      dispatch(fetchRequirementsSuccess(data));
      resolve(data);
    } catch (error) {
      dispatch(fetchRequirementsFailure(error));
      reject(error);
    }
  });

export type Actions =
  | ReturnType<typeof fetchRequirementsRequest>
  | ReturnType<typeof fetchRequirementsSuccess>
  | ReturnType<typeof fetchClientRequirementsSuccess>
  | ReturnType<typeof fetchRequirementsFailure>;
