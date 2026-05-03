type SkipLinkProps = { label: string };

export function SkipLink({ label }: SkipLinkProps) {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-bg-elevated focus:px-3 focus:py-2 focus:text-accent"
    >
      {label}
    </a>
  );
}
