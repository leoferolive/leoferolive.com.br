import { Fragment, memo, type CSSProperties } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { ArchNode, HandlePos } from '@/data/architecture/types';
import type { Lang } from '@/i18n/types';

export type ClusterCardData = {
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

function ClusterCardImpl({ data, selected }: NodeProps) {
  const { archNode, lang } = data as ClusterCardData;
  const stateClass = selected
    ? 'border-accent shadow-[0_0_24px_-4px_color-mix(in_srgb,var(--color-accent)_45%,transparent)]'
    : 'border-accent/30';

  return (
    <div
      className={[
        'pointer-events-none relative h-full w-full rounded-lg border border-dashed bg-[color-mix(in_srgb,var(--color-accent)_2.5%,transparent)] transition-colors',
        stateClass,
      ].join(' ')}
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
      <div className="pointer-events-auto absolute -top-3 left-4 flex items-center gap-2 rounded bg-bg-base px-2 py-0.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
          {archNode.label}
        </span>
        <span className="text-[10px] text-text-muted">{archNode.sublabel[lang]}</span>
      </div>
    </div>
  );
}

export const ClusterCard = memo(ClusterCardImpl);
