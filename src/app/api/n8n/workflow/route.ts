import { NextRequest, NextResponse } from "next/server";

async function getWorkflowByName(
  n8nApiUrl: string,
  n8nApiKey: string,
  name: string
) {
  const res = await fetch(`${n8nApiUrl}/workflows`, {
    headers: { "X-N8N-API-KEY": n8nApiKey },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch workflows");
  return (data?.data || data).find((w: any) => w.name === name);
}

export async function POST(req: NextRequest) {
  const { n8nApiUrl, n8nApiKey, workflow } = await req.json();
  if (!n8nApiUrl || !n8nApiKey || !workflow) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }
  try {
    // Check for existing workflow by name
    const existing = await getWorkflowByName(
      n8nApiUrl,
      n8nApiKey,
      workflow.name
    );
    if (existing) {
      // Update existing workflow
      const res = await fetch(`${n8nApiUrl}/workflows/${existing.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-N8N-API-KEY": n8nApiKey,
        },
        body: JSON.stringify(workflow),
      });
      const data = await res.json();
      if (!res.ok) {
        return NextResponse.json(
          { error: data.message || "n8n error" },
          { status: res.status }
        );
      }
      return NextResponse.json({
        success: true,
        updated: true,
        workflow: data,
      });
    } else {
      // Create new workflow
      const res = await fetch(`${n8nApiUrl}/workflows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-N8N-API-KEY": n8nApiKey,
        },
        body: JSON.stringify(workflow),
      });
      const data = await res.json();
      if (!res.ok) {
        return NextResponse.json(
          { error: data.message || "n8n error" },
          { status: res.status }
        );
      }
      return NextResponse.json({
        success: true,
        created: true,
        workflow: data,
      });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const n8nApiUrl = req.nextUrl.searchParams.get("n8nApiUrl")!;
  const n8nApiKey = req.nextUrl.searchParams.get("n8nApiKey")!;
  if (!n8nApiUrl || !n8nApiKey) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }
  try {
    const res = await fetch(`${n8nApiUrl}/workflows`, {
      headers: { "X-N8N-API-KEY": n8nApiKey },
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || "n8n error" },
        { status: res.status }
      );
    }
    return NextResponse.json({
      success: true,
      workflows: data.workflows || data,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
