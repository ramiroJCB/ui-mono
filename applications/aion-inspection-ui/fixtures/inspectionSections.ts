import { CurrentStatus } from '../src/interfaces/inspection';
import { IInspectionSection } from '../src/interfaces/inspectionSection';
import { organizations } from '../../../packages/aion-ui-core/src/fixtures';

const { InProgress } = CurrentStatus;

const filler = {
  contractorId: organizations[2].id,
  inspectionId: '783059c0-2b0e-4a8b-aff0-be8b7ee6a9c7',
  isDeleted: false,
  organizationId: organizations[3].id,
  status: InProgress
};

export const inspectionSections: IInspectionSection[] = [
  {
    ...filler,
    id: '783059c0-2b0e-4a8b-aff0-be8b7ee6a9c7',
    sectionId: '6e5362e9-6beb-407b-950d-e1b35261ff02',
    sectionName: '1. General Information',
    sectionSortOrder: 1
  },
  {
    ...filler,
    id: 'a2472d28-a94c-44ae-8eb6-ac0f0143fe52',
    sectionId: '9cd1c72a-f06f-4adb-86da-ac0d013e2743',
    sectionName: '2. Supervision',
    sectionSortOrder: 2
  },
  {
    ...filler,
    id: '7d725d3b-482f-4b22-ba6f-ac0f0143fe52',
    sectionId: '7869845b-0b73-40e6-8344-ac0d013e2745',
    sectionName: '3. Planning and Organization of Work',
    sectionSortOrder: 3
  },
  {
    ...filler,
    id: '007bc726-3b74-43d7-878d-ac0f0143fe52',
    sectionId: '4e4e19d5-5676-4cfa-9089-ac0d013e2754',
    sectionName: '4. Adherence To Plans & Specifications',
    sectionSortOrder: 4
  },
  {
    ...filler,
    id: '87a55d8c-0cee-4e96-af2e-ac0f0143fe52',
    sectionId: '84449825-bd99-42d2-9e21-ac0d013e2761',
    sectionName: '5. Adherence to Target Milestones & Completion Dates',
    sectionSortOrder: 5
  },
  {
    ...filler,
    id: 'f7c008d5-f891-4173-a5f0-ac0f0143fe52',
    sectionId: '0fe834d8-f89f-4e5f-9cca-ac0d013e276d',
    sectionName: '6. Quality of Work',
    sectionSortOrder: 6
  },
  {
    ...filler,
    id: '55fcd750-03c6-4f83-9c6c-ac0f0143fe52',
    sectionId: '3e7ec3f2-e1df-4fb6-8c73-ac0d013e2786',
    sectionName: '7. Cooperativeness & Communication',
    sectionSortOrder: 7
  },
  {
    ...filler,
    id: '59852487-9154-4bd0-be59-ac0f0143fe52',
    sectionId: '627cc93e-8cb6-4bb9-a371-ac0d013e27a6',
    sectionName: '8. Utilization of Satisfactory Subcontractors',
    sectionSortOrder: 8
  },
  {
    ...filler,
    id: '90fee085-4ebc-4f3f-b67a-ac0f0143fe52',
    sectionId: 'ff303d3f-5218-48fe-9121-ac0d013e27c4',
    sectionName: '9. Safety',
    sectionSortOrder: 9
  },
  {
    ...filler,
    id: '2c768a5c-1638-4ec8-975d-ac0f0143fe52',
    sectionId: '67372b07-31a8-4531-a7dc-ac0d013e27e2',
    sectionName: '10. Invoicing',
    sectionSortOrder: 10
  },
  {
    ...filler,
    id: '608415cb-d9b1-4ddf-b90b-ac0f0143fe52',
    sectionId: '3dcb92a0-f252-4de2-a13e-ac0d013e2801',
    sectionName: '11. Accruals',
    sectionSortOrder: 11
  },
  {
    ...filler,
    id: '42c7578c-feab-4886-a2b0-ac0f0143fe52',
    sectionId: 'bb1449fd-7d98-48c4-9cb6-ac0d013e2814',
    sectionName: '12. Change Orders',
    sectionSortOrder: 12
  }
];
