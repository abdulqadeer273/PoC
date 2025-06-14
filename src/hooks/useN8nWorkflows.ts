import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

export function useN8nWorkflows(n8nApiUrl: string, n8nApiKey: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // List all workflows, filtered by Supabase
  const listWorkflows = async () => {
    setLoading(true);
    setError(null);

    // 1. Fetch workflow names from Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: supaData, error: supaError } = await supabase
      .from("workflows")
      .select("name");
    if (supaError) {
      setLoading(false);
      setError(supaError.message);
      return [];
    }
    const supabaseNames = (supaData || []).map((row) => row.name);

    // 2. Fetch all workflows from n8n
    const res = await fetch(
      `/api/n8n/workflow?n8nApiUrl=${encodeURIComponent(n8nApiUrl)}&n8nApiKey=${encodeURIComponent(
        n8nApiKey
      )}`
    );
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Failed to fetch workflows");
      return [];
    }
    // 3. Filter n8n workflows by Supabase names
    // First, filter out archived workflows
    const activeWorkflows = (data.workflows?.data || []).filter(
      (wf: any) => wf.isArchived === false
    );
    // Then, filter by names from Supabase
    return activeWorkflows.filter((wf: any) => supabaseNames.includes(wf.name));
  };

  // Create or update by name
  const createOrUpdateWorkflow = async (workflow: any) => {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/n8n/workflow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ n8nApiUrl, n8nApiKey, workflow }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) setError(data.error || "Failed to create/update workflow");
    return data;
  };

  // Update by ID
  const updateWorkflow = async (id: string, workflow: any) => {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/n8n/workflow/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ n8nApiUrl, n8nApiKey, workflow }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) setError(data.error || "Failed to update workflow");
    return data;
  };

  // Delete by ID
  const deleteWorkflow = async (id: string) => {
    setLoading(true);
    setError(null);
    const res = await fetch(
      `/api/n8n/workflow/${id}?n8nApiUrl=${encodeURIComponent(n8nApiUrl)}&n8nApiKey=${encodeURIComponent(
        n8nApiKey
      )}`,
      { method: "DELETE" }
    );
    const data = await res.json();
    setLoading(false);
    if (!res.ok) setError(data.error || "Failed to delete workflow");
    return data;
  };

  return {
    loading,
    error,
    listWorkflows,
    createOrUpdateWorkflow,
    updateWorkflow,
    deleteWorkflow,
  };
}