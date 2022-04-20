import { Actions as FetchTemplatesActions } from 'features/templates/actions/fetchTemplates';
import { Actions as FetchEnvelopesActions } from 'features/envelopes/actions/fetchEnvelopes';
import { Actions as AddEnvelopeActions } from 'features/envelope/add/actions/addEnvelope';
import { RootActions as CommonRootActions } from '@pec/aion-ui-core/combineActions';

export type RootActions = CommonRootActions | AddEnvelopeActions | FetchEnvelopesActions | FetchTemplatesActions;
