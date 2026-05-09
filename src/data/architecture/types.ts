import type { Lang } from '@/i18n/types';

export type LocalizedString = { pt: string; en: string };

export type NodeKind =
  | 'Deployment'
  | 'StatefulSet'
  | 'DaemonSet'
  | 'CronJob'
  | 'Service'
  | 'External'
  | 'Pod';

export type NodeDetails = {
  description: LocalizedString;
  technical?: {
    version?: string;
    namespace?: string;
    kind?: NodeKind;
    replicas?: number;
    resources?: { requests?: string; limits?: string };
    port?: number | string;
    storage?: string;
  };
  decisions?: LocalizedString[];
  links?: { label: LocalizedString; href: string }[];
};

export type NodeKindUI = 'card' | 'cluster';

export type ArchNode = {
  id: string;
  label: string;
  sublabel: LocalizedString;
  iconSlug: string;
  iconColorOverride?: string;
  col: number;
  row: number;
  offsetX?: number;
  offsetY?: number;
  width?: number;
  height?: number;
  type?: NodeKindUI;
  highlight?: boolean;
  details: NodeDetails;
};

export type EdgeVariant = 'data' | 'control' | 'observability';

export type HandlePos = 'top' | 'right' | 'bottom' | 'left';

export type ArchEdge = {
  id?: string;
  source: string;
  target: string;
  sourceHandle?: HandlePos;
  targetHandle?: HandlePos;
  label?: LocalizedString;
  animated?: boolean;
  variant?: EdgeVariant;
};

export type DiagramId = 'unified';

export type Diagram = {
  id: DiagramId;
  title: LocalizedString;
  caption: LocalizedString;
  nodes: ArchNode[];
  edges: ArchEdge[];
};

export const pickLocalized = (value: LocalizedString, lang: Lang) => value[lang];
