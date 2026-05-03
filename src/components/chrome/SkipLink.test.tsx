import { render, screen } from '@testing-library/react';
import { SkipLink } from './SkipLink';

describe('SkipLink', () => {
  it('rende link "Pular para conteúdo" apontando para #main', () => {
    render(<SkipLink label="Pular para conteúdo" />);
    const link = screen.getByRole('link', { name: 'Pular para conteúdo' });
    expect(link).toHaveAttribute('href', '#main');
  });
});
