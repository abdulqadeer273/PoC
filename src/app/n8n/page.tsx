"use client";
import { useEffect, useState } from "react";
import { useN8nWorkflows } from "@/hooks/useN8nWorkflows";

export default function N8nWorkflowsPage() {
  const [n8nApiUrl, setN8nApiUrl] = useState(
    process.env.NEXT_PUBLIC_N8N_URL || ""
  );
  const [n8nApiKey, setN8nApiKey] = useState(
    process.env.NEXT_PUBLIC_N8N_API_KEY || ""
  );
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [refresh, setRefresh] = useState(0);

  const {
    loading,
    error,
    listWorkflows,
    createOrUpdateWorkflow,
    deleteWorkflow,
  } = useN8nWorkflows(n8nApiUrl, n8nApiKey);

  useEffect(() => {
    if (n8nApiUrl && n8nApiKey) {
      listWorkflows().then(setWorkflows);
    }
    // eslint-disable-next-line
  }, [n8nApiUrl, n8nApiKey, refresh]);
  const handleCreate = async () => {
    const name = prompt("Workflow name?");
    if (!name) return;
    const workflow = {
      name,
      nodes: [],
      connections: {},
      settings: {},
      staticData: null,
    };
    await createOrUpdateWorkflow(workflow);
    setRefresh((r) => r + 1);
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this workflow?")) return;
    await deleteWorkflow(id);
    setRefresh((r) => r + 1);
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">n8n Workflows</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <table className="w-full border mt-4 rounded-lg overflow-hidden shadow">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-3 border-b font-semibold text-blue-900 text-left">
              Name
            </th>
            <th className="p-3 border-b font-semibold text-blue-900 text-left">
              ID
            </th>
            <th className="p-3 border-b font-semibold text-blue-900 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {workflows.map((wf) => (
            <tr key={wf.id} className="hover:bg-blue-50 transition hover:text-black">
              <td className="p-3 border-b">{wf.name}</td>
              <td className="p-3 border-b">{wf.id}</td>
              <td className="p-3 border-b">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  onClick={() => handleDelete(wf.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
