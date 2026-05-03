import { useT } from '@/i18n/useT';
import { useI18n } from '@/i18n/context';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { projects } from '@/data/projects';

export function Projects() {
  const t = useT();
  const { lang } = useI18n();

  return (
    <section id="projects" className="py-16 md:py-24">
      <SectionHeader
        id="projects-title"
        caption={t.projects.caption}
        title={t.projects.title}
        subtitle={t.projects.subtitle}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} lang={lang} />
        ))}
      </div>
    </section>
  );
}
