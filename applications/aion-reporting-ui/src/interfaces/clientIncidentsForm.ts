import { IContractor } from './contractor';
import { IIncidentCategory } from './incidentCategory';
import { IIncidentType } from './incidentType';

export interface IClientIncidentsForm {
  start: string;
  end: string;
  contractors: IContractor[];
  types: IIncidentType[];
  categories: IIncidentCategory[];
}
