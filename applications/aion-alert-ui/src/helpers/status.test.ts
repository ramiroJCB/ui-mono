import { getImpliedIconStatus } from './status';
import { TaskStatus } from '@pec/aion-ui-core/interfaces/taskGroup';

const { AssigneeReplied, AwaitingAction, Complete, Incomplete, OwnerReplied, Submitted } = TaskStatus;

describe('status helper', () => {
  describe('Client statuses', () => {
    it(`returns Complete status when status is Complete`, () => {
      expect(getImpliedIconStatus(false, Complete)).toBe(Complete);
    });

    it(`returns Incomplete status when status is Incomplete`, () => {
      expect(getImpliedIconStatus(false, Incomplete)).toBe(Incomplete);
    });

    it(`returns AwaitingAction status when status is AssigneeReplied`, () => {
      expect(getImpliedIconStatus(false, AssigneeReplied)).toBe(AwaitingAction);
    });

    it(`returns AwaitingAction status when status is Submitted`, () => {
      expect(getImpliedIconStatus(false, Submitted)).toBe(AwaitingAction);
    });

    it(`returns Incomplete status when status is OwnerReplied`, () => {
      expect(getImpliedIconStatus(false, OwnerReplied)).toBe(Incomplete);
    });
  });

  describe('Contractor statuses', () => {
    it(`returns Complete status when status is Complete`, () => {
      expect(getImpliedIconStatus(true, Complete)).toBe(Complete);
    });

    it(`returns Incomplete status when status is Incomplete`, () => {
      expect(getImpliedIconStatus(true, Incomplete)).toBe(Incomplete);
    });

    it(`returns AssigneeReplied status when status is AssigneeReplied`, () => {
      expect(getImpliedIconStatus(true, AssigneeReplied)).toBe(AssigneeReplied);
    });

    it(`returns Submitted status when status is Submitted`, () => {
      expect(getImpliedIconStatus(true, Submitted)).toBe(Submitted);
    });

    it(`returns AwaitingAction status when status is OwnerReplied`, () => {
      expect(getImpliedIconStatus(true, OwnerReplied)).toBe(OwnerReplied);
    });
  });
});
