type SectionHeaderProps = {
  caption: string;
  title: string;
  subtitle?: string;
  id: string;
};

export function SectionHeader({ caption, title, subtitle, id }: SectionHeaderProps) {
  return (
    <header className="mb-8">
      <p className="mb-2 text-[11px] uppercase tracking-wider text-text-faint">
        {caption}
      </p>
      <h2 id={id} className="text-3xl font-bold text-text-primary md:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-2 text-text-muted">{subtitle}</p>}
    </header>
  );
}
