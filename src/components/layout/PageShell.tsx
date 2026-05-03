import { TopBar } from '@/components/chrome/TopBar';
import { StatusBar } from '@/components/chrome/StatusBar';
import { SkipLink } from '@/components/chrome/SkipLink';
import type { ReactNode } from 'react';

type PageShellProps = {
  children: ReactNode;
  skipLabel: string;
  breadcrumb: string;
  branch: string;
  status: string;
  lastCommit: string;
};

export function PageShell({
  children,
  skipLabel,
  breadcrumb,
  branch,
  status,
  lastCommit,
}: PageShellProps) {
  return (
    <>
      <SkipLink label={skipLabel} />
      <TopBar breadcrumb={breadcrumb} />
      <main id="main" className="mx-auto max-w-5xl px-6 pb-16 lg:px-8">
        {children}
      </main>
      <StatusBar branch={branch} status={status} lastCommit={lastCommit} />
    </>
  );
}
