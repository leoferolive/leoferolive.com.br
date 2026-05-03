import type { ReactNode } from 'react';
import { useT } from '@/i18n/useT';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PromptLine } from '@/components/ui/PromptLine';
import { CopyButton } from '@/components/ui/CopyButton';
import { ExternalLink } from '@/components/ui/ExternalLink';

const EMAIL = 'leoferolive@gmail.com';
const GITHUB_URL = 'https://github.com/leoferolive';
const LINKEDIN_URL = 'https://www.linkedin.com/in/leonardo-fer-oliveira/';

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
      <dt className="w-20 shrink-0 text-text-faint">{label}</dt>
      <dd className="text-text-primary">{children}</dd>
    </div>
  );
}

export function Contact() {
  const t = useT();
  const k = t.contact.keys;
  const v = t.contact.values;

  return (
    <section id="contact" className="py-16 md:py-24">
      <SectionHeader
        id="contact-title"
        caption={t.contact.caption}
        title={t.contact.title}
        subtitle={t.contact.subtitle}
      />
      <PromptLine command={t.contact.promptCommand.replace(/^\$ /, '')} />
      <dl className="mt-4 space-y-2 text-sm">
        <Row label={k.email}>
          <span className="mr-2">
            <a href={`mailto:${EMAIL}`} className="text-accent hover:underline">
              {EMAIL}
            </a>
          </span>
          <CopyButton
            value={EMAIL}
            ariaLabel={t.contact.copyEmailAria}
            copyLabel={t.contact.copyEmailLabel}
            copiedLabel={t.contact.copiedFeedback}
          />
        </Row>
        <Row label={k.github}>
          <ExternalLink href={GITHUB_URL} className="text-accent hover:underline">
            github.com/leoferolive
          </ExternalLink>
        </Row>
        <Row label={k.linkedin}>
          <ExternalLink href={LINKEDIN_URL} className="text-accent hover:underline">
            /in/leonardo-fer-oliveira
          </ExternalLink>
        </Row>
        <Row label={k.location}>{v.location}</Row>
        <Row label={k.education}>{v.education}</Row>
        <Row label={k.languages}>{v.languages}</Row>
      </dl>

      <footer className="mt-12 border-t border-border pt-6">
        <PromptLine command={t.contact.footerExit.replace(/^~ \$ /, '')} />
        <p className="mt-3 whitespace-pre-line text-sm text-text-faint">{t.contact.footerNote}</p>
      </footer>
    </section>
  );
}
