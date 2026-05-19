import React from 'react';
import { render, screen } from '@testing-library/react';
import { AggregationBar } from './AggregationBar';

describe('AggregationBar', () => {
  it('renders without crashing', () => {
    render(<AggregationBar />);
    expect(screen.getByText('AggregationBar placeholder')).toBeInTheDocument();
  });
});
