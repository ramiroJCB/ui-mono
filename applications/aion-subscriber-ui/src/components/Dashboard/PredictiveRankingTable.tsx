import * as React from 'react';
import TableBody from '@material-ui/core/TableBody';
import { DeepReadonly } from 'utility-types';
import { IPredictiveRanking } from 'interfaces/predictiveRanking';
import { PredictiveRankingRowComponent } from './PredictiveRankingRow';

type Props = {
  predictiveRanking?: DeepReadonly<IPredictiveRanking>;
};

export const PredictiveRankingTableComponent: React.FC<Props> = ({ predictiveRanking }) => (
  <TableBody>
    {predictiveRanking && predictiveRanking.riskDataImpacts.length > 0 ? (
      predictiveRanking.riskDataImpacts
        .slice(0, 3)
        .map(impact => (
          <PredictiveRankingRowComponent key={impact.name} predictiveRanking={predictiveRanking} impact={impact} />
        ))
    ) : (
      <PredictiveRankingRowComponent predictiveRanking={predictiveRanking} />
    )}
  </TableBody>
);
