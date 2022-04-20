import '@pec/aion-ui-i18next';
import * as React from 'react';
import * as fixtures from '@pec/aion-ui-core/fixtures';
import { CompanyProfileIncompleteContainer } from './CompanyProfileIncomplete';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { IQuestionnaireSection, QuestionnaireSectionStatus } from '@pec/aion-ui-core/interfaces/questionnaireSection';
import { mount } from 'enzyme';

const { Complete, Incomplete } = QuestionnaireSectionStatus;

it('renders nothing if questionnaire sections are not complete', () => {
  const wrapper = mount(
    <FakeStoreAndRouter state={{ questionnaireSections: { isFetching: true } }}>
      <CompanyProfileIncompleteContainer />
    </FakeStoreAndRouter>
  );

  expect(wrapper.find(CompanyProfileIncompleteContainer).isEmptyRender()).toEqual(true);
});

it('renders a message if company profile is incomplete', () => {
  const questionnaireSections: IQuestionnaireSection[] = [
    {
      id: 1,
      name: 'Company Profile',
      status: Incomplete,
      iFrameSource: '/SSQV4/SectionHandlers/CompanyProfile.aspx?embedded=true&questionSectionId=1',
      totalCommentCount: 0,
      unreadCommentCount: 0,
      isAuditSection: false
    }
  ];

  const wrapper = mount(
    <FakeStoreAndRouter state={{ questionnaireSections: { questionnaireSections } }}>
      <CompanyProfileIncompleteContainer />
    </FakeStoreAndRouter>
  );

  expect(wrapper.find('h6.primaryText').text()).toEqual('Next Step: Complete your Company Profile');
});

it('renders a message if additional company information is incomplete', () => {
  const questionnaireSections: IQuestionnaireSection[] = [
    {
      id: 1,
      name: 'Company Profile',
      status: Complete,
      iFrameSource: '/SSQV4/SectionHandlers/CompanyProfile.aspx?embedded=true&questionSectionId=1',
      totalCommentCount: 0,
      unreadCommentCount: 0,
      isAuditSection: false
    },
    {
      id: 224,
      name: 'Additional Company Information',
      status: Incomplete,
      iFrameSource: '/SSQV4/SectionHandlers/GeneralQuestions.aspx?embedded=true&questionSectionId=224',
      totalCommentCount: 0,
      unreadCommentCount: 0,
      isAuditSection: false
    }
  ];

  const wrapper = mount(
    <FakeStoreAndRouter state={{ questionnaireSections: { questionnaireSections } }}>
      <CompanyProfileIncompleteContainer />
    </FakeStoreAndRouter>
  );

  expect(wrapper.find('h6.primaryText').text()).toEqual('Next Step: Complete your Additional Company Information');
});

it('renders nothing if company profile and additional company information is complete', () => {
  const { questionnaireSections } = fixtures;
  const wrapper = mount(
    <FakeStoreAndRouter state={{ questionnaireSections: { questionnaireSections } }}>
      <CompanyProfileIncompleteContainer />
    </FakeStoreAndRouter>
  );

  expect(wrapper.find(CompanyProfileIncompleteContainer).isEmptyRender()).toEqual(true);
});
