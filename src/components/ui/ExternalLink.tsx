import type { ReactNode, AnchorHTMLAttributes } from 'react';

type ExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
};

export function ExternalLink({ children, ...rest }: ExternalLinkProps) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}
