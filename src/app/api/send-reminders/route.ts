import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const transporter = nodemailer.createTransport({
  service: "gmail", // or your preferred SMTP service
  auth: {
    user: process.env.NEXT_PUBLIC_SMTP_USER!,
    pass: process.env.NEXT_PUBLIC_SMTP_PASS!,
  },
});

export async function POST() {
  const { data: partials, error } = await supabase.from("partial_surveys").select("*");
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  const results = [];
  for (const user of partials || []) {
    if (!user.email) continue;
    try {
      await transporter.sendMail({
        from: `"Survey Reminder" <${process.env.NEXT_PUBLIC_SMTP_USER}>`,
        to: user.email,
        subject: "Please complete your survey",
        text: `Hi${user.name ? " " + user.name : ""},\n\nPlease complete your survey at: https://${process.env.NEXT_PUBLIC_APP_URL}/survey\n\nThank you!`,
      });
      results.push({ email: user.email, status: "sent" });
    } catch (e: any) {
      results.push({ email: user.email, status: "failed", error: e.message });
    }
  }
  return NextResponse.json({ success: true, results });
}