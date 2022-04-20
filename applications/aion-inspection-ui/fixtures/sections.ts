import { ISection } from '../src/interfaces/section';
import { organizations } from '../../../packages/aion-ui-core/src/fixtures';

export const sections: ISection[] = [
  {
    id: '6e5362e9-6beb-407b-950d-e1b35261ff02',
    formId: '2be4793b-989c-4c25-8dfc-a1ae231f2c01',
    organizationId: organizations[3].id,
    description: 'General Information Section',
    name: 'General Information',
    sortOrder: 1,
    schema: [
      {
        id: '0d9a4686-d869-4617-8504-e855c38e2dca',
        component: 'text-field',
        name: 'a6f105c7-c7c5-40f2-bbb1-49459d222975',
        title: 'Observer Name',
        label: 'Observer Name',
        isRequired: true,
        validate: [
          {
            type: 'required'
          }
        ]
      },
      {
        id: '65bc671c-b371-43ef-9439-993b8a1fd4ba',
        component: 'date-picker',
        name: '32e13b3f-d24c-4720-bde9-1baadc6f15dc',
        title: 'Observation Date',
        label: 'Observation Date',
        isRequired: true,
        validate: [
          {
            type: 'required'
          }
        ]
      },
      {
        id: 'ce250a48-30e2-49b5-b577-dd901bb4dcaf',
        component: 'text-field',
        name: 'bd2ec149-b877-4b85-8976-e00b83b3c361',
        title: 'Work Order Number',
        label: 'Work Order Number',
        type: 'number',
        isRequired: true,
        validate: [
          {
            type: 'required'
          }
        ]
      },
      {
        id: '32f41543-b17c-4cc6-8241-b6fa18a628fc',
        component: 'radio',
        name: 'ad389b77-5df1-45de-8f1e-c2c03fcd889c',
        title: 'High Pressure',
        label: 'High Pressure',
        isRequired: true,
        validate: [
          {
            type: 'required'
          }
        ],
        options: [
          {
            label: 'Yes',
            value: '38d7d90e-f7fb-471b-ae34-19475ab4dc38'
          },
          {
            label: 'No',
            value: '768cba9e-1d57-447d-9d28-2448cabf2c6c'
          }
        ]
      },
      {
        id: 'ee8577d6-20b1-423b-a3b5-c37fa8b7ab30',
        component: 'sub-form',
        name: 'd11e70aa-888a-4a19-8967-77795d2347a1',
        title: 'Continued Use',
        description: 'Continued Use of contractor is recommended?',
        fields: [
          {
            id: '7224f5fe-e517-4113-a911-565ed909ab5b',
            component: 'select',
            name: 'aaaa5e69-6763-4a67-b6ef-8004bea15628',
            label: 'Continued Use',
            isRequired: true,
            validate: [
              {
                type: 'required'
              }
            ],
            options: [
              {
                label: 'Yes',
                value: '053b4169-c0bc-4058-9eae-8291eecf12d2'
              },
              {
                label: 'Yes - With Restrictions',
                value: '4e778747-ab51-486d-a6ff-183ad7a3fe7f'
              },
              {
                label: 'No',
                value: '4f68693e-2e5a-433d-ab94-5d25ca9a10ac'
              }
            ]
          },
          {
            id: 'abbd0611-1d13-4422-bae7-a24230492740',
            component: 'textarea',
            name: '339ccd68-60ee-4ec1-9676-424dc6810b63',
            label: 'Comment',
            isRequired: true,
            conditionalrequired: {
              fieldName: 'aaaa5e69-6763-4a67-b6ef-8004bea15628',
              fieldValue: ['4e778747-ab51-486d-a6ff-183ad7a3fe7f', '4f68693e-2e5a-433d-ab94-5d25ca9a10ac']
            },
            validate: [
              {
                type: 'conditionalRequired',
                fieldName: 'aaaa5e69-6763-4a67-b6ef-8004bea15628',
                fieldValue: ['4e778747-ab51-486d-a6ff-183ad7a3fe7f', '4f68693e-2e5a-433d-ab94-5d25ca9a10ac']
              }
            ]
          }
        ]
      },

      {
        id: '5a6b1ff7-b2e1-4901-82dd-2b7292dcc885',
        component: 'sub-form',
        name: 'd11e70aa-888a-4a19-8967-77795d2347a1',
        title: 'Project Oversight Sufficiency',
        description: 'Project oversight sufficient and appropriate for job scope and complexity?',
        fields: [
          {
            id: '1c5770a4-5356-448c-8d8a-38ab96bd147c',
            component: 'select',
            name: 'c1fd2ea9-4b4d-44f3-a4b0-945b16827bc6',
            label: 'Project Oversight Sufficiency',
            isRequired: false,
            options: [
              {
                label: 'Far Below Expectations',
                value: '1daf8549-0626-41fa-8922-da74b0814bee'
              },
              {
                label: 'Below Expectations',
                value: 'c624fe64-0a08-4563-aafc-e460bef455c9'
              },
              {
                label: 'Met Expectations',
                value: 'c8baf06e-e842-4690-8260-2718733815e3'
              },
              {
                label: 'Exceeded Expectations',
                value: '56df2b75-4463-4e52-81dd-82b6a65a3e12'
              },
              {
                label: 'Far Exceeded Expectations',
                value: '68085550-8f98-45ad-9b88-8ec69807f7e2'
              }
            ]
          },
          {
            id: 'a55368a9-88f2-4ea2-b2fa-90d95fc81a0b',
            component: 'textarea',
            name: 'bb8a790e-5e28-443a-b669-55ef0fe8b5ee',
            label: 'Comment',
            isRequired: true,
            validate: [
              {
                type: 'required'
              }
            ],
            condition: {
              when: 'c1fd2ea9-4b4d-44f3-a4b0-945b16827bc6',
              is: [
                '1daf8549-0626-41fa-8922-da74b0814bee',
                'c624fe64-0a08-4563-aafc-e460bef455c9',
                '68085550-8f98-45ad-9b88-8ec69807f7e2'
              ]
            }
          }
        ]
      },
      {
        id: '0d42ffe9-8da4-4973-a154-d922bd5fdfc3',
        component: 'sub-form',
        name: '1d677c47-f068-4e2d-8ee3-b6b88efec4bd',
        title: 'Time',
        fields: [
          {
            id: '01ecdee6-71ca-4b4c-8b1b-2c67ead881fe',
            component: 'time-picker',
            name: 'afb40da6-bb7c-4d91-98d4-272c9060e9f3',
            label: 'Start Time',
            isRequired: true,
            validate: [
              {
                type: 'required'
              }
            ]
          },
          {
            id: 'f821cd97-3a10-4f88-9525-3257b47fe922',
            component: 'time-picker',
            name: '577646c1-1b76-4d59-9cf9-955b127f9031',
            label: 'End Time',
            isRequired: true,
            validate: [
              {
                type: 'required'
              }
            ]
          }
        ]
      }
    ]
  }
];
