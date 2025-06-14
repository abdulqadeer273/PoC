"use client";

import { useCallback } from "react";
import { useStore } from "reactflow";
import { NodeData, EdgeData, NodeType } from "@/types/flow";

type ToolbarProps = {
  onAddNode: (type: NodeType) => void;
  nodes: NodeData[];
  edges: EdgeData[];
  onCreateN8nWorkflow: () => void;
};

const Toolbar: React.FC<ToolbarProps> = ({
  onAddNode,
  nodes,
  edges,
  onCreateN8nWorkflow,
}) => {
  // Access nodes and edges from React Flow store
  const nodesFromStore = useStore((state) => state.getNodes());
  const edgesFromStore = useStore((state) => state.edges);

  // Helper to find the next node by edge
  const getNextNode = (currentId: string) => {
    const edge = edgesFromStore.find((e) => e.source === currentId);
    if (!edge) return null;
    return nodesFromStore.find((n) => n.id === edge.target);
  };

  const runWorkflow = useCallback(async () => {
    // 1. Find the webhook node (start)
    const webhookNode = nodesFromStore.find((n) => n.type === "webhook");
    if (!webhookNode) {
      alert("No webhook (trigger) node found.");
      return;
    }

    // 2. Check if webhook is connected to delay
    const delayNode = getNextNode(webhookNode.id);
    if (!delayNode || delayNode.type !== "delay") {
      alert("Webhook node must be connected to a Delay node.");
      return;
    }

    // 3. Check if delay is connected to reminder
    const reminderNode = getNextNode(delayNode.id);
    if (!reminderNode || reminderNode.type !== "reminder") {
      alert("Delay node must be connected to a Reminder node.");
      return;
    }

    // 4. Run the workflow
    alert("Workflow started!");

    // Delay logic
    const delayMinutes = delayNode.data?.minutes || 1;
    await new Promise((res) => setTimeout(res, delayMinutes * 60 * 1000));

    // Call reminder endpoint
    const resp = await fetch("/api/send-reminders", { method: "POST" });
    if (resp.ok) {
      alert("Reminders sent!");
    } else {
      alert("Failed to send reminders.");
    }
  }, [nodesFromStore, edgesFromStore]);

  const nodeTypes: NodeType[] = ["webhook", "delay", "reminder"];

  return (
    <div
      style={{
        padding: "0.75rem",
        background: "#1e1e1e",
        display: "flex",
        gap: "0.5rem",
        borderBottom: "1px solid #333",
      }}
    >
      {nodeTypes.map((type) => (
        <button
          key={type}
          onClick={() => onAddNode(type)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border: "1px solid #555",
            background: "#2b2b2b",
            color: "#fff",
            fontWeight: "500",
            cursor: "pointer",
            transition: "background 0.2s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#3c3c3c")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#2b2b2b")}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={onCreateN8nWorkflow}
      >
        Create n8n Workflow
      </button>
      <button
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        onClick={runWorkflow}
      >
        Run Workflow
      </button>
    </div>
  );
};

export default Toolbar;
