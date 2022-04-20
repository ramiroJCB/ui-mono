import { IncidentCategoryStatus } from './incidentCategory';
import { IncidentRegionStatus } from './incidentRegion';
import { IncidentRootCauseStatus } from './incidentRootCause';
import { IncidentTypeStatus } from './incidentType';
import { IncidentWorkGroupStatus } from './incidentWorkGroup';

export interface IIncident {
  id: string;
  clientId: string;
  contractorId: string;
  incidentCategoryId: string;
  incidentRegionId: string | null;
  incidentRootCauseId: string | null;
  incidentTypeId: string;
  incidentWorkGroupId: string | null;
  incidentNumber: number;
  occurredOnDateUtc: string;
  createdDateUtc: string;
  details: string;
  latitude: number | null;
  longitude: number | null;
  formattedAddress: string | null;
  meta?: {
    clientName: string;
    contractorName: string;
    incidentCategoryName: string;
    incidentCategoryStatus: IncidentCategoryStatus;
    incidentTypeName: string;
    incidentTypeStatus: IncidentTypeStatus;
    incidentRootCauseName: string;
    incidentRootCauseStatus: IncidentRootCauseStatus;
    incidentRegionName: string;
    incidentRegionStatus: IncidentRegionStatus;
    incidentWorkGroupName: string;
    incidentWorkGroupStatus: IncidentWorkGroupStatus;
  };
}
