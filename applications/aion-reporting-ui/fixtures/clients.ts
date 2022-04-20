import { IClient } from '../src/interfaces/client';
import { organizations } from '../../../packages/aion-ui-core/src/fixtures';

export const clients: IClient[] = [
  {
    id: organizations[0].id,
    name: organizations[0].name
  },
  {
    id: organizations[1].id,
    name: organizations[1].name
  },
  {
    id: organizations[3].id,
    name: organizations[3].name
  }
];
