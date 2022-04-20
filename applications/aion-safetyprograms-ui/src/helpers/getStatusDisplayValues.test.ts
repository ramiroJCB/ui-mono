import { ClientOverrideStatus } from 'interfaces/requirementOverride';
import { getClientOverrideStatusDisplayValue, getClientOverrideStatusGridDisplayValue } from './getStatusDisplayValues';
import '@pec/aion-ui-i18next';
import i18next from 'i18next';

const t = i18next.t.bind(i18next);

describe('lookUpDisplayValue', () => {
  it('returns the display value', () => {
    expect(getClientOverrideStatusDisplayValue(ClientOverrideStatus.None, t)).toEqual('No Exception In Place');
    expect(getClientOverrideStatusDisplayValue(ClientOverrideStatus.Approved, t)).toEqual('Exception Request Approved');
    expect(getClientOverrideStatusDisplayValue(ClientOverrideStatus.Denied, t)).toEqual('Exception Request Denied');
    expect(getClientOverrideStatusDisplayValue(ClientOverrideStatus.Requested, t)).toEqual('Exception Requested');
    expect(getClientOverrideStatusDisplayValue(ClientOverrideStatus.Removed, t)).toEqual('Exception Removed');
    expect(getClientOverrideStatusDisplayValue(ClientOverrideStatus.Granted, t)).toEqual('Exception Granted');
    expect(getClientOverrideStatusDisplayValue(null, t)).toEqual('No Exception In Place');
  });
});

describe('lookUpGridDisplayValue', () => {
  it('returns the grid display value', () => {
    expect(getClientOverrideStatusGridDisplayValue(ClientOverrideStatus.None, t)).toEqual('');
    expect(getClientOverrideStatusGridDisplayValue(ClientOverrideStatus.Approved, t)).toEqual('Request Approved');
    expect(getClientOverrideStatusGridDisplayValue(ClientOverrideStatus.Denied, t)).toEqual('Request Denied');
    expect(getClientOverrideStatusGridDisplayValue(ClientOverrideStatus.Requested, t)).toEqual('Requested');
    expect(getClientOverrideStatusGridDisplayValue(ClientOverrideStatus.Removed, t)).toEqual('Removed');
    expect(getClientOverrideStatusGridDisplayValue(ClientOverrideStatus.Granted, t)).toEqual('Granted');
    expect(getClientOverrideStatusGridDisplayValue(null, t)).toEqual('');
  });
});
