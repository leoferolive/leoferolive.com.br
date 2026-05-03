import { useT } from '@/i18n/useT';
import { useI18n } from '@/i18n/context';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PromptLine } from '@/components/ui/PromptLine';
import { CareerEntryDetailed } from '@/components/ui/CareerEntryDetailed';
import { CareerEntryLine } from '@/components/ui/CareerEntryLine';
import { career } from '@/data/career';

export function Career() {
  const t = useT();
  const { lang } = useI18n();

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
        {career.map((entry) =>
          entry.kind === 'detailed' ? (
            <CareerEntryDetailed
              key={entry.id}
              entry={entry}
              lang={lang}
              defaultExpandedMobile={entry.id === 'wiley'}
            />
          ) : (
            <CareerEntryLine key={entry.id} entry={entry} lang={lang} />
          ),
        )}
      </div>
    </section>
  );
}
