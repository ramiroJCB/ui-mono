import '@pec/aion-ui-i18next';
import i18next from 'i18next';
import { EnvelopeStatus } from '@pec/aion-ui-core/interfaces/envelope';
import { localizeEnvelopeStatusDescription } from './envelope';

const t = i18next.t.bind(i18next);

describe('localizeEnvelopeStatusDescription', () => {
  it('returns the localized status', () => {
    expect(localizeEnvelopeStatusDescription(EnvelopeStatus.Pending, t)).toEqual('Pending');
    expect(localizeEnvelopeStatusDescription(EnvelopeStatus.NotSigned, t)).toEqual('Not Signed');
    expect(localizeEnvelopeStatusDescription(EnvelopeStatus.AssigneeAssigned, t)).toEqual('Assignee Assigned');
    expect(localizeEnvelopeStatusDescription(EnvelopeStatus.OwnerAssigned, t)).toEqual('Owner Assigned');
    expect(localizeEnvelopeStatusDescription(EnvelopeStatus.WaitingForOthers, t)).toEqual('Waiting For Others');
    expect(localizeEnvelopeStatusDescription(EnvelopeStatus.Completed, t)).toEqual('Completed');
  });
});
