import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nProvider } from '@/i18n/context';
import { ChatFab } from './ChatFab';

function renderApp() {
  return render(
    <I18nProvider lang="pt">
      <ChatFab />
    </I18nProvider>,
  );
}

describe('ChatFab + ChatDrawer', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });
  afterEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('opens the drawer when the FAB is clicked and shows the welcome message', async () => {
    const user = userEvent.setup();
    renderApp();

    const fab = screen.getByRole('button', {
      name: /abrir chat com ia/i,
    });
    await user.click(fab);

    const dialog = screen.getByRole('dialog', { name: /chat com ia/i });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    // welcome message renders inside the dialog
    expect(within(dialog).getByText(/Leonardo/i)).toBeInTheDocument();
  });

  it('focuses the textarea when opened', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(
      screen.getByRole('button', { name: /abrir chat com ia/i }),
    );
    const textarea = await screen.findByPlaceholderText(
      /pergunte algo sobre a carreira/i,
    );
    expect(textarea).toHaveFocus();
  });

  it('closes the drawer on Escape', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(
      screen.getByRole('button', { name: /abrir chat com ia/i }),
    );
    const dialog = screen.getByTestId('chat-drawer');
    expect(dialog).toHaveAttribute('aria-hidden', 'false');

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(dialog).toHaveAttribute('aria-hidden', 'true');
  });

  it('closes the drawer when the close button is pressed', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(
      screen.getByRole('button', { name: /abrir chat com ia/i }),
    );

    const closeBtn = screen.getByRole('button', { name: /fechar chat/i });
    await user.click(closeBtn);

    const dialog = screen.getByTestId('chat-drawer');
    expect(dialog).toHaveAttribute('aria-hidden', 'true');
  });
});
