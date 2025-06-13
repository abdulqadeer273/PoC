"use client";
import { useEffect, useMemo, useState } from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/survey-core.min.css";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const surveyJson = {
  title: "Contact Form",
  elements: [
    {
      name: "email",
      title: "Email",
      type: "text",
      inputType: "email",
      isRequired: true,
      placeholder: "Enter your email"
    },
    {
      name: "name",
      title: "Name",
      type: "text",
      isRequired: true,
      placeholder: "Enter your name"
    },
    {
      name: "phone",
      title: "Phone",
      type: "text",
      inputType: "tel",
      placeholder: "Enter your phone number"
    },
    {
      name: "message",
      title: "Message",
      type: "comment",
      placeholder: "Type your message"
    }
  ]
};

export default function SurveyPage() {
  const [status, setStatus] = useState<null | string>(null);
  const survey = useMemo(() => new Model(surveyJson), []);

  useEffect(() => {
    survey.onValueChanged.add(async (sender) => {
      if (sender.data.email) {
        await supabase
          .from("partial_surveys")
          .upsert([{ ...sender.data }], { onConflict: "email" });
      }
    });

    survey.onComplete.add(async (sender) => {
      if (sender.data.email && sender.data.name && sender.data.phone && sender.data.message) {
        await supabase
          .from("completed_surveys")
          .upsert([{ ...sender.data }], { onConflict: "email" });
        await supabase
          .from("partial_surveys")
          .delete()
          .eq("email", sender.data.email);
        setStatus("Survey completed and saved!");
      } else {
        setStatus("Please fill all fields to complete the survey.");
      }
    });
  }, [survey]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center py-8">
      <div className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Contact Survey</h1>
        {status && (
          <div
            className={`mb-4 text-center rounded px-4 py-2 ${
              status.includes("completed")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status}
          </div>
        )}
        <div className="surveyjs-form">
          <Survey model={survey} />
        </div>
      </div>
    </div>
  );
}