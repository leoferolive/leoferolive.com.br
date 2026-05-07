import { LanguageToggle } from './LanguageToggle';
import { SectionNav } from './SectionNav';

type TopBarProps = { breadcrumb: string };

export function TopBar({ breadcrumb }: TopBarProps) {
  return (
    <header
      className="sticky top-0 z-40 border-b border-border bg-bg-base/90 backdrop-blur-sm"
      role="banner"
    >
      <div className="flex h-9 items-center justify-between px-4">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#ff5f57] opacity-70" />
          <span className="size-2.5 rounded-full bg-[#febc2e] opacity-70" />
          <span className="size-2.5 rounded-full bg-[#28c840] opacity-70" />
        </div>
        <div className="hidden text-text-muted text-xs sm:block">{breadcrumb}</div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <div className="hidden md:block rounded border border-border px-2 py-0.5 text-text-faint text-[11px]">
            ⌘K
          </div>
        </div>
      </div>
      <SectionNav />
    </header>
  );
}
