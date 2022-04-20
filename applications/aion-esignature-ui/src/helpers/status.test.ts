import { EnvelopeStatus, EnvelopeStatusDescription } from '@pec/aion-ui-core/interfaces/envelope';
import { getImpliedEnvelopeStatus } from './status';

const { AssigneeAssigned, Completed, NotSigned, OwnerAssigned, Pending, WaitingForOthers } = EnvelopeStatus;

describe('status helper', () => {
  describe('Client statuses', () => {
    it(`returns WaitingForOthers status description when status is AssigneeAssigned`, () => {
      expect(getImpliedEnvelopeStatus(true, AssigneeAssigned, true)).toBe(
        EnvelopeStatusDescription.get(WaitingForOthers)
      );
    });

    it(`returns WaitingForOthers status description when status is Pending`, () => {
      expect(getImpliedEnvelopeStatus(true, Pending, true)).toBe(EnvelopeStatusDescription.get(WaitingForOthers));
    });

    it(`returns NotSigned status description when status is OwnerAssigned`, () => {
      expect(getImpliedEnvelopeStatus(true, OwnerAssigned, true)).toBe(EnvelopeStatusDescription.get(NotSigned));
    });

    it(`returns Completed status description when status is Completed`, () => {
      expect(getImpliedEnvelopeStatus(true, Completed, true)).toBe(EnvelopeStatusDescription.get(Completed));
    });

    it(`returns WaitingForOthers status when status is AssigneeAssigned`, () => {
      expect(getImpliedEnvelopeStatus(true, AssigneeAssigned)).toBe(WaitingForOthers);
    });

    it(`returns WaitingForOthers status when status is Pending`, () => {
      expect(getImpliedEnvelopeStatus(true, Pending)).toBe(WaitingForOthers);
    });

    it(`returns NotSigned status when status is OwnerAssigned`, () => {
      expect(getImpliedEnvelopeStatus(true, OwnerAssigned)).toBe(NotSigned);
    });

    it(`returns Completed status when status is Completed`, () => {
      expect(getImpliedEnvelopeStatus(true, Completed, true)).toBe(Completed);
    });

    it(`returns Unknown status description when status is not handled`, () => {
      expect(getImpliedEnvelopeStatus(true, EnvelopeStatus['unknown'], true)).toBe('Unknown');
    });
  });

  describe('Contractor statuses', () => {
    it(`returns NotSigned status description when status is AssigneeAssigned`, () => {
      expect(getImpliedEnvelopeStatus(false, AssigneeAssigned, true)).toBe(EnvelopeStatusDescription.get(NotSigned));
    });

    it(`returns NotSigned status description when status is Pending`, () => {
      expect(getImpliedEnvelopeStatus(false, Pending, true)).toBe(EnvelopeStatusDescription.get(NotSigned));
    });

    it(`returns WaitingForOthers status description when status is OwnerAssigned`, () => {
      expect(getImpliedEnvelopeStatus(false, OwnerAssigned, true)).toBe(
        EnvelopeStatusDescription.get(WaitingForOthers)
      );
    });

    it(`returns Completed status description when status is Completed`, () => {
      expect(getImpliedEnvelopeStatus(false, Completed, true)).toBe(EnvelopeStatusDescription.get(Completed));
    });

    it(`returns NotSigned status when status is AssigneeAssigned`, () => {
      expect(getImpliedEnvelopeStatus(false, AssigneeAssigned)).toBe(NotSigned);
    });

    it(`returns NotSigned status when status is Pending`, () => {
      expect(getImpliedEnvelopeStatus(false, Pending)).toBe(NotSigned);
    });

    it(`returns WaitingForOthers status when status is OwnerAssigned`, () => {
      expect(getImpliedEnvelopeStatus(false, OwnerAssigned)).toBe(WaitingForOthers);
    });

    it(`returns Completed status when status is Completed`, () => {
      expect(getImpliedEnvelopeStatus(false, Completed)).toBe(Completed);
    });

    it(`returns Unknown status description when status is not handled`, () => {
      expect(getImpliedEnvelopeStatus(false, EnvelopeStatus['unknown'], true)).toBe('Unknown');
    });
  });
});
