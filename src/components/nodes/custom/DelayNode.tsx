import { Handle, Position } from "reactflow";

export default function DelayNode({ data }: any) {
  return (
    <div className="p-3 bg-yellow-100 text-yellow-900 rounded-lg border border-yellow-400 shadow">
      <strong>⏳ Delay</strong>
      <p className="text-xs mt-1">{data?.label || `Wait ${data?.minutes || 1} minutes`}</p>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
