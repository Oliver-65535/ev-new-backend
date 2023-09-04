export type IGraph = IGraphArray[];

export interface IGraphArray {
  head: string;
  meta: IMeta;
  tail: string;
  type: string;
}

export interface IMeta {
  spans: number[][];
}
