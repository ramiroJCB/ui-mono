import { DeepReadonly } from 'utility-types';
import { IOverride } from 'interfaces/override';
import { IClient } from 'interfaces/client';
import i18next from 'i18next';

export const getClientExceptions = (
  clientScoreOverrides: DeepReadonly<IOverride[]>,
  clients: DeepReadonly<IClient[]>
) =>
  clientScoreOverrides
    .filter(({ isOverridden }) => isOverridden)
    .map(allowance => {
      return {
        ...allowance,
        name:
          clients.find(client => client.id === allowance.clientId)?.name ||
          i18next.t('safetyPrograms.common.NA', 'N/A').toString()
      };
    });
