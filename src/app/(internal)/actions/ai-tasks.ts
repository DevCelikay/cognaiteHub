"use server";

import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { refresh } from "next/cache";

const anthropic = new Anthropic();

export async function aiCreateTasks(
  text: string,
  projectId: string | null
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Break the following text into individual, actionable tasks. Each task should be a clear, concise title (one line, no numbering).

Text:
${text}

Respond with ONLY a JSON array of strings, no markdown, no explanation:
["Task one", "Task two", "Task three"]`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response");

  let titles: string[];
  try {
    titles = JSON.parse(content.text);
  } catch {
    throw new Error("Failed to parse AI response");
  }

  if (!Array.isArray(titles) || titles.length === 0) {
    throw new Error("No tasks found in text");
  }

  const rows = titles.map((title) => ({
    user_id: user.id,
    title,
    project_id: projectId,
  }));

  const { error } = await supabase.from("tasks").insert(rows);
  if (error) throw new Error(error.message);

  refresh();

  return titles;
}
