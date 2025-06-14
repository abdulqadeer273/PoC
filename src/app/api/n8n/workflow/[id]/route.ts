import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { n8nApiUrl, n8nApiKey, workflow } = await req.json();
  if (!n8nApiUrl || !n8nApiKey || !workflow) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }
  try {
    const id = (await params).id;
    const res = await fetch(`${n8nApiUrl}/workflows/${id}`, {
      method: "PUT",
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const n8nApiUrl = req.nextUrl.searchParams.get("n8nApiUrl")!;
  const n8nApiKey = req.nextUrl.searchParams.get("n8nApiKey")!;
  if (!n8nApiUrl || !n8nApiKey) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }
  try {
    const id = (await params).id;
    const res = await fetch(`${n8nApiUrl}/workflows/${id}`, {
      method: "DELETE",
      headers: { "X-N8N-API-KEY": n8nApiKey },
    });
    if (!res.ok) {
      const data = await res.json();
      return NextResponse.json({ error: data.message || "n8n error" }, { status: res.status });
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}