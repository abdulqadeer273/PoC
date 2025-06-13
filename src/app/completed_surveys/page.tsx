"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CompletedSurveysPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("completed_surveys")
      .select("*")
      .then(({ data }) => setData(data || []));
  }, []);

  return (
    <main className="max-w-4xl mx-auto my-8 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Completed Surveys</h1>
      {data.length === 0 ? (
        <div className="text-center text-gray-500">No completed surveys found.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th
                    key={key}
                    className="px-4 py-2 border-b bg-gray-100 text-left text-sm font-semibold text-gray-700"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {Object.values(row).map((value, i) => (
                    <td
                      key={i}
                      className="px-4 py-2 border-b text-sm text-gray-800"
                    >
                      {typeof value === "string" || typeof value === "number"
                        ? value
                        : JSON.stringify(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}