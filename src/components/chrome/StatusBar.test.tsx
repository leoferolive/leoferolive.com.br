import { render, screen } from '@testing-library/react';
import { StatusBar } from './StatusBar';

describe('StatusBar', () => {
  it('renderiza o leftLabel', () => {
    render(<StatusBar leftLabel="✓ open to remote · UTC-3 office hours" />);
    expect(screen.getByText('✓ open to remote · UTC-3 office hours')).toBeInTheDocument();
  });
});
