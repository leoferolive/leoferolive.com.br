import { render, screen } from '@testing-library/react';
import { StatusBar } from './StatusBar';

describe('StatusBar', () => {
  it('renderiza branch e status na esquerda', () => {
    render(<StatusBar branch="main" status="✓ deployed" lastCommit="2h ago" />);
    expect(screen.getByText(/main/)).toBeInTheDocument();
    expect(screen.getByText(/deployed/)).toBeInTheDocument();
  });
});
