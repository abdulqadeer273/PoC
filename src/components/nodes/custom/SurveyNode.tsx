import { Handle, Position } from "reactflow";

export default function SurveyNode({ data }: any) {
  return (
    <div style={{ padding: 10, background: "#2b2b2b", color: "#fff", borderRadius: 8, border: '1px solid #555' }}>
      <strong>📝 Survey</strong>
      <p style={{ fontSize: "0.8rem" }}>{data?.label || "Check survey completion"}</p>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
