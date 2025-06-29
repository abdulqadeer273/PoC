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
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { useCallback, useState } from "react";

const nodeTypes = {
  webhook: WebhookNode,
  delay: DelayNode,
  reminder: ReminderNode,
};

// Custom edge with delete button
const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd }: any) => {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <button
            onClick={onEdgeClick}
            style={{
              width: 20,
              height: 20,
              background: '#ff5050',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '12px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
            title="Delete connection"
          >
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

const edgeTypes = {
  default: CustomEdge,
};

let id = 0;
const getId = () => `node_${id++}`;

const FlowEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showModal, setShowModal] = useState(false);
  const [workflowName, setWorkflowName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [nameError, setNameError] = useState("");
  const n8nApiKey = process.env.NEXT_PUBLIC_N8N_API_KEY; // User can set this
  const n8nApiUrl = process.env.NEXT_PUBLIC_N8N_URL;

  // Connect nodes handler
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
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

  // Helper to update node data by id
  const updateNodeData = useCallback(
    (id: string, newData: any) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id ? { ...node, data: { ...node.data, ...newData } } : node
        )
      );
    },
    [setNodes]
  );

  // Helper to delete a node by id
  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    },
    [setNodes, setEdges]
  );

  // Save workflow to Supabase
  const saveWorkflowToSupabase = async (name: string) => {
    try {
      const res = await fetch("/api/supabase/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
        }),
      });
      
      // If it's a duplicate key error, that's fine - just continue
      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.error && errorData.error.includes("duplicate key value")) {
          console.log(`Workflow name "${name}" already exists in Supabase, skipping save.`);
          return true; // Return true to continue with n8n creation
        }
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error saving workflow to Supabase:", error);
      return true; // Continue with n8n creation even if Supabase fails
    }
  };

  // When adding a node, inject the onChange handler
  const onAddNode = (type: keyof typeof nodeTypes) => {
    const id = `node_${nodes.length}`;
    setNodes((nds) => [
      ...nds,
      {
        id: getId(),
        type,
        position: {
          x: 250 + Math.random() * 100,
          y: 100 + Math.random() * 100,
        },
        data: {
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
          onChange: (newData: any) => updateNodeData(id, newData),
        },
      },
    ]);
  };

  // When rendering, always inject the onChange and onDelete handlers into each node's data
  const nodesWithOnChange = nodes.map((node) => ({
  ...node,
  data: {
    ...node.data,
    onChange: (newData: any) => updateNodeData(node.id, newData),
    onDelete: (nodeId: string) => deleteNode(nodeId),
  },
}));

  // Show modal to get workflow name
  const handleCreateN8nWorkflow = () => {
    if (!n8nApiKey || !n8nApiUrl) {
      alert("Please enter your n8n API URL and API Key.");
      return;
    }
    
    if (nodes.length === 0) {
      alert("Please add some nodes to your workflow first.");
      return;
    }
    
    setShowModal(true);
    setWorkflowName("");
    setNameError("");
  };

  // Validate and create workflow
  const validateAndCreateWorkflow = async () => {
    if (!workflowName.trim()) {
      setNameError("Workflow name is required");
      return;
    }

    setIsCreating(true);
    setNameError("");

    try {
      // Create the workflow (no need to check for duplicates)
      await createWorkflowInN8n(workflowName.trim());
    } catch (error) {
      console.error("Error creating workflow:", error);
      alert("Failed to create workflow. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  // Actual n8n workflow creation
  const createWorkflowInN8n = async (name: string) => {

    const n8nNodes = nodes.map((n) => {
      if (n.type === "webhook") {
        return {
          parameters: {},
          id: n.id,
          name: n.data.label || "Webhook Node",
          type: "n8n-nodes-base.start",
          typeVersion: 1,
          position: [n.position.x, n.position.y],
        };
      }
      if (n.type === "delay") {
        console.log("Delay Node Data:", n.data);
        return {
          parameters: {
            unit: n.data.unit, // e.g. "seconds", "minutes", etc.
            amount:n.data.time,
          },
          id: n.id,
          name: n.data.label || "Delay",
          webhookId: n.data.webhookId || "",
          notesInFlow: false,
          type: "n8n-nodes-base.wait",
          typeVersion: 1,
          executeOnce: false,
          alwaysOutputData: false,
          retryOnFail: false,
          maxTries: 0,
          waitBetweenTries: 0,
          position: [n.position.x, n.position.y],
        };
      }
      if (n.type === "reminder") {
        console.log("Reminder Node Data:", n.data);
        return {
          parameters: {
            requestMethod: "POST",
            url: n.data.url,
            options: {},
          },
          id: n.id,
          name: n.data.label || "Reminder",
          webhookId: "",
          notesInFlow: false,
          type: "n8n-nodes-base.httpRequest",
          typeVersion: 1,
          executeOnce: false,
          alwaysOutputData: false,
          retryOnFail: false,
          maxTries: 0,
          waitBetweenTries: 0,
          position: [n.position.x, n.position.y],
        };
      }
      // ...other node types if needed
    });

    const n8nWorkflow = {
      name: name,
      nodes: n8nNodes,
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

    // Save to Supabase first (skip if duplicate)
    const saved = await saveWorkflowToSupabase(name);
    if (!saved) {
      alert("Failed to save workflow locally. Please try again.");
      return;
    }

    // Then create in n8n
    const res = await fetch("/api/n8n/workflow", {
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
      alert(`Workflow "${name}" saved locally and created successfully in n8n!`);
      console.log("n8n workflow created successfully:", data);
      setShowModal(false);
      setWorkflowName("");
    } else {
      alert(
        `Workflow "${name}" was saved locally but failed to create in n8n: ` + (data.error || "Unknown error")
      );
    }
  };

  return (
    <ReactFlowProvider>
      <div style={{ height: "100vh", width: "100vw" }}>
        <Toolbar
          onAddNode={onAddNode}
          onCreateN8nWorkflow={handleCreateN8nWorkflow}
        />
        <ReactFlow
          nodes={nodesWithOnChange}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
        >
          <Background />
        </ReactFlow>

        {/* Workflow Name Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 border border-gray-200">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Create Workflow</h2>
              <div className="mb-4">
                <label htmlFor="workflowName" className="block text-sm font-medium text-gray-700 mb-2">
                  Workflow Name
                </label>
                <input
                  id="workflowName"
                  type="text"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                  placeholder="Enter workflow name"
                  disabled={isCreating}
                />
                {nameError && (
                  <p className="text-red-500 text-sm mt-1">{nameError}</p>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setWorkflowName("");
                    setNameError("");
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  onClick={validateAndCreateWorkflow}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  disabled={isCreating}
                >
                  {isCreating ? "Creating..." : "Create Workflow"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ReactFlowProvider>
  );
};

export default FlowEditor;
