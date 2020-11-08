export interface Game {
  frames: Frame[];
}

export interface Frame {
  first: number;
  second: number;
  third?: number;
}
