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
    localStorage.clear();
    // Seed a saved userName so the chat gate is bypassed for the
    // "drawer behaviour" tests below. The gate itself is tested in
    // the dedicated describe block.
    localStorage.setItem('chat:userName', 'Tester');
    vi.restoreAllMocks();
  });
  afterEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('opens the drawer when the FAB is clicked and shows the welcome message', async () => {
    const user = userEvent.setup();
    renderApp();

    const fab = screen.getByRole('button', {
      name: /abrir conversa com o leobot/i,
    });
    await user.click(fab);

    const dialog = screen.getByRole('dialog', { name: /leobot/i });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    // welcome message renders inside the dialog
    expect(within(dialog).getByText(/Leonardo/i)).toBeInTheDocument();
  });

  it('focuses the textarea when opened', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(
      screen.getByRole('button', { name: /abrir conversa com o leobot/i }),
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
      screen.getByRole('button', { name: /abrir conversa com o leobot/i }),
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
      screen.getByRole('button', { name: /abrir conversa com o leobot/i }),
    );

    const closeBtn = screen.getByRole('button', { name: /fechar conversa/i });
    await user.click(closeBtn);

    const dialog = screen.getByTestId('chat-drawer');
    expect(dialog).toHaveAttribute('aria-hidden', 'true');
  });

  it('marks the drawer as inert while closed so it is not tabbable', () => {
    renderApp();
    const dialog = screen.getByTestId('chat-drawer');
    // closed by default
    expect(dialog).toHaveAttribute('aria-hidden', 'true');
    expect(dialog.hasAttribute('inert')).toBe(true);
  });

  it('restores focus to the FAB after the drawer is closed', async () => {
    const user = userEvent.setup();
    renderApp();
    const fab = screen.getByRole('button', { name: /abrir conversa com o leobot/i });
    await user.click(fab);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(fab).toHaveFocus();
  });
});

describe('ChatDrawer name gate', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    vi.restoreAllMocks();
  });
  afterEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('shows the name gate when no userName is saved', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(
      screen.getByRole('button', { name: /abrir conversa com o leobot/i }),
    );
    expect(screen.getByTestId('chat-name-gate')).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText(/pergunte algo sobre a carreira/i),
    ).not.toBeInTheDocument();
  });

  it('rejects an invalid name and surfaces the error', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(
      screen.getByRole('button', { name: /abrir conversa com o leobot/i }),
    );
    const input = screen.getByPlaceholderText(/seu primeiro nome/i);
    await user.type(input, '123');
    await user.click(screen.getByRole('button', { name: /começar/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/letras/i);
    expect(screen.getByTestId('chat-name-gate')).toBeInTheDocument();
  });

  it('saves a valid name and reveals the chat input', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(
      screen.getByRole('button', { name: /abrir conversa com o leobot/i }),
    );
    const input = screen.getByPlaceholderText(/seu primeiro nome/i);
    await user.type(input, 'Léo');
    await user.click(screen.getByRole('button', { name: /começar/i }));
    expect(screen.queryByTestId('chat-name-gate')).not.toBeInTheDocument();
    expect(localStorage.getItem('chat:userName')).toBe('Léo');
    expect(
      screen.getByPlaceholderText(/pergunte algo sobre a carreira/i),
    ).toBeInTheDocument();
  });

  it('lets the user clear the saved name and re-enter the gate', async () => {
    const user = userEvent.setup();
    localStorage.setItem('chat:userName', 'Léo');
    renderApp();
    await user.click(
      screen.getByRole('button', { name: /abrir conversa com o leobot/i }),
    );
    // The header shows a "Léo · Trocar nome" button.
    const changeBtn = screen.getByRole('button', { name: /trocar nome/i });
    await user.click(changeBtn);
    expect(screen.getByTestId('chat-name-gate')).toBeInTheDocument();
    expect(localStorage.getItem('chat:userName')).toBeNull();
  });
});
