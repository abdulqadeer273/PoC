"use client";
import { useEffect, useMemo, useState } from "react";
import { Model, slk } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/survey-core.min.css";
import { createClient } from "@supabase/supabase-js";

// Activate your SurveyJS license
slk("YOUR_LICENSE_KEY"); // Replace with your actual license key

// Supabase config
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-supabase-url.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const surveyJson = {
  title: "Contact Form",
  elements: [
    { name: "email", title: "Email", type: "text", inputType: "email", isRequired: true },
    { name: "name", title: "Name", type: "text", isRequired: true },
    { name: "phone", title: "Phone", type: "text", inputType: "tel" },
    { name: "message", title: "Message", type: "comment" }
  ]
};

export default function SurveyPage() {
  const [status, setStatus] = useState<null | string>(null);
  const survey = useMemo(() => new Model(surveyJson), []);

  // Save progress on every change
  useEffect(() => {
    survey.onValueChanged.add(async (sender, options) => {
      // Save partial data to Supabase
      await supabase
        .from("survey_responses")
        .upsert([{ ...sender.data, completed: false }], { onConflict: "email" });
    });

    survey.onComplete.add(async (sender) => {
      // Mark as completed in Supabase
      await supabase
        .from("survey_responses")
        .upsert([{ ...sender.data, completed: true }], { onConflict: "email" });
    });
  }, [survey]);

  return (
    <main style={{ maxWidth: 600, margin: "2rem auto" }}>
      {status && <div>{status}</div>}
      <Survey model={survey} />
    </main>
  );
}