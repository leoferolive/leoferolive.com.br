export const COL_WIDTH = 400;
export const ROW_HEIGHT = 210;
export const NODE_WIDTH = 200;
export const NODE_HEIGHT = 80;
export const FIT_VIEW_PADDING = 0.12;
export const FIT_VIEW_MAX_ZOOM = 1.3;
const ORIGIN = { x: 80, y: 80 };

export const positionFor = (col: number, row: number, offsetX = 0, offsetY = 0) => ({
  x: ORIGIN.x + (col - 1) * COL_WIDTH + offsetX,
  y: ORIGIN.y + (row - 1) * ROW_HEIGHT + offsetY,
});
