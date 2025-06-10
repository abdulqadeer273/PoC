import { mockSurveyCheck } from "./surveyApi";
import { mockSendReminder } from "./reminderApi";

type NodeType = "webhook" | "delay" | "survey" | "reminder" | "decision";

type NodeData = {
  id: string;
  type: NodeType;
  data: any;
};

type EdgeData = {
  source: string;
  target: string;
};

export async function simulateFlow(nodes: NodeData[], edges: EdgeData[]) {
  const getNextNode = (id: string): NodeData | undefined => {
    const edge = edges.find((e) => e.source === id);
    return edge ? nodes.find((n) => n.id === edge.target) : undefined;
  };

  let current = nodes.find((n) => n.type === "webhook");

  if (!current) {
    console.warn("No webhook node found to start flow.");
    return;
  }

  let completed = false;

  while (current && !completed) {
    console.log(`🧩 Processing node: ${current.type}`);

    switch (current.type) {
      case "delay":
        console.log(`⏱ Waiting for ${current.data?.delay || 2} seconds...`);
        await new Promise((res) => setTimeout(res, (current!.data?.delay || 2) * 1000));
        break;

      case "survey":
        const formUrl = current.data?.formUrl || "https://fake-form.surveyjs.io";
        completed = await mockSurveyCheck(formUrl);
        break;

      case "reminder":
        mockSendReminder({
          email: current.data?.email || "demo@example.com",
          phone: current.data?.phone || "+1234567890",
          message: current.data?.message || "Please complete the survey!",
        });
        break;

      case "decision":
        const deadline = new Date(current.data?.deadline || Date.now() + 3600 * 1000);
        if (Date.now() > deadline.getTime()) {
          console.log("🛑 Deadline passed, stopping flow.");
          return;
        }
        break;
    }

    if (!completed) {
      current = getNextNode(current.id);
    } else {
      console.log("✅ Survey completed. Flow ends.");
    }
  }

  if (!current) {
    console.log("🏁 Flow finished.");
  }
}