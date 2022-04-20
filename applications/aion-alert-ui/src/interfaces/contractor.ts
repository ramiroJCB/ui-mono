import { ITag } from './tag';

export interface IContractor {
  id: string;
  name: string;
  tags?: ITag[];
}
