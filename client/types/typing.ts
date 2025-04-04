// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Draw = {
  ctx: CanvasRenderingContext2D;
  currentPoint: Point;
  prevPoint: Point | null;
};

type Point = { x: number; y: number };
