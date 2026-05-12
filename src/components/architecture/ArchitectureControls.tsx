import { useReactFlow } from '@xyflow/react';
import { Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { FIT_VIEW_PADDING } from '@/data/architecture/grid';
import { useT } from '@/i18n/useT';

export function ArchitectureControls() {
  const rf = useReactFlow();
  const t = useT();

  const btnClass =
    'size-8 grid place-items-center text-text-muted hover:bg-bg-elevated hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent';

  return (
    <div className="absolute bottom-4 left-4 z-20 flex flex-col overflow-hidden divide-y divide-border rounded border border-border bg-bg-surface shadow-md">
      <button
        type="button"
        onClick={() => rf.zoomIn({ duration: 150 })}
        aria-label={t.architecture.controls.zoomIn}
        className={btnClass}
      >
        <ZoomIn size={14} strokeWidth={2} />
      </button>
      <button
        type="button"
        onClick={() => rf.zoomOut({ duration: 150 })}
        aria-label={t.architecture.controls.zoomOut}
        className={btnClass}
      >
        <ZoomOut size={14} strokeWidth={2} />
      </button>
      <button
        type="button"
        onClick={() => rf.fitView({ duration: 200, padding: FIT_VIEW_PADDING })}
        aria-label={t.architecture.controls.fitView}
        className={btnClass}
      >
        <Maximize2 size={14} strokeWidth={2} />
      </button>
    </div>
  );
}
