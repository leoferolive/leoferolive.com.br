import { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  type Edge,
  type Node,
  type NodeMouseHandler,
  MarkerType,
} from '@xyflow/react';
import type { Diagram, ArchEdge, ArchNode, EdgeVariant } from '@/data/architecture/types';
import {
  FIT_VIEW_MAX_ZOOM,
  FIT_VIEW_PADDING,
  NODE_HEIGHT,
  NODE_WIDTH,
  positionFor,
} from '@/data/architecture/grid';
import { NodeCard } from './NodeCard';
import { ClusterCard } from './ClusterCard';
import { NodeDrawer } from './NodeDrawer';
import { ArchitectureControls } from './ArchitectureControls';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useI18n } from '@/i18n/context';
import { useT } from '@/i18n/useT';

const VARIANT_COLORS: Record<EdgeVariant, string> = {
  data: '#5eead4',
  control: '#94a3b8',
  observability: '#a78bfa',
};

const nodeTypes = { card: NodeCard, cluster: ClusterCard };

function toFlowNodes(diagram: Diagram, lang: 'pt' | 'en', selectedId: string | null): Node[] {
  return diagram.nodes.map((n) => {
    const isCluster = n.type === 'cluster';
    return {
      id: n.id,
      type: n.type ?? 'card',
      position: positionFor(n.col, n.row, n.offsetX, n.offsetY),
      data: { archNode: n, lang },
      width: n.width ?? NODE_WIDTH,
      height: n.height ?? NODE_HEIGHT,
      zIndex: isCluster ? -1 : 0,
      style: isCluster ? { pointerEvents: 'none' as const } : undefined,
      draggable: false,
      selectable: true,
      selected: n.id === selectedId,
      focusable: true,
      ariaLabel: `${n.label} — ${n.sublabel[lang]}`,
    };
  });
}

function toFlowEdges(diagram: Diagram, lang: 'pt' | 'en', reducedMotion: boolean): Edge[] {
  return diagram.edges.map((e: ArchEdge, i) => {
    const variant = e.variant ?? 'data';
    const color = VARIANT_COLORS[variant];
    return {
      id: e.id ?? `${e.source}->${e.target}-${i}`,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle ?? 'right',
      targetHandle: e.targetHandle ?? 'left',
      type: 'smoothstep',
      pathOptions: { borderRadius: 8, offset: 16 },
      label: e.label?.[lang],
      animated: reducedMotion ? false : Boolean(e.animated),
      style: {
        stroke: color,
        strokeWidth: 1.5,
        strokeDasharray: e.animated ? '6 4' : undefined,
      },
      labelStyle: { fill: 'var(--color-text-muted)', fontSize: 12 },
      labelBgStyle: { fill: 'var(--color-bg-base)' },
      labelBgPadding: [8, 4],
      labelBgBorderRadius: 4,
      markerEnd: { type: MarkerType.ArrowClosed, color, width: 14, height: 14 },
    };
  });
}

type Props = { diagram: Diagram };

export function ArchitectureCanvas({ diagram }: Props) {
  const { lang } = useI18n();
  const t = useT();
  const reducedMotion = useReducedMotion();
  const [selected, setSelected] = useState<ArchNode | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const nodes = useMemo(
    () => toFlowNodes(diagram, lang, selectedId),
    [diagram, lang, selectedId],
  );
  const edges = useMemo(
    () => toFlowEdges(diagram, lang, reducedMotion),
    [diagram, lang, reducedMotion],
  );

  const onNodeClick = useCallback<NodeMouseHandler>((_, node) => {
    const data = node.data as { archNode: ArchNode };
    setSelected(data.archNode);
    setSelectedId(node.id);
  }, []);

  const handleClose = useCallback(() => {
    setSelected(null);
    setSelectedId(null);
  }, []);

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-bg-base"
      role="region"
      aria-label={t.architecture.canvasAria(diagram.title[lang])}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        nodesDraggable={false}
        nodesConnectable={false}
        edgesFocusable={false}
        proOptions={{ hideAttribution: true }}
        fitView
        fitViewOptions={{ padding: FIT_VIEW_PADDING, maxZoom: FIT_VIEW_MAX_ZOOM }}
        minZoom={0.4}
        maxZoom={2}
        panOnScroll
        panOnScrollSpeed={0.8}
        zoomOnScroll={false}
      >
        <Background gap={24} size={1} color="var(--color-border)" />
        <ArchitectureControls />
      </ReactFlow>
      <NodeDrawer node={selected} onClose={handleClose} />
    </div>
  );
}
