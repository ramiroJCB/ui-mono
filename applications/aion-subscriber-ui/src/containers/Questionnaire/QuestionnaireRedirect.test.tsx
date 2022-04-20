import * as React from 'react';
import { QuestionnaireRedirectContainer } from './QuestionnaireRedirect';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { mount } from 'enzyme';

it('renders without crashing', () => {
  const wrapper = mount(
    <FakeStoreAndRouter
      state={{
        userInfo: { userInfo: { activities: { Organizations: [] } } },
        options: {},
        questionnaireSections: { isFetching: true },
        organizations: { isFetching: true },
        organization: { isFetching: true }
      }}
    >
      <QuestionnaireRedirectContainer />
    </FakeStoreAndRouter>
  );
  expect(wrapper.children().length).toBeGreaterThan(0);
});
