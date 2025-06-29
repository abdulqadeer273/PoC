import { Handle, Position } from "reactflow";

export default function WebhookNode({ data, id }: any) {
  const handleDelete = () => {
    data?.onDelete?.(id);
  };

  return (
    <div className="p-3 bg-blue-700 text-white rounded-lg border border-blue-900 shadow relative">
      <button
        onClick={handleDelete}
        className="absolute -top-2 -right-2 w-6 h-6 bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-800 rounded-full flex items-center justify-center text-xs font-bold border-2 border-gray-300 shadow-md"
        title="Delete node"
      >
        ×
      </button>
      <strong>🔔 Trigger</strong>
      <p className="text-xs mt-1">{data?.label || "Start Reminder Workflow"}</p>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
