type StatusBarProps = {
  branch: string;
  status: string;
  lastCommit: string;
};

export function StatusBar({ branch, status, lastCommit }: StatusBarProps) {
  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-40 flex h-7 items-center justify-between border-t border-border bg-bg-surface px-4 text-text-faint text-[11px]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
      aria-label="Status"
    >
      <div className="flex gap-3">
        <span>git:({branch})</span>
        <span>{status}</span>
        <span className="hidden sm:inline">last commit: {lastCommit}</span>
      </div>
      <div className="hidden md:flex gap-3">
        <span>Curitiba/BR</span>
        <span>UTC-3</span>
        <span>LF</span>
        <span>UTF-8</span>
      </div>
    </footer>
  );
}
