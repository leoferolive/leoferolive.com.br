import type { ProjectEntry } from '@/data/projects';
import type { Lang } from '@/i18n/types';
import { ExternalLink } from './ExternalLink';
import { Folder } from 'lucide-react';

export function ProjectCard({ project, lang }: { project: ProjectEntry; lang: Lang }) {
  return (
    <article className="rounded border border-border bg-bg-surface p-5 transition-colors hover:border-border-hover hover:bg-bg-elevated">
      <header className="mb-2 flex items-center gap-2">
        <Folder size={16} strokeWidth={1.5} className="text-text-faint" />
        <span className="text-text-faint text-[11px] uppercase tracking-wider">
          {project.type}
        </span>
        <h3 className="font-bold text-text-primary">{project.name}</h3>
      </header>
      <p className="text-sm text-text-muted">{project.description[lang]}</p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {project.stack.map((s) => (
          <li
            key={s}
            className="rounded border border-border px-2 py-0.5 text-[11px] text-text-faint"
          >
            {s}
          </li>
        ))}
      </ul>
      {project.builtWith && (
        <p className="mt-2 text-[11px] text-text-faint">built with: {project.builtWith}</p>
      )}
      {(project.link || project.demo) && (
        <div className="mt-3 flex flex-col gap-1 text-sm">
          {project.link && (
            <ExternalLink href={project.link} className="text-accent hover:underline">
              code · {project.link.replace('https://', '')} →
            </ExternalLink>
          )}
          {project.demo && (
            <ExternalLink href={project.demo} className="text-accent hover:underline">
              demo · {project.demo.replace('https://', '')} →
            </ExternalLink>
          )}
        </div>
      )}
    </article>
  );
}
