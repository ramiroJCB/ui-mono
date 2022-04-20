import { Actions as FetchVeriforceOrganizationActions } from 'actions/fetchVeriforceOrganization';
import { RootActions as CommonRootActions } from '@pec/aion-ui-core/combineActions';

export type RootActions = FetchVeriforceOrganizationActions | CommonRootActions;
