import * as React from 'react';
import { createMemoryHistory } from 'history';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import { Switch } from '@material-ui/core';
import { WorkerComponent } from './Worker';
import { workers } from '../../fixtures/workers';
import { WorkerStatus } from '../interfaces/worker';

const { CheckedOut, CheckedIn, Rejected } = WorkerStatus;

it('allows checking out a checked-in worker', () => {
  const spy = jest.fn();
  mount(
    <MemoryRouter>
      <WorkerComponent
        worker={workers[1]}
        trainingRequirements={[]}
        overallRanking={null}
        changeStatus={spy}
        toggleLivesOnSite={() => new Promise(resolve => resolve)}
        organizationId=""
        siteId=""
        history={createMemoryHistory()}
        showBackButton={true}
        isStepOne={true}
        handleClose={() => undefined}
        handleStepChange={() => undefined}
      />
    </MemoryRouter>
  );
  expect(spy).toHaveBeenCalledWith(CheckedOut);
});

it('allows checking in a non-checked-in worker', () => {
  const spy = jest.fn();
  mount(
    <MemoryRouter>
      <WorkerComponent
        worker={workers[0]}
        trainingRequirements={[]}
        overallRanking={null}
        changeStatus={spy}
        toggleLivesOnSite={() => new Promise(resolve => resolve)}
        organizationId=""
        siteId=""
        history={createMemoryHistory()}
        showBackButton={true}
        isStepOne={true}
        handleClose={() => undefined}
        handleStepChange={() => undefined}
      />
    </MemoryRouter>
  );
  expect(spy).toHaveBeenCalledWith(CheckedIn);
});

it('allows rejecting a non-checked-in worker', () => {
  const spy = jest.fn();
  mount(
    <MemoryRouter>
      <WorkerComponent
        worker={workers[0]}
        trainingRequirements={[]}
        overallRanking={null}
        toggleLivesOnSite={() => new Promise(resolve => resolve)}
        changeStatus={spy}
        organizationId=""
        siteId=""
        history={createMemoryHistory()}
        showBackButton={true}
        isStepOne={true}
        handleClose={() => undefined}
        handleStepChange={() => undefined}
      />
    </MemoryRouter>
  );
  expect(spy).toHaveBeenCalledWith(Rejected);
});

it('allows toggling livesOnSite for an injured worker', () => {
  const spy = jest.fn();
  const wrapper = mount(
    <MemoryRouter>
      <WorkerComponent
        worker={workers[4]}
        trainingRequirements={[]}
        overallRanking={null}
        changeStatus={() => () => new Promise(resolve => resolve)}
        organizationId=""
        toggleLivesOnSite={spy}
        siteId=""
        history={createMemoryHistory()}
        showBackButton={true}
        isStepOne={true}
        handleClose={() => undefined}
        handleStepChange={() => undefined}
      />
    </MemoryRouter>
  );
  wrapper.find(Switch).props().onChange!({ target: { checked: true } } as React.ChangeEvent<HTMLInputElement>, true);
  expect(spy).toHaveBeenCalled();
});

it('allows toggling livesOnSite for a checked in worker', () => {
  const spy = jest.fn();
  const wrapper = mount(
    <MemoryRouter>
      <WorkerComponent
        worker={workers[2]}
        trainingRequirements={[]}
        overallRanking={null}
        changeStatus={() => () => new Promise(resolve => resolve)}
        organizationId=""
        toggleLivesOnSite={spy}
        siteId=""
        history={createMemoryHistory()}
        showBackButton={true}
        isStepOne={true}
        handleClose={() => undefined}
        handleStepChange={() => undefined}
      />
    </MemoryRouter>
  );
  wrapper.find(Switch).props().onChange!({ target: { checked: true } } as React.ChangeEvent<HTMLInputElement>, true);
  expect(spy).toHaveBeenCalled();
});

it('allows toggling livesOnSite for a checked out worker', () => {
  const spy = jest.fn();
  const wrapper = mount(
    <MemoryRouter>
      <WorkerComponent
        worker={workers[12]}
        trainingRequirements={[]}
        overallRanking={null}
        changeStatus={() => () => new Promise(resolve => resolve)}
        organizationId=""
        toggleLivesOnSite={spy}
        siteId=""
        history={createMemoryHistory()}
        showBackButton={true}
        isStepOne={true}
        handleClose={() => undefined}
        handleStepChange={() => undefined}
      />
    </MemoryRouter>
  );
  wrapper.find(Switch).props().onChange!({ target: { checked: true } } as React.ChangeEvent<HTMLInputElement>, true);
  expect(spy).toHaveBeenCalled();
});
