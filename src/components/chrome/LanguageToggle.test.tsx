import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { I18nProvider } from '@/i18n/context';
import { LanguageToggle } from './LanguageToggle';

function LocationProbe() {
  const loc = useLocation();
  return <div data-testid="loc">{loc.pathname}</div>;
}

describe('LanguageToggle', () => {
  it('clicar troca de PT (/) para EN (/en)', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <I18nProvider lang="pt">
          <LanguageToggle />
          <LocationProbe />
        </I18nProvider>
      </MemoryRouter>,
    );
    await user.click(screen.getByRole('button', { name: /Trocar idioma/i }));
    expect(screen.getByTestId('loc')).toHaveTextContent('/en');
  });
});
