import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { setOption, toggleStringPresenceInArray } from '@pec/aion-ui-core/actions/options';
import { ThunkAction } from 'redux-thunk';

export const toggleClientScoresTileExpandedOrganizationId = (
  organizationId: string
): ThunkAction<void, RootState, null, RootActions> => (dispatch, getState) => {
  const ids = getState().options.clientScoresTileExpandedOrganizationIds;
  const newIds = toggleStringPresenceInArray([...ids], organizationId);

  return dispatch(setOption('clientScoresTileExpandedOrganizationIds', newIds));
};
