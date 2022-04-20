import axios from 'axios';
import { fetchTableDataItemSelected } from './fetchVerisourceEmployees';
import { RootState } from '../../combineReducers';
import { IPECEmployee } from 'interfaces/PECEmployee';
const organizationId = '';
const pecEmployee: IPECEmployee = {
  CreatedDate: '2014-02-05T00:00:00',
  id: '0bafca0f-3748-4383-abf6-a8ae0163472a',
  isDeleted: false,
  organizationEmployeeId: '',
  organizationId: 'd459b6de-70dd-47c7-81f1-a8d900e144ac',
  origin: 'PEC',
  startDate: '',
  employeeStatus: 'Inactive',
  traineeBirthDate: '1980-04-16T00:00:00',
  traineeFirstName: 'SETH',
  traineeId: '9f73be0f-4ed9-e811-a9bb-8b450c7facc1',
  traineeLastName: 'WARD',
  traineePecIdentifier: 'PEC-00727156',
  UpdatedDate: '2019-02-06T15:27:25',
  verisourceEmployeeId: null
};

const data = {
  values: [
    {
      oqsgId: 'x'
    }
  ],
  count: 1
};

describe('fetches selected table data item', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('sends params to fetch selected table data item', async () => {
    axios.post = jest.fn(() => new Promise(resolve => resolve({ data, headers: {} })));

    await fetchTableDataItemSelected(pecEmployee)(
      () => null,
      () => ({} as RootState),
      null
    );
    expect(axios.post).toHaveBeenCalledWith('/api/v3.00/verisourceEmployees/smartSearch', {
      birthDate: '1980-04-16',
      firstName: 'SETH',
      lastName: 'WARD'
    });
  });
});
