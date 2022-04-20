import '@pec/aion-ui-i18next';
import i18next from 'i18next';
import { getOverrideHistoryActionType } from './getOverrideHistoryActionType';
import { OverrideActionType } from 'interfaces/overrideHistory';

const t = i18next.t.bind(i18next);

describe('getOverrideHistoryActionType', () => {
  it('returns the display value', () => {
    expect(getOverrideHistoryActionType(OverrideActionType.Approved, t)).toEqual('Approved');
    expect(getOverrideHistoryActionType(OverrideActionType.Cancelled, t)).toEqual('Cancelled');
    expect(getOverrideHistoryActionType(OverrideActionType.Denied, t)).toEqual('Denied');
    expect(getOverrideHistoryActionType(OverrideActionType.Granted, t)).toEqual('Granted');
    expect(getOverrideHistoryActionType(OverrideActionType.Requested, t)).toEqual('Requested');
    expect(getOverrideHistoryActionType(OverrideActionType.Removed, t)).toEqual('Removed');
    expect(getOverrideHistoryActionType(OverrideActionType.CommentChange, t)).toEqual('Comment Change');
    expect(getOverrideHistoryActionType(null, t)).toEqual('');
  });
});
