type StatusBarProps = {
  leftLabel: string;
};

export function StatusBar({ leftLabel }: StatusBarProps) {
  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-40 flex h-7 items-center justify-between border-t border-border bg-bg-surface px-4 text-text-faint text-[11px]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
      aria-label="Status"
    >
      <div>{leftLabel}</div>
      <div className="hidden md:flex gap-3">
        <span>Curitiba/BR</span>
        <span>UTC-3</span>
        <span>LF</span>
        <span>UTF-8</span>
      </div>
    </footer>
  );
}
