import * as React from 'react';
import DialogContentText from '@material-ui/core/DialogContentText';
import { ChangeEmployer } from './ChangeEmployer';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { IconListItem } from '@pec/aion-ui-components/components/IconListItem';
import { IdentifyWorkerResults, IdentifyWorkerResultsComponent, Props, State } from './IdentifyWorkerResults';
import { mount } from 'enzyme';
import { traineesWithEmployees as trainees } from '../../fixtures/traineesWithEmployees';
import '@pec/aion-ui-i18next';

const initialProps = {
  handleChangeEmployer: jest.fn(),
  isFetching: false,
  organizationId: '123456789',
  pecIdentifier: 'PEC-12345678',
  showBackButton: false,
  siteId: '987654321',
  trainees: trainees.slice(0, 1)
};

const initialState: State = {
  hasNewEmployeeRecord: false,
  selectedEmployeeId: '7777777'
};

let wrapper;

describe('Identify Worker Results', () => {
  beforeEach(() => {
    wrapper = mount<Props, State>(
      <FakeStoreAndRouter state={{}}>
        <IdentifyWorkerResults {...initialProps} />
      </FakeStoreAndRouter>
    );
  });

  it('opens modal with correct text when user clicks "Change Employer" link', () => {
    let changeEmployerForm = wrapper.find(ChangeEmployer).at(0);
    expect(changeEmployerForm.exists()).toBe(false);

    const idWorkerResultsComponent = wrapper.find(IdentifyWorkerResultsComponent);
    idWorkerResultsComponent.setState(initialState);
    idWorkerResultsComponent
      .find('a[href="changeEmployer"]')
      .at(0)
      .simulate('click');

    expect(idWorkerResultsComponent.state('selectedEmployeeId')).toBe(initialProps.trainees[0].employees[0].id);

    changeEmployerForm = wrapper.find(ChangeEmployer).at(0);
    expect(changeEmployerForm.exists()).toBe(true);
    expect(changeEmployerForm.props().shouldDisplay).toBe(true);
    expect(changeEmployerForm.props().trainee).toEqual(initialProps.trainees[0]);

    expect(changeEmployerForm.find(DialogContentText).text()).toMatch(
      `If ${trainees[0].employees[0].organization.name} is not correct`
    );
  });
  it('animates only newly added list item', () => {
    const idWorkerResultsComponent = wrapper.find(IdentifyWorkerResultsComponent);
    idWorkerResultsComponent.setState(initialState);

    let firstListItem = wrapper.find(IconListItem).at(0);
    expect(firstListItem.props().classes.root).toBeUndefined();

    idWorkerResultsComponent.setState({ ...initialState, hasNewEmployeeRecord: true });
    firstListItem = wrapper.find(IconListItem).at(0);
    expect(firstListItem.props().classes.root).toBeDefined();
  });
});
