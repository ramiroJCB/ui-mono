import { mapRegionMetrics } from './helpers';
import { regionalMetrics } from '../../../../../fixtures/regionalMetrics';
import { regionalMetricValues } from '../../../../../fixtures/regionalMetricValues';
import { regions } from '../../../../../fixtures/regions';

describe('mapRegionMetrics', () => {
  it('converts the flat metric values payload into nested object of regions', () => {
    const regionMetrics = mapRegionMetrics(regions.value, regionalMetrics.value, regionalMetricValues.value);

    expect(regionMetrics.length).toEqual(10);
    expect(regionMetrics[0].metrics.length).toEqual(10);
    expect(regionMetrics[0].name).toEqual('Central Valley');
    expect(regionMetrics[0].metrics[7].name).toEqual('Transportation / Warehouse');
  });
});
