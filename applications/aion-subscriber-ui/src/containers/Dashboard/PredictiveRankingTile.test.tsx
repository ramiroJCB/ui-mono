import '@pec/aion-ui-i18next';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { CircularProgress } from '@pec/aion-ui-components/components/CircularProgress';
import { ErrorIcon } from '@pec/aion-ui-components/components/ErrorIcon';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { PredictiveRankingTileContainer } from './PredictiveRankingTile';
import { mount } from 'enzyme';

it('renders a loading spinner right away', () => {
  const wrapper = mount(
    <FakeStoreAndRouter state={{ predictiveRanking: { isFetching: true } }}>
      <PredictiveRankingTileContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.find(CircularProgress)).toHaveLength(1);
});

it('renders an error message if there was an error fetching', () => {
  const wrapper = mount(
    <FakeStoreAndRouter state={{ predictiveRanking: { error: true } }}>
      <PredictiveRankingTileContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.find(ErrorIcon)).toHaveLength(1);
});

it('renders the predictive ranking component and correctly iterates over the array of riskDataImpacts', () => {
  const test = {
    predictiveRanking: [
      {
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
    ]
  };
  const wrapper = mount(
    <FakeStoreAndRouter
      state={{
        predictiveRanking: test
      }}
    >
      <PredictiveRankingTileContainer />
    </FakeStoreAndRouter>
  ).props();

  if (wrapper.predictiveRanking) {
    expect(wrapper.predictiveRanking.riskDataImpacts[0].shortDescription).toEqual('Short Description Metric 1');
    expect(wrapper.predictiveRanking.riskDataImpacts[1].shortDescription).toBe('Short Description Metric 2');
  }
});

it('renders a message if no predictive data available', () => {
  const test = {
    predictiveRanking: {
      organization: '750aaa27-7588-41e0-995c-cdd008285bb2',
      score: undefined,
      riskDataImpacts: []
    }
  };
  const wrapper = mount(
    <FakeStoreAndRouter
      state={{
        predictiveRanking: test
      }}
    >
      <PredictiveRankingTileContainer />
    </FakeStoreAndRouter>
  );

  const tileComponent = wrapper.find(Typography).at(4);
  expect(tileComponent.text()).toContain('No Data Available');
});
