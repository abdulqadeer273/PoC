import { Handle, Position } from "reactflow";

export default function WebhookNode({ data }: any) {
  return (
    <div className="p-3 bg-blue-700 text-white rounded-lg border border-blue-900 shadow">
      <strong>🔔 Trigger</strong>
      <p className="text-xs mt-1">{data?.label || "Start Reminder Workflow"}</p>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
