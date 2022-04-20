import { getPredictiveRankingScoreString } from './helpers';

describe('getPredictiveRankingScoreString', () => {
  it('converts a predictive ranking numeric score to the appropriate string', () => {
    const test = {
      predictiveRanking: {
        organization: '750aaa27-7588-41e0-995c-cdd008285bb2',
        score: 2,
        riskDataImpacts: [
          {
            name: 'Metric 1',
            value: 'Value for metric 1',
            weight: 0.5,
            shortDescription: 'Short Description Metric 1',
            longDescription: 'Long Description Metric 1'
          },
          {
            name: 'Metric 2',
            value: 'Value for metric 2',
            weight: 0.7,
            shortDescription: 'Short Description Metric 2',
            longDescription: 'Long Description Metric 2'
          }
        ]
      }
    };
    const score = test.predictiveRanking.score;
    expect(getPredictiveRankingScoreString(score)).toBe('Elevated Risk');
  });
});
