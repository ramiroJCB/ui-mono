import * as React from 'react';
import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { IconListItem } from '@pec/aion-ui-components/components/IconListItem';
import { ISearchTraineesForm } from '../interfaces/searchTraineesForm';
import { mount } from 'enzyme';
import { TraineeSearchResults } from '../components/TraineeSearchResults';
import { traineesWithEmployees as trainees } from '../../fixtures/traineesWithEmployees';
import '@pec/aion-ui-i18next';

const userProvidedInfo: ISearchTraineesForm = {
  birthDate: '2001-04-20',
  emailAddress: 'largemarge@pba.mgm',
  firstName: 'Marge',
  lastName: 'Muchogrande',
  phoneNumber: '985-555-01234',
  ssnLastFour: '9871',
  organization: {
    id: 'f8cf30ec-5dc0-4e43-b3bb-c3ae47704f3f',
    name: 'Longhaul Fright & Freight'
  }
};

const initialProps = {
  handleItemClick: jest.fn(),
  handleTraineeNotFound: jest.fn(),
  organizationId: '123456789',
  showBackButton: true,
  siteId: '123456789',
  trainees: trainees.slice(0, 1),
  userProvidedInfo: userProvidedInfo
};

let wrapper;

describe('Trainee Search Results', () => {
  beforeEach(() => {
    wrapper = mount(
      <FakeStoreAndRouter state={{}}>
        <TraineeSearchResults {...initialProps} />
      </FakeStoreAndRouter>
    );
  });
  it('renders a SELECT button for each list item', () => {
    wrapper.find(IconListItem).forEach(node => {
      expect(node.find(Button).text()).toMatch('Select');
    });
  });
  it('renders one list item per employee record, plus one for just for the trainee, for each trainee', () => {
    expect(wrapper.find(IconListItem)).toHaveLength(trainees[0].employees.length + 1);
  });
  it('displays the correct text for each list item', () => {
    const lastListItemText = wrapper
      .find(IconListItem)
      .last()
      .find(ListItemText)
      .text();
    expect(lastListItemText).toMatch(`Link this record with ${userProvidedInfo.organization.name}`);
  });
});
