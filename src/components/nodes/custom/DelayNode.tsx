import { Handle, Position } from "reactflow";
import { useState, useEffect } from "react";

const units = [
  { label: "Seconds", value: "seconds" },
  { label: "Minutes", value: "minutes" },
  { label: "Hours", value: "hours" },
  { label: "Days", value: "days" },
];

export default function DelayNode({ data, id }: any) {
  const [time, setTime] = useState(data?.time || 1);
  const [unit, setUnit] = useState(data?.unit || "minutes");

  const handleDelete = () => {
    data?.onDelete?.(id);
  };

  // Update node data when input changes
  useEffect(() => {
    data.onChange?.({ time, unit });
    // eslint-disable-next-line
  }, [time, unit]);

  return (
    <div className="p-3 bg-yellow-100 text-yellow-900 rounded-lg border border-yellow-400 shadow min-w-[180px] relative">
      <button
        onClick={handleDelete}
        className="absolute -top-2 -right-2 w-6 h-6 bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-800 rounded-full flex items-center justify-center text-xs font-bold border-2 border-gray-300 shadow-md"
        title="Delete node"
      >
        ×
      </button>
      <strong>⏳ Delay</strong>
      <div className="mt-2 flex items-center gap-2">
        <input
          type="number"
          min={1}
          value={time}
          onChange={e => setTime(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-16 px-2 py-1 rounded border border-yellow-300 text-yellow-900 bg-white text-xs"
        />
        <select
          value={unit}
          onChange={e => setUnit(e.target.value)}
          className="px-2 py-1 rounded border border-yellow-300 text-yellow-900 bg-white text-xs"
        >
          {units.map(u => (
            <option key={u.value} value={u.value}>{u.label}</option>
          ))}
        </select>
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
