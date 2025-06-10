import { Handle, Position } from "reactflow";

export default function WebhookNode({ data }: any) {
  return (
    <div style={{ padding: 10, background: "#2b2b2b", color: "#fff", borderRadius: 8, border: '1px solid #555' }}>
      <strong>📥 Webhook</strong>
      <p style={{ fontSize: "0.8rem" }}>{data?.label || "Trigger event"}</p>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
