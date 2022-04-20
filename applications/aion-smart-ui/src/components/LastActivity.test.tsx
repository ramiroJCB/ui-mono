import * as React from 'react';
import { LastActivityComponent } from './LastActivity';
import { LivesOnSiteSwitch } from './LivesOnSiteSwitch';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import { Switch } from '@material-ui/core';
import { workers } from '../../fixtures/workers';
import { WorkerStatus } from '../interfaces/worker';

const { CheckedOut, CheckedIn, Injured } = WorkerStatus;

it('allows checking out a checked-in worker', () => {
  const spy = jest.fn();
  mount(
    <MemoryRouter>
      <LastActivityComponent
        worker={workers[1]}
        changeStatus={spy}
        toggleLivesOnSite={() => new Promise(resolve => resolve)}
        organizationId=""
      />
    </MemoryRouter>
  );
  expect(spy).toHaveBeenCalledWith(CheckedOut);
});

it('allows reporting a checked-in worker as injured', () => {
  const spy = jest.fn();
  mount(
    <MemoryRouter>
      <LastActivityComponent
        worker={workers[1]}
        changeStatus={spy}
        toggleLivesOnSite={() => new Promise(resolve => resolve)}
        organizationId=""
      />
    </MemoryRouter>
  );
  expect(spy).toHaveBeenCalledWith(Injured);
});

it('allows checking in a checked-out worker', () => {
  const spy = jest.fn();
  mount(
    <MemoryRouter>
      <LastActivityComponent
        worker={workers[0]}
        changeStatus={spy}
        toggleLivesOnSite={() => new Promise(resolve => resolve)}
        organizationId=""
      />
    </MemoryRouter>
  );
  expect(spy).toHaveBeenCalledWith(CheckedIn);
});

it('allows checking in a rejected worker', () => {
  const spy = jest.fn();
  mount(
    <MemoryRouter>
      <LastActivityComponent
        worker={workers[6]}
        changeStatus={spy}
        organizationId=""
        toggleLivesOnSite={() => new Promise(resolve => resolve)}
      />
    </MemoryRouter>
  );
  expect(spy).toHaveBeenCalledWith(CheckedIn);
});

it('allows toggling whether an injured worker lives on site', () => {
  const spy = jest.fn();
  const wrapper = mount(
    <MemoryRouter>
      <LastActivityComponent
        worker={workers[4]}
        changeStatus={() => () => new Promise(resolve => resolve)}
        organizationId=""
        toggleLivesOnSite={spy}
      />
    </MemoryRouter>
  );
  wrapper
    .find(LivesOnSiteSwitch)
    .find(Switch)
    .props().onChange!({ target: { checked: true } } as React.ChangeEvent<HTMLInputElement>, true);
  expect(spy).toHaveBeenCalled();
});

it('allows toggling whether a checked-in worker lives on site', () => {
  const spy = jest.fn();
  const wrapper = mount(
    <MemoryRouter>
      <LastActivityComponent
        worker={workers[2]}
        changeStatus={() => () => new Promise(resolve => resolve)}
        organizationId=""
        toggleLivesOnSite={spy}
      />
    </MemoryRouter>
  );
  wrapper
    .find(LivesOnSiteSwitch)
    .find(Switch)
    .props().onChange!({ target: { checked: true } } as React.ChangeEvent<HTMLInputElement>, true);
  expect(spy).toHaveBeenCalled();
});

it('allows toggling whether a checked-out worker lives on site', () => {
  const spy = jest.fn();
  const wrapper = mount(
    <MemoryRouter>
      <LastActivityComponent
        worker={workers[12]}
        changeStatus={() => () => new Promise(resolve => resolve)}
        organizationId=""
        toggleLivesOnSite={spy}
      />
    </MemoryRouter>
  );
  wrapper
    .find(LivesOnSiteSwitch)
    .find(Switch)
    .props().onChange!({ target: { checked: true } } as React.ChangeEvent<HTMLInputElement>, true);
  expect(spy).toHaveBeenCalled();
});
