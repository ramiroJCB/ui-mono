import { ISiteTag } from './siteTag';
import { IWorkGroup } from '@pec/aion-ui-core/interfaces/workGroup';

// PLURAL (GET, POST)
// /api/v2/organizations(orgId)/sites

// SINGULAR (GET, PUT, DELETE)
// /api/v2/organizations(orgId)/sites(siteId)

export enum SiteStatus {
  Active = 'Active',
  Inactive = 'Inactive'
}

export interface ISiteLocation {
  latitude: number | null;
  longitude: number | null;
  formattedAddress: string | null;
}

interface ISiteCommon extends ISiteLocation {
  organizationId: string;
  id: string;
  name: string;
  description: string | null;
  // TODO: Remove '?' when we have back-end support
  standardShiftDuration?: number | null;
  numWorkersOnSite: number;
  numContacts: number;
  status: SiteStatus;
}

export interface ISite extends ISiteCommon {
  tags: string[];
  workGroups: string[] | null;
  itemsWorkgroups: { [id: string]: boolean };
}

export interface ISiteForm extends ISiteCommon {
  tags: ISiteTag[];
  workGroups: IWorkGroup[];
  itemsWorkgroups: { [id: string]: boolean };
}

// Just used by the UI; Back-end folks can ignore this
export enum SiteMode {
  details = 'details',
  location = 'location'
}
