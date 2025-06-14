import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { n8nApiUrl, n8nApiKey, workflow } = await req.json();

  if (!n8nApiUrl || !n8nApiKey || !workflow) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
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
      return NextResponse.json({ error: data.message || "n8n error" }, { status: res.status });
    }
    return NextResponse.json({ success: true, workflow: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}