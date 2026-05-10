import { describe, it, expect } from 'vitest';
import { diagrams, diagramOrder } from './index';

describe('architecture diagrams', () => {
  for (const id of diagramOrder) {
    describe(id, () => {
      const d = diagrams[id];

      it('tem ids únicos para todos os nós', () => {
        const ids = d.nodes.map((n) => n.id);
        expect(new Set(ids).size).toBe(ids.length);
      });

      it('todos os edges referenciam nodes existentes', () => {
        const ids = new Set(d.nodes.map((n) => n.id));
        for (const e of d.edges) {
          expect(ids.has(e.source)).toBe(true);
          expect(ids.has(e.target)).toBe(true);
        }
      });

      it('cada node tem descrição PT e EN não-vazias', () => {
        for (const n of d.nodes) {
          expect(n.details.description.pt.length).toBeGreaterThan(0);
          expect(n.details.description.en.length).toBeGreaterThan(0);
          expect(n.sublabel.pt.length).toBeGreaterThan(0);
          expect(n.sublabel.en.length).toBeGreaterThan(0);
        }
      });

      it('col e row são positivos', () => {
        for (const n of d.nodes) {
          expect(n.col).toBeGreaterThanOrEqual(1);
          expect(n.row).toBeGreaterThanOrEqual(1);
        }
      });
    });
  }
});
