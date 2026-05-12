import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NodeDrawer } from './NodeDrawer';
import { I18nProvider } from '@/i18n/context';
import type { ArchNode } from '@/data/architecture/types';

const mockNode: ArchNode = {
  id: 'x',
  label: 'TestNode',
  sublabel: { pt: 'pt-sub', en: 'en-sub' },
  iconSlug: '',
  col: 1,
  row: 1,
  details: {
    description: { pt: 'descrição teste', en: 'test description' },
    technical: { kind: 'Deployment', namespace: 'ns', port: 8080 },
    decisions: [{ pt: 'decisão pt', en: 'decision en' }],
  },
};

function renderDrawer(onClose = vi.fn()) {
  return render(
    <I18nProvider lang="pt">
      <NodeDrawer node={mockNode} onClose={onClose} />
    </I18nProvider>,
  );
}

describe('NodeDrawer', () => {
  it('renderiza descrição e detalhes técnicos', () => {
    renderDrawer();
    expect(screen.getByText('TestNode')).toBeInTheDocument();
    expect(screen.getByText('descrição teste')).toBeInTheDocument();
    expect(screen.getByText('decisão pt')).toBeInTheDocument();
    expect(screen.getByText('ns')).toBeInTheDocument();
    expect(screen.getByText('8080')).toBeInTheDocument();
  });

  it('chama onClose ao clicar no botão fechar', () => {
    const onClose = vi.fn();
    renderDrawer(onClose);
    fireEvent.click(screen.getByRole('button', { name: /fechar/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('chama onClose ao apertar Escape', () => {
    const onClose = vi.fn();
    renderDrawer(onClose);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('nada renderiza quando node é null', () => {
    const { container } = render(
      <I18nProvider lang="pt">
        <NodeDrawer node={null} onClose={() => {}} />
      </I18nProvider>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
