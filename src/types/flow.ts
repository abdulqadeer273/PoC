export type NodeType = "webhook" | "delay" | "reminder";

export interface NodeData {
  id: string;
  type: NodeType;
  data: any;
  position: { x: number; y: number };
}

export interface EdgeData {
  id: string;
  source: string;
  target: string;
  label?: string;
}