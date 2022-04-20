import * as React from 'react';
import createMemoryHistory from 'history/createMemoryHistory';
import { QuestionnaireContainer } from './';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { mount } from 'enzyme';

it('renders without crashing', () => {
  const wrapper = mount(
    <FakeStoreAndRouter
      state={{
        userInfo: { userInfo: { activities: { Organizations: [] } } },
        questionnaireSections: { isFetching: true },
        organizations: { isFetching: true },
        organization: { isFetching: true },
        options: { isLoaded: true }
      }}
    >
      <QuestionnaireContainer
        history={createMemoryHistory()}
        match={{
          params: {
            organizationId: '750aaa27-7588-41e0-995c-cdd008285bb2',
            questionnaireSectionId: '25'
          }
        }}
      />
    </FakeStoreAndRouter>
  );
  expect(wrapper.children().length).toBeGreaterThan(0);
});
