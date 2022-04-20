import * as actionTypes from '../../actionTypes';
import { IVerisourceEmployee } from 'interfaces/VerisourceEmployee';

export const startEmployeesLinking = (PECId: string, verisourceEmployee: IVerisourceEmployee) => ({
  type: actionTypes.LINK_EMPLOYEES,
  payload: {
    PECId,
    verisourceEmployee
  }
});

export type Actions = ReturnType<typeof startEmployeesLinking>;
