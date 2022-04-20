import * as actionTypes from '../../actionTypes';

export const cancelEmployeesLinking = () => ({
  type: actionTypes.CANCEL_LINK_EMPLOYEES,
  payload: {}
});

export type Actions = ReturnType<typeof cancelEmployeesLinking>;
