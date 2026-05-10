import { Fragment, memo, type CSSProperties } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Box } from 'lucide-react';
import { getIcon } from './icons';
import type { ArchNode, HandlePos } from '@/data/architecture/types';
import type { Lang } from '@/i18n/types';
import { NODE_HEIGHT, NODE_WIDTH } from '@/data/architecture/grid';

export type NodeCardData = {
  archNode: ArchNode;
  lang: Lang;
};

const HANDLE_STYLE: CSSProperties = {
  background: 'transparent',
  border: 0,
  width: 1,
  height: 1,
  opacity: 0,
  pointerEvents: 'none',
};

const HANDLE_POSITIONS: Record<HandlePos, Position> = {
  top: Position.Top,
  right: Position.Right,
  bottom: Position.Bottom,
  left: Position.Left,
};

function NodeCardImpl({ data, selected }: NodeProps) {
  const { archNode, lang } = data as NodeCardData;
  const icon = getIcon(archNode.iconSlug);
  const colorOverride = archNode.iconColorOverride;
  const fill = colorOverride ?? (icon ? `#${icon.hex}` : 'currentColor');

  const stateClass = selected
    ? 'border-accent shadow-[0_0_0_2px_var(--color-accent)]'
    : archNode.highlight
      ? 'border-accent shadow-[0_0_0_1px_var(--color-accent)]'
      : 'border-border hover:border-border-hover';

  return (
    <div
      className={[
        'flex h-full w-full items-center gap-2.5 rounded border bg-bg-surface px-3 py-2 transition-[box-shadow,border-color] duration-150',
        stateClass,
      ].join(' ')}
      style={{ width: NODE_WIDTH, height: NODE_HEIGHT }}
    >
      {(['top', 'right', 'bottom', 'left'] as const).map((pos) => (
        <Fragment key={pos}>
          <Handle
            id={pos}
            type="target"
            position={HANDLE_POSITIONS[pos]}
            style={HANDLE_STYLE}
          />
          <Handle
            id={pos}
            type="source"
            position={HANDLE_POSITIONS[pos]}
            style={HANDLE_STYLE}
          />
        </Fragment>
      ))}
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded bg-bg-elevated"
        aria-hidden="true"
      >
        {icon ? (
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill={fill}
          >
            <title>{icon.title}</title>
            <path d={icon.path} />
          </svg>
        ) : (
          <Box size={18} strokeWidth={1.5} className="text-text-muted" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-bold leading-tight text-text-primary">
          {archNode.label}
        </p>
        <p className="truncate text-[11px] leading-tight text-text-muted">
          {archNode.sublabel[lang]}
        </p>
      </div>
    </div>
  );
}

export const NodeCard = memo(NodeCardImpl);
