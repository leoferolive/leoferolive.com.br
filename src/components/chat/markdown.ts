/**
 * Minimal, dependency-free markdown to HTML for chat messages.
 *
 * Supports: bold (`**x**`), italic (`*x*` / `_x_`), inline code (`` `x` ``),
 * links (`[label](url)`), unordered lists (`- ` / `* `), ordered lists
 * (`1. `), and paragraphs separated by blank lines. All HTML in the input
 * is escaped first so untrusted assistant output cannot inject markup.
 */

const escapeMap: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => escapeMap[c] ?? c);
}

function renderInline(text: string): string {
  let out = escapeHtml(text);
  out = out.replace(
    /`([^`]+)`/g,
    (_m, code: string) =>
      `<code class="rounded bg-bg-elevated px-1 py-0.5 text-[0.95em]">${code}</code>`,
  );
  out = out.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    (_m, label: string, href: string) => {
      if (!/^(https?:|mailto:)/i.test(href)) return label;
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-accent underline-offset-2 hover:underline">${label}</a>`;
    },
  );
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  out = out.replace(/(^|[^_\w])_([^_\n]+)_/g, '$1<em>$2</em>');
  return out;
}

interface Block {
  kind: 'p' | 'ul' | 'ol';
  lines: string[];
}

// eslint-disable-next-line complexity -- TODO(quality-gate): refatorar até 2026-08-11
export function renderMarkdown(src: string): string {
  if (!src) return '';
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let current: Block | null = null;

  const flush = () => {
    if (current) {
      blocks.push(current);
      current = null;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (line.trim() === '') {
      flush();
      continue;
    }
    const ulMatch = /^\s*[-*]\s+(.*)$/.exec(line);
    const olMatch = /^\s*\d+\.\s+(.*)$/.exec(line);
    if (ulMatch) {
      if (!current || current.kind !== 'ul') {
        flush();
        current = { kind: 'ul', lines: [] };
      }
      current.lines.push(ulMatch[1]);
      continue;
    }
    if (olMatch) {
      if (!current || current.kind !== 'ol') {
        flush();
        current = { kind: 'ol', lines: [] };
      }
      current.lines.push(olMatch[1]);
      continue;
    }
    if (!current || current.kind !== 'p') {
      flush();
      current = { kind: 'p', lines: [] };
    }
    current.lines.push(line);
  }
  flush();

  return blocks
    .map((b) => {
      if (b.kind === 'p') {
        return `<p>${renderInline(b.lines.join(' '))}</p>`;
      }
      const tag = b.kind === 'ul' ? 'ul' : 'ol';
      const items = b.lines.map((l) => `<li>${renderInline(l)}</li>`).join('');
      const cls = tag === 'ul' ? 'list-disc' : 'list-decimal';
      return `<${tag} class="${cls} pl-5 space-y-1">${items}</${tag}>`;
    })
    .join('');
}
