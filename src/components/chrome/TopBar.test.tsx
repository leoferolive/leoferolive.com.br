import { render, screen } from '@testing-library/react';
import { TopBar } from './TopBar';

describe('TopBar', () => {
  it('renderiza traffic lights, breadcrumb e hint ⌘K', () => {
    render(<TopBar breadcrumb="~/leoferolive/portfolio" />);
    expect(screen.getByText('~/leoferolive/portfolio')).toBeInTheDocument();
    expect(screen.getByText('⌘K')).toBeInTheDocument();
  });
});
