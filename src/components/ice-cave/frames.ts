// Secuencia de 120 fotogramas de la cueva de hielo: color + mapa de
// profundidad emparejados por índice, servidos desde /public. Son la versión
// sin el logo de la plantilla original (borrado fotograma a fotograma).
export const FRAME_COUNT = 120;

const frame = (kind: "color" | "depth", i: number) =>
  `/frames/ice-cave/${kind}/${String(i).padStart(3, "0")}.jpg`;

export const COLOR_FRAMES = Array.from({ length: FRAME_COUNT }, (_, i) => frame("color", i));
export const DEPTH_FRAMES = Array.from({ length: FRAME_COUNT }, (_, i) => frame("depth", i));
