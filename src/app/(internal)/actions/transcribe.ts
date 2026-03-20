"use server";

import { createClient } from "@/lib/supabase/server";

export async function transcribeAudio(formData: FormData): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    throw new Error("No audio file provided");
  }

  const apiKey = process.env.AQUAVOICE_API_KEY;
  if (!apiKey) throw new Error("AQUAVOICE_API_KEY is not configured");

  const body = new FormData();
  body.append("file", file);
  body.append("model", "avalon-v1-en");

  const res = await fetch(
    "https://api.aquavoice.com/api/v1/audio/transcriptions",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body,
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Transcription failed: ${text}`);
  }

  const data = await res.json();
  return data.text;
}
