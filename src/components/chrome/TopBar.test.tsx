import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nProvider } from '@/i18n/context';
import { TopBar } from './TopBar';

describe('TopBar', () => {
  it('renderiza traffic lights, breadcrumb e hint ⌘K', () => {
    render(
      <MemoryRouter>
        <I18nProvider lang="pt">
          <TopBar breadcrumb="~/leoferolive/portfolio" />
        </I18nProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText('~/leoferolive/portfolio')).toBeInTheDocument();
    expect(screen.getByText('⌘K')).toBeInTheDocument();
  });
});
