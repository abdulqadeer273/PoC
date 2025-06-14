import { Handle, Position } from "reactflow";
import { useState, useEffect } from "react";

export default function ReminderNode({ data, id }: any) {
  const [url, setUrl] = useState(data?.url || "");

  useEffect(() => {
    data.onChange?.({ url });
    // eslint-disable-next-line
  }, [url]);

  return (
    <div className="p-3 bg-red-100 text-red-900 rounded-lg border border-red-400 shadow min-w-[220px]">
      <strong>📧 Reminder</strong>
      <div className="mt-2">
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="Enter POST URL"
          className="w-full px-2 py-1 rounded border border-red-300 text-red-900 bg-white text-xs"
        />
      </div>
      <p className="text-xs mt-1">POST request will be sent</p>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
