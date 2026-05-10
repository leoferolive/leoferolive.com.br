import type { Diagram, DiagramId } from './types';
import { unifiedDiagram } from './unified-diagram';

export const diagrams: Record<DiagramId, Diagram> = {
  unified: unifiedDiagram,
};

export const diagramOrder: DiagramId[] = ['unified'];
