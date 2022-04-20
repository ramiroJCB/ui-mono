import { IAnswer } from '../src/interfaces/answer';
import { organizations } from '../../../packages/aion-ui-core/src/fixtures';

const filler = {
  organizationId: organizations[3].id,
  inspectionId: '783059c0-2b0e-4a8b-aff0-be8b7ee6a9c7',
  sectionId: '67ffc49d-8738-4521-a38e-ac0d013e24b7',
  isDeleted: false
};

export const answers: IAnswer[] = [
  {
    ...filler,
    id: 'd2ac3f36-5263-447b-9829-3e09876cffc1',
    questionId: '0d9a4686-d869-4617-8504-e855c38e2dca',
    value: 'John Doe'
  },
  {
    ...filler,
    id: '6e84ad82-b08b-407c-8c87-b1baffdcaeb6',
    questionId: '65bc671c-b371-43ef-9439-993b8a1fd4ba',
    value: '2020-08-06T19:38:14.599Z'
  },
  {
    ...filler,
    id: '9b7aa3bb-cda3-4cec-9e07-a43b72fcdf80',
    questionId: 'ce250a48-30e2-49b5-b577-dd901bb4dcaf',
    value: '12345'
  },
  {
    ...filler,
    id: 'e4c72331-750e-4d75-8494-954737bf9e3c',
    questionId: '32f41543-b17c-4cc6-8241-b6fa18a628fc',
    value: '38d7d90e-f7fb-471b-ae34-19475ab4dc38'
  },
  {
    ...filler,
    id: '535caea0-ea46-470f-ac55-347816caef1d',
    questionId: '7224f5fe-e517-4113-a911-565ed909ab5b',
    value: '053b4169-c0bc-4058-9eae-8291eecf12d2'
  },
  {
    ...filler,
    id: '9cbcc317-8ab7-4518-8341-6f902c06ddfb',
    questionId: 'abbd0611-1d13-4422-bae7-a24230492740',
    value: ''
  },
  {
    ...filler,
    id: 'cef66811-bdc6-41be-ba34-0d46bd17e590',
    questionId: '1c5770a4-5356-448c-8d8a-38ab96bd147c',
    value: '68085550-8f98-45ad-9b88-8ec69807f7e2'
  },
  {
    ...filler,
    id: '070783a2-f8ed-47ff-aca2-0f1f8a3ac823',
    questionId: 'a55368a9-88f2-4ea2-b2fa-90d95fc81a0b',
    value: 'Yes, it really exceeded our expectations!'
  },
  {
    ...filler,
    id: 'e20f07c3-ffdd-44f3-902d-9c06d7116069',
    questionId: '01ecdee6-71ca-4b4c-8b1b-2c67ead881fe',
    value: '2020-08-15T16:00:23.860Z'
  },
  {
    ...filler,
    id: 'd42b79b8-1934-407c-973c-ebe13e3d6bab',
    questionId: 'f821cd97-3a10-4f88-9525-3257b47fe922',
    value: '2020-08-15T17:30:23.865Z'
  }
];
