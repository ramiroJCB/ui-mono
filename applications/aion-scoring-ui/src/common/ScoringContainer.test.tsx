import React from 'react';
import { renderWithProviders, screen } from '../utils/test-utils';
import { ScoringContainer } from './ScoringContainer';

describe('Scoring container component', () => {
  it('renders the correct header', () => {
    renderWithProviders(<ScoringContainer />, { initialState: {} });

    expect(screen.getByText('SSQ Scoring System')).toBeTruthy();
  });
  it('renders the correct number of tabs', () => {
    renderWithProviders(<ScoringContainer />, { initialState: {} });

    expect(screen.getAllByRole('tab')).toHaveLength(4);
  });
});
