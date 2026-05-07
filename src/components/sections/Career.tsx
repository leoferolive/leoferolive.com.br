import { useT } from '@/i18n/useT';
import { useI18n } from '@/i18n/context';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PromptLine } from '@/components/ui/PromptLine';
import { CareerEntryDetailed } from '@/components/ui/CareerEntryDetailed';
import { CareerEntryLine } from '@/components/ui/CareerEntryLine';
import { BotHandoff } from '@/components/ui/BotHandoff';
import { career } from '@/data/career';

export function Career() {
  const t = useT();
  const { lang } = useI18n();

  const detailed = career.filter((c) => c.kind === 'detailed');
  const lines = career.filter((c) => c.kind === 'line');

  return (
    <section id="career" className="py-16 md:py-24">
      <SectionHeader
        id="career-title"
        caption={t.career.caption}
        title={t.career.title}
        subtitle={t.career.subtitle}
      />
      <div className="space-y-3">
        <PromptLine command="cat ~/career/" />
        {detailed.map((entry) => (
          <CareerEntryDetailed
            key={entry.id}
            entry={entry}
            lang={lang}
            defaultExpandedMobile={entry.id === 'wiley'}
          />
        ))}
        <div className="pl-4">
          <BotHandoff
            label={t.botHandoff.careerCouncilLabel}
            seed={t.botHandoff.careerCouncilSeed}
          />
        </div>
        {lines.map((entry) => (
          <CareerEntryLine key={entry.id} entry={entry} lang={lang} />
        ))}
        <div className="pl-4 pt-1">
          <BotHandoff
            label={t.botHandoff.careerEarlyLabel}
            seed={t.botHandoff.careerEarlySeed}
          />
        </div>
      </div>
    </section>
  );
}
