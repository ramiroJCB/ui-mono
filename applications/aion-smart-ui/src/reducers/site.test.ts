import { contacts } from '../../fixtures/contacts';
import { reducer } from './site';
import { sites } from '../../fixtures/sites';
import { workers } from '../../fixtures/workers';

const state = {
  isFetching: false,
  isDeleting: false,
  site: sites[0],
  error: null
};

it('adds new contacts', () => {
  expect(
    reducer(state, {
      type: 'ADD_CONTACT_SUCCESS',
      payload: contacts[0]
    }).site.numContacts
  ).toBe(5);
});

it('removes deleted contacts', () => {
  expect(
    reducer(state, {
      type: 'DELETE_CONTACT_SUCCESS',
      contactId: contacts[0].id
    }).site.numContacts
  ).toBe(3);
});

it('adds workers who have been checked in and live on site', () => {
  expect(
    reducer(state, {
      type: 'UPDATE_WORKER_SUCCESS',
      payload: workers[2],
      workersOffset: 1
    }).site.numWorkersOnSite
  ).toBe(19);
});

it('adds workers who are injured and live on site', () => {
  expect(
    reducer(state, {
      type: 'UPDATE_WORKER_SUCCESS',
      payload: workers[4],
      workersOffset: 1
    }).site.numWorkersOnSite
  ).toBe(19);
});

it('adds workers who have been rejected but live on site', () => {
  expect(
    reducer(state, {
      type: 'UPDATE_WORKER_SUCCESS',
      payload: workers[6],
      workersOffset: 1
    }).site.numWorkersOnSite
  ).toBe(19);
});

it('removes workers who have been checked out and do not live on site', () => {
  expect(
    reducer(state, {
      type: 'UPDATE_WORKER_SUCCESS',
      payload: workers[7],
      workersOffset: -1
    }).site.numWorkersOnSite
  ).toBe(17);
});

it('ignores workers who are injured and do not live on site', () => {
  expect(
    reducer(state, {
      type: 'UPDATE_WORKER_SUCCESS',
      payload: workers[15],
      workersOffset: 0
    }).site.numWorkersOnSite
  ).toBe(18);
});
