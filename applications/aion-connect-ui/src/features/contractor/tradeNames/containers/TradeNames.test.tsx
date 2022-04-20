import * as fixtures from '../../../../../fixtures';
import * as React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Typography from '@material-ui/core/Typography';
import { AddTradeNameContainer } from 'features/contractor/tradeName/containers/AddTradeName';
import { ConfirmDelete } from 'components/ConfirmDelete';
import { Error } from '@pec/aion-ui-components/components/Error';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { initialState as profileInitialState } from '../../profile/reducer';
import { initialState as tradeNamesInitialState } from '../reducer';
import { initialState as organizationInitialState } from '@pec/aion-ui-core/reducers/organization';
import { initialState as userInfoInitialState } from '@pec/aion-ui-core/reducers/userInfo';
import { ITradeName } from 'interfaces/tradeName';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { mount } from 'enzyme';
import { RootState } from 'combineReducers';
import { Route } from 'react-router-dom';
import { TradeNamesContainer } from './TradeNames';

const { organizations, tradeNames, userInfo, error } = fixtures;
const organization = organizations[2];
const tradeName = tradeNames[0];
const axiosMock = new MockAdapter(axios);
const state = {
  organization: { ...organizationInitialState, organization },
  userInfo: { ...userInfoInitialState, userInfo },
  tradeNames: tradeNamesInitialState,
  profile: profileInitialState
};

beforeEach(() => {
  axiosMock.onGet(`/api/v3.01/organizations(${organization.id})/tradeNames`).reply(200, tradeNames);
  axiosMock.onPost('/spapi/errors').reply(200);
});

describe('trade names container', () => {
  it('renders an error message if there was an error fetching', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, tradeNames: { ...tradeNamesInitialState, error } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={TradeNamesContainer} />
      </FakeStoreAndRouter>
    );

    expect(wrapper.contains(<Error message="There was an error processing your request." />)).toBe(true);
  });

  it('renders an some trade names', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, tradeNames: { ...tradeNamesInitialState, tradeNames } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={TradeNamesContainer} />
      </FakeStoreAndRouter>
    );

    expect(
      wrapper
        .find('td')
        .at(0)
        .text()
    ).toEqual(tradeName.name);
  });

  it('shows an message when they add 5 trade names', () => {
    const fiveTradeNames: ITradeName[] = [];

    for (let i = 0; i <= 10; i++) {
      fiveTradeNames.push(tradeName);
    }

    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, tradeNames: { ...tradeNamesInitialState, tradeNames: fiveTradeNames } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={TradeNamesContainer} />
      </FakeStoreAndRouter>
    );

    expect(
      wrapper
        .find(Typography)
        .at(2)
        .text()
    ).toEqual('Trade name amount of 5 has been exceeded.');
  });

  it('deletes a trade name', () => {
    axiosMock.onDelete(`/api/v3.01/organizations(${organization.id})/tradeNames(${tradeName.id})`).reply(200);

    const axiosSpy = jest.spyOn(axios, 'delete');
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, tradeNames: { ...tradeNamesInitialState, tradeNames } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={TradeNamesContainer} />
      </FakeStoreAndRouter>
    );

    wrapper
      .find(ConfirmDelete)
      .at(0)
      .simulate('click');

    wrapper.find(LoadingButton).simulate('click');

    expect(axiosSpy).toHaveBeenCalledWith(`/api/v3.01/organizations(${organization.id})/tradeNames(${tradeName.id})`);
  });

  it('does not render the add trade name container if viewAsClient is true', () => {
    const wrapper = mount(
      <FakeStoreAndRouter<Partial<RootState>>
        state={{ ...state, profile: { ...profileInitialState, viewAsClient: true } }}
        initialEntries={[`/organization/${organization.id}/connect/profile`]}
      >
        <Route path="/organization/:organizationId/connect/profile" component={TradeNamesContainer} />
      </FakeStoreAndRouter>
    );

    expect(wrapper.contains(<AddTradeNameContainer />)).toBeFalsy();
  });
});
