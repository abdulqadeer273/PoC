"use client";

import { simulateFlow } from "@/lib/executeFlow";
import { NodeData, EdgeData, NodeType } from "@/types/flow";
import React from "react";

type ToolbarProps = {
  onAddNode: (type: NodeType) => void;
  nodes: NodeData[];
  edges: EdgeData[];
};

const Toolbar: React.FC<ToolbarProps> = ({ onAddNode, nodes, edges }) => {
  const nodeTypes: NodeType[] = ["webhook", "survey", "delay", "reminder", "decision"];

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
        onClick={() => simulateFlow(nodes, edges)}
        style={{
          marginLeft: "1rem",
          padding: "0.4rem 1rem",
          background: "#3c3c3c",
          color: "#fff",
          border: "1px solid #555",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        ▶️ Run Flow
      </button>
    </div>
  );
};

export default Toolbar;