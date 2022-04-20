import * as actionTypes from '../../actionTypes';

export const toggleExpandedRow = (id:string) => ({
  type: actionTypes.TOGGLE_EXPANDED_ROW,
  payload: id
})

export type Actions =
  | ReturnType<typeof toggleExpandedRow>
