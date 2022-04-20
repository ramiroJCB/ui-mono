import { ISite } from './site';
import { ISiteTag } from './siteTag';

export interface IReportForm {
  start: string;
  end: string;
  sites: ISite[];
  tags: ISiteTag[];
}
