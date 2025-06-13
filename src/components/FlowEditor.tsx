"use client";

import React, { useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Connection,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";

import Toolbar from "./Toolbar";
import WebhookNode from "./nodes/custom/WebhookNode";
import DelayNode from "./nodes/custom/DelayNode";
import ReminderNode from "./nodes/custom/ReminderNode";
import { EdgeData, NodeData, NodeType } from "@/types/flow";

const nodeTypes = {
  webhook: WebhookNode,
  delay: DelayNode,
  reminder: ReminderNode,
};

let id = 0;
const getId = () => `node_${id++}`;

const FlowEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge({ ...connection, type: "default" }, eds)),
    [setEdges]
  );

  const handleAddNode = (type: NodeType) => {
    const newNode: Node = {
      id: getId(),
      type: type.toLowerCase() as NodeType,
      position: {
        x: Math.random() * 300,
        y: Math.random() * 300,
      },
      data: { label: `${type} Node` },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  // Convert ReactFlow types to your custom types for the Toolbar
  const convertedNodes: NodeData[] = nodes.map((node) => ({
    id: node.id,
    type: node.type as NodeType,
    data: node.data,
    position: node.position,
  }));

  const convertedEdges: EdgeData[] = edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: typeof edge.label === "string" ? edge.label : undefined,
  }));

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactFlowProvider>
        <Toolbar
          onAddNode={handleAddNode}
          nodes={convertedNodes}
          edges={convertedEdges}
        />
        <div style={{ height: "calc(100% - 50px)" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default FlowEditor;
