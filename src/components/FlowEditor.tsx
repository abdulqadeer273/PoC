"use client";

import Toolbar from "./Toolbar";
import WebhookNode from "./nodes/custom/WebhookNode";
import DelayNode from "./nodes/custom/DelayNode";
import ReminderNode from "./nodes/custom/ReminderNode";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { NodeData } from "@/types/flow";

const nodeTypes = {
  webhook: WebhookNode,
  delay: DelayNode,
  reminder: ReminderNode,
};

let id = 0;
const getId = () => `node_${id++}`;

const FlowEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const n8nApiKey=process.env.NEXT_PUBLIC_N8N_API_KEY;// User can set this
  const n8nApiUrl = process.env.NEXT_PUBLIC_N8N_URL;
  // Add node handler
  interface CustomNodeData {
    label: string;
  }

  interface CustomNode {
    id: string;
    type: keyof typeof nodeTypes;
    position: { x: number; y: number };
    data: CustomNodeData;
  }

  const onAddNode = (type: keyof typeof nodeTypes) => {
    setNodes((nds) => [
      ...nds,
      {
        id: getId(),
        type,
        position: {
          x: 250 + Math.random() * 100,
          y: 100 + Math.random() * 100,
        },
        data: { label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node` },
      },
    ]);
  };

  // n8n Create Workflow Handler
  const handleCreateN8nWorkflow = async () => {
    if (!n8nApiKey || !n8nApiUrl) {
      alert("Please enter your n8n API URL and API Key.");
      return;
    }
    // Example: Map ReactFlow nodes to n8n workflow JSON
    const n8nWorkflow = {
      name: "POC Workflow",
      nodes: nodes.map((n) => ({
        parameters: {},
        id: n.id,
        name: n.data.label || n.type,
        type:
          n.type === "webhook"
            ? "n8n-nodes-base.start"
            : n.type === "delay"
            ? "n8n-nodes-base.wait"
            : n.type === "reminder"
            ? "n8n-nodes-base.httpRequest" // or your custom node type
            : "n8n-nodes-base.noOp",
        typeVersion: 1,
        position: [n.position.x, n.position.y],
      })),
      connections: edges.reduce((acc, edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        const targetNode = nodes.find((n) => n.id === edge.target);
        if (!sourceNode || !targetNode) return acc;
        acc[sourceNode.data.label || sourceNode.type] = {
          main: [
            [
              {
                node: targetNode.data.label || targetNode.type,
                type: "main",
                index: 0,
              },
            ],
          ],
        };
        return acc;
      }, {} as Record<string, any>),
      settings: {
        saveExecutionProgress: true,
        saveManualExecutions: true,
        saveDataErrorExecution: "all",
        saveDataSuccessExecution: "all",
        executionTimeout: 3600,
        errorWorkflow: "VzqKEW0ShTXA5vPj",
        timezone: "America/New_York",
        executionOrder: "v1",
      },
      staticData: { lastId: 1 },
    };

    const res = await fetch("/api/n8n/create-workflow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        n8nApiUrl,
        n8nApiKey,
        workflow: n8nWorkflow,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("POC Workflow created in n8n!");
      console.log("n8n workflow created successfully:", data);
    } else {
      alert(
        "Failed to create workflow in n8n: " + (data.error || "Unknown error")
      );
    }
  };

  return (
    <ReactFlowProvider>
      <div style={{ height: "100vh", width: "100vw" }}>
        <Toolbar
          onAddNode={onAddNode}
          nodes={nodes.filter(
            (n): n is NodeData =>
              typeof n.type === "string" && n.type !== undefined
          )}
          edges={edges.map((e) => ({
            ...e,
            label: typeof e.label === "string" ? e.label : undefined,
          }))}
          onCreateN8nWorkflow={handleCreateN8nWorkflow}
        />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

export default FlowEditor;
