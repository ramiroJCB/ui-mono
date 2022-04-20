import { GridSize } from '@material-ui/core/Grid';

export interface IHeaderObject {
  id: string;
  label: string | JSX.Element;
  isOrderable?: boolean;
  size: GridSize;
  rtl?: boolean;
  expandedId?: string;
}
