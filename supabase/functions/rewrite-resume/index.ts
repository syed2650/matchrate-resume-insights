import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

serve(async (req) => {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a professional resume editor. Rewrite each bullet point to be concise, measurable, and achievement-focused, in line with top-tier resume standards.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    const result = await openaiRes.json();
    const text = result?.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ result: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Resume Rewrite Error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
