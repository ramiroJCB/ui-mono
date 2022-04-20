import { RootActions as CommonRootActions } from '@pec/aion-ui-core/combineActions';
import { Actions as FetchEmployeeActions } from 'actions/employees/fetchEmployees';
import { Actions as FetchVerisourceEmployeeActions } from 'actions/employees/fetchVerisourceEmployees';
import { Actions as ToggleExpandedRow } from 'actions/allEmplyeesTable/toggleExpandedRow';
import { Actions as LinkEmployeesActions } from 'actions/linkEmployees/startLinking';
import { Actions as CancelEmployeesLinking } from 'actions/linkEmployees/cancelLinking';
import { Actions as RequestEmployeeLinking } from 'actions/linkEmployees/requestEmployeeLinking';
import { Actions as ToggleExpandAction } from 'actions/allEmplyeesTable/toggleExpandAction';
export type RootActions =
  | CommonRootActions
  | FetchEmployeeActions
  | ToggleExpandedRow
  | FetchVerisourceEmployeeActions
  | LinkEmployeesActions
  | CancelEmployeesLinking
  | RequestEmployeeLinking
  | ToggleExpandAction;
