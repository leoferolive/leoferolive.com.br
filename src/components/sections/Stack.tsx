import { useT } from '@/i18n/useT';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StackGroup } from '@/components/ui/StackGroup';
import { BotHandoff } from '@/components/ui/BotHandoff';
import { stack } from '@/data/stack';

export function Stack() {
  const t = useT();
  return (
    <section id="stack" className="py-16 md:py-24">
      <SectionHeader
        id="stack-title"
        caption={t.stack.caption}
        title={t.stack.title}
        subtitle={t.stack.subtitle}
      />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stack.map((g) => (
          <StackGroup key={g.id} group={g} />
        ))}
      </div>
      <div className="mt-6">
        <BotHandoff label={t.botHandoff.stackLabel} seed={t.botHandoff.stackSeed} />
      </div>
    </section>
  );
}
