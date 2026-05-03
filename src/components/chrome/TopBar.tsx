type TopBarProps = { breadcrumb: string };

export function TopBar({ breadcrumb }: TopBarProps) {
  return (
    <header
      className="sticky top-0 z-40 flex h-9 items-center justify-between border-b border-border bg-bg-base/90 px-4 backdrop-blur-sm"
      role="banner"
    >
      <div className="flex items-center gap-2" aria-hidden="true">
        <span className="size-2.5 rounded-full bg-[#ff5f57] opacity-70" />
        <span className="size-2.5 rounded-full bg-[#febc2e] opacity-70" />
        <span className="size-2.5 rounded-full bg-[#28c840] opacity-70" />
      </div>
      <div className="hidden text-text-muted text-xs sm:block">{breadcrumb}</div>
      <div className="rounded border border-border px-2 py-0.5 text-text-faint text-[11px]">
        ⌘K
      </div>
    </header>
  );
}
