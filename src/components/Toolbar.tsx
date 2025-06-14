"use client";

const nodeTypes = ["webhook", "delay", "reminder"] as const;
type NodeType = typeof nodeTypes[number];

type ToolbarProps = {
  onAddNode: (type: NodeType) => void;
  onCreateN8nWorkflow: () => void;
};

export default function Toolbar({
  onAddNode,
  onCreateN8nWorkflow,
}: ToolbarProps) {
  return (
    <div className="flex flex-wrap gap-2 p-2 bg-gray-800 border-b border-gray-700 items-center justify-start md:justify-start">
      <div className="flex flex-wrap gap-2">
        {nodeTypes.map((type) => (
          <button
            key={type}
            onClick={() => onAddNode(type)}
            className="px-3 py-1 rounded bg-gray-700 text-white font-medium hover:bg-blue-700 transition text-xs md:text-sm"
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
        <button
          className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs md:text-sm"
          onClick={onCreateN8nWorkflow}
        >
          Create n8n Workflow
        </button>
      </div>
    </div>
  );
}
