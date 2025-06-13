import { Handle, Position } from "reactflow";

export default function ReminderNode({ data }: any) {
  return (
    <div className="p-3 bg-red-100 text-red-900 rounded-lg border border-red-400 shadow">
      <strong>📧 Reminder</strong>
      <p className="text-xs mt-1">{data?.label || "Send reminder emails to incomplete surveys"}</p>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
