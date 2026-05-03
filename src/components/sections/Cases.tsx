import { useT } from '@/i18n/useT';
import { useI18n } from '@/i18n/context';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CaseCard } from '@/components/ui/CaseCard';
import { cases } from '@/data/cases';

export function Cases() {
  const t = useT();
  const { lang } = useI18n();

  return (
    <section id="cases" className="py-16 md:py-24">
      <SectionHeader
        id="cases-title"
        caption={t.cases.caption}
        title={t.cases.title}
        subtitle={t.cases.subtitle}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {cases.map((c) => (
          <CaseCard key={c.id} caseEntry={c} lang={lang} />
        ))}
      </div>
    </section>
  );
}
