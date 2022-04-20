import { IViolationsType } from './oshaViolations';
import React from 'react';
export interface IViolationsTableOption {
  id: string;
  SSQID?: number;
  match?: string;
  importedDateUtc?: string;
  oshaCompanyName: string;
  citationId?: string;
  activity?: React.ReactElement;
  violationType?: IViolationsType;
  opened?: string;
  closedDate?: string;
  naics?: string;
  attestedOn?: string;
  state?: string;
}
