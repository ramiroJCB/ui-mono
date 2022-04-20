// PLURAL (GET, POST)
// /api/v1/organizations(orgId)/sites(siteId)/contacts

// SINGULAR (GET, PUT, DELETE)
// /api/v1/organizations(orgId)/sites(siteId)/contacts(contactId)

export interface IContact {
  siteId: string;
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  jobTitle: string | null;
  description: string | null;
}
