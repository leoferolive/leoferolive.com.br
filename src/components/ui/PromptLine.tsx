type PromptLineProps = { command: string };

export function PromptLine({ command }: PromptLineProps) {
  return (
    <div className="font-mono text-text-muted">
      <span className="text-text-faint">~</span>{' '}
      <span className="text-accent">$</span>{' '}
      <span className="text-text-primary">{command}</span>
    </div>
  );
}
