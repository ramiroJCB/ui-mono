export interface IReference {
  id: string;
  name: string;
  phoneNumber: string;
  emailAddress: string | null;
  notes: string;
  organizationId: string;
  isDeleted: boolean;
}
