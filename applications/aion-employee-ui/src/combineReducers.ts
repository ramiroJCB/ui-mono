import { combineReducers } from 'redux';
import { commonRootReducer, CommonRootState } from '@pec/aion-ui-core/combineReducers';
import { reducer as PECEmployees, State as PECEmployeesState } from 'reducers/PECEmployees';
import { reducer as VerisourceEmployees, State as VerisourceEmployeesState } from 'reducers/VerisourceEmployees';
import { reducer as employeesTable, State as EmployeesTableState } from 'reducers/allEmployeesTable';
import { reducer as employeeLinking, State as EmployeeLinkingState } from 'reducers/employeeLinking';
import { RootActions } from 'combineActions';

type AppRootState = {
  PECEmployees: PECEmployeesState;
  employeesTable: EmployeesTableState;
  VerisourceEmployees: VerisourceEmployeesState;
  employeeLinking: EmployeeLinkingState;
};

export type RootState = CommonRootState & AppRootState;

export const rootReducer = combineReducers<RootState, RootActions>({
  ...commonRootReducer,
  PECEmployees,
  employeesTable,
  VerisourceEmployees,
  employeeLinking
});
