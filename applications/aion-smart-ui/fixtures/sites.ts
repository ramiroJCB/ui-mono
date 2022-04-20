import { ISite, SiteStatus } from '../src/interfaces/site';

const { Active, Inactive } = SiteStatus;

export const sites: ISite[] = [
  {
    id: '29f174f9-3723-4cb2-ae84-c10f0b86d6d0',
    organizationId: '6e5362e9-6beb-407b-950d-e1b35261ff02',
    name: 'Silver X Pad 2',
    description:
      'Adipisci itaque repellendus.\nAut ut praesentium ut laborum a molestiae laborum sint.\nMolestiae placeat hic ea consequatur eos totam adipisci fuga voluptatem.',
    standardShiftDuration: null,
    latitude: -39.4465,
    longitude: -87.2817,
    formattedAddress: null,
    numWorkersOnSite: 18,
    numContacts: 4,
    status: Active,
    tags: ['Eagle Ford', 'Permian Basin', 'Ft. Worth Basin'],
    workGroups: ['29f174f9-3723-4cb2-ae84-c10f0b86d000', '29f174f9-3723-4cb2-ae84-c10f0b86d000'],
    itemsWorkgroups: {}
  },
  {
    id: 'a38a9647-fc62-4b27-93ab-a1ccec768b25',
    organizationId: '6e5362e9-6beb-407b-950d-e1b35261ff02',
    name: 'Golden X Pad -1',
    description:
      'Aut ut praesentium ut laborum a molestiae laborum sint.\nMolestiae placeat hic ea consequatur eos totam adipisci fuga voluptatem.',
    standardShiftDuration: 34200000,
    latitude: -39.4465,
    longitude: -87.2817,
    formattedAddress: 'Adipisci itaque repellendus',
    numWorkersOnSite: 0,
    numContacts: 0,
    status: Inactive,
    tags: ['Eagle Ford', 'Permian Basin', 'Ft. Worth Basin'],
    workGroups: ['29f174f9-3723-4cb2-ae84-c10f0b86d000', '29f174f9-3723-4cb2-ae84-c10f0b86d000'],
    itemsWorkgroups: {}
  }
];
