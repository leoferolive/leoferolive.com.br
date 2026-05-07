import { useT } from '@/i18n/useT';
import { PromptLine } from '@/components/ui/PromptLine';
import { ExternalLink } from '@/components/ui/ExternalLink';
import { useTypewriter } from '@/hooks/useTypewriter';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { openChat } from '@/components/chat/openChat';
import { Github, Linkedin, Mail, MessageSquare } from 'lucide-react';

const GITHUB_URL = 'https://github.com/leoferolive';
const LINKEDIN_URL = 'https://www.linkedin.com/in/leonardo-fer-oliveira/';
const EMAIL = 'leoferolive@gmail.com';

export function Hero() {
  const t = useT();
  // Respect prefers-reduced-motion: it covers more than vestibular motion —
  // also users with attention/cognitive needs who want the page to settle
  // immediately. Reduced → tagline shown instantly. Otherwise, types at 55ms.
  const reduced = useReducedMotion();
  const tagline = useTypewriter(t.hero.tagline, { speedMs: 55, disabled: reduced });

  return (
    <section id="home" className="pt-12 pb-16 md:pt-20 md:pb-24">
      <PromptLine command={t.hero.promptCommand.replace(/^~ \$ /, '')} />
      <h1 className="mt-6 text-[44px] leading-tight font-extrabold md:text-[72px] md:leading-[1.1]">
        {t.hero.name}
      </h1>
      <p className="mt-2 text-lg text-text-muted md:text-xl">{t.hero.subtitle}</p>
      <p className="mt-6 text-base md:text-lg">
        <span className="text-accent">&gt;</span> {tagline}
        <span aria-hidden="true" className="cursor-blink ml-1 inline-block bg-text-primary text-text-primary">▊</span>
      </p>
      <p className="mt-4 text-text-muted">{t.hero.capabilities}</p>
      <p className="mt-1 text-text-faint text-sm">{t.hero.metaLine}</p>
      <p className="mt-4 max-w-2xl text-sm text-text-muted md:text-base">
        {t.hero.positioning}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <ExternalLink
          href={GITHUB_URL}
          className="inline-flex items-center gap-2 rounded border border-border px-4 py-2 hover:border-border-hover hover:bg-bg-elevated transition-colors min-h-[44px]"
        >
          <Github size={20} strokeWidth={1.5} /> {t.hero.cta.github}
        </ExternalLink>
        <ExternalLink
          href={LINKEDIN_URL}
          className="inline-flex items-center gap-2 rounded border border-border px-4 py-2 hover:border-border-hover hover:bg-bg-elevated transition-colors min-h-[44px]"
        >
          <Linkedin size={20} strokeWidth={1.5} /> {t.hero.cta.linkedin}
        </ExternalLink>
        <a
          href={`mailto:${EMAIL}`}
          className="inline-flex items-center gap-2 rounded border border-border px-4 py-2 hover:border-border-hover hover:bg-bg-elevated transition-colors min-h-[44px]"
        >
          <Mail size={20} strokeWidth={1.5} /> {t.hero.cta.email}
        </a>
        <button
          type="button"
          onClick={() => openChat()}
          aria-haspopup="dialog"
          aria-controls="chat-drawer"
          className="inline-flex items-center gap-2 rounded border border-accent/40 bg-accent/10 px-4 py-2 text-accent hover:bg-accent/20 transition-colors min-h-[44px]"
        >
          <MessageSquare size={20} strokeWidth={1.5} /> {t.hero.cta.askBot}
        </button>
      </div>
    </section>
  );
}
