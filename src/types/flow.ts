export type NodeType = "webhook" | "survey" | "delay" | "reminder" | "decision";

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