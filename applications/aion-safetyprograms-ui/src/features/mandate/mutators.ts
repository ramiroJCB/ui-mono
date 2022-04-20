import { IMandateForm } from 'interfaces/mandate';

export const selectRegionalServices = (serviceRegionId: string, ids: string[]) => (
  regionalServiceIdsByRegion: IMandateForm['regionalServiceIdsByRegion']
) => {
  const currentIds = regionalServiceIdsByRegion[serviceRegionId] || [];
  const newIds = ids.filter(id => !currentIds.includes(id));
  return {
    ...regionalServiceIdsByRegion,
    [serviceRegionId]: currentIds.concat(newIds)
  };
};

export const deselectRegionalServices = (serviceRegionId: string, ids: string[]) => (
  regionalServiceIdsByRegion: IMandateForm['regionalServiceIdsByRegion']
) => ({
  ...regionalServiceIdsByRegion,
  [serviceRegionId]: (regionalServiceIdsByRegion[serviceRegionId] || []).filter(id => !ids.includes(id))
});
