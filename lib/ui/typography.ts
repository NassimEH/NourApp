/** Multiplicateur de line-height pour corps de texte (lisibilité) */
export const BODY_LINE_HEIGHT = 1.45;

export function bodyLineHeight(fontSize: number): number {
  return Math.round(fontSize * BODY_LINE_HEIGHT);
}
