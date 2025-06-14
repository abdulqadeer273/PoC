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

  // Update node data when input changes
  useEffect(() => {
    data.onChange?.({ time, unit });
    // eslint-disable-next-line
  }, [time, unit]);

  return (
    <div className="p-3 bg-yellow-100 text-yellow-900 rounded-lg border border-yellow-400 shadow min-w-[180px]">
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
