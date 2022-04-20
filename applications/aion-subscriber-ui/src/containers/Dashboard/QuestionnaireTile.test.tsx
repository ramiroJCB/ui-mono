import * as React from 'react';
import { QuestionnaireTileContainer } from './QuestionnaireTile';
import { CircularProgress } from '@pec/aion-ui-components/components/CircularProgress';
import { ErrorIcon } from '@pec/aion-ui-components/components/ErrorIcon';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { mount } from 'enzyme';
import { QuestionnaireSectionStatus } from '@pec/aion-ui-core/interfaces/questionnaireSection';

const { Complete, Incomplete, Untouched } = QuestionnaireSectionStatus;

it('renders a loading spinner right away', () => {
  const wrapper = mount(
    <FakeStoreAndRouter state={{ options: {}, questionnaireSections: { isFetching: true } }}>
      <QuestionnaireTileContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.find(CircularProgress)).toHaveLength(1);
});

it('renders a list of non-complete sections by default', () => {
  const wrapper = mount(
    <FakeStoreAndRouter
      state={{
        options: {},
        questionnaireSections: {
          questionnaireSections: [
            {
              id: 1,
              status: Complete
            },
            {
              id: 2,
              status: Incomplete
            },
            {
              id: 3,
              status: Untouched
            }
          ]
        }
      }}
    >
      <QuestionnaireTileContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.find('nav a')).toHaveLength(2);
});

it('renders a list of all sections if the checkbox is checked', () => {
  const wrapper = mount(
    <FakeStoreAndRouter
      state={{
        options: { questionnaireTileShowCompletedSections: true },
        questionnaireSections: {
          questionnaireSections: [
            {
              id: 1,
              status: Complete
            },
            {
              id: 2,
              status: Incomplete
            },
            {
              id: 3,
              status: Untouched
            }
          ]
        }
      }}
    >
      <QuestionnaireTileContainer />
    </FakeStoreAndRouter>
  );
  wrapper.find('input[type="checkbox"]').simulate('click');
  expect(wrapper.find('nav a')).toHaveLength(3);
});

it('renders a message if all sections are complete ', () => {
  const wrapper = mount(
    <FakeStoreAndRouter
      state={{
        options: {},
        questionnaireSections: {
          questionnaireSections: [
            {
              id: 1,
              status: Complete
            }
          ]
        }
      }}
    >
      <QuestionnaireTileContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.find('h1').text()).toBe('✓');
});

it('renders an error message if there was an error fetching', () => {
  const wrapper = mount(
    <FakeStoreAndRouter state={{ options: {}, questionnaireSections: { error: true } }}>
      <QuestionnaireTileContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.find(ErrorIcon)).toHaveLength(1);
});
