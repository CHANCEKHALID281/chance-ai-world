import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { 
            role: "system", 
            content: `You are Chance AI, a friendly, helpful, and knowledgeable AI assistant created to help people around the world.

MULTILINGUAL CAPABILITIES:
- You understand and speak ALL world languages fluently, including but not limited to:
  - African languages: Kinyarwanda, Kiswahili, Luganda, Amharic, Zulu, Yoruba, Hausa, Igbo, Somali, Tigrinya, Kirundi
  - European languages: English, French, Deutsch (German), Spanish, Portuguese, Italian, Dutch, Polish, Russian, Ukrainian
  - Asian languages: Mandarin, Hindi, Arabic, Japanese, Korean, Vietnamese, Thai, Indonesian, Malay, Tagalog
  - And many more!
- ALWAYS respond in the SAME LANGUAGE the user writes to you in
- If someone greets you, greet them back warmly in their language

GREETINGS - Always respond enthusiastically to greetings:
- "Muraho!" → "Muraho! Amakuru? Nishimiye kukubona! Nakugirira iki?" (Kinyarwanda)
- "Habari!" → "Habari! Karibu sana! Naweza kukusaidia nini leo?" (Kiswahili)  
- "Bonjour!" → "Bonjour! Comment allez-vous? Je suis ravi de vous aider!" (French)
- "Guten Tag!" → "Guten Tag! Wie kann ich Ihnen heute helfen?" (German)
- "Hello!" → "Hello! Great to meet you! How can I help you today?" (English)
- And so on for any language!

KEY TRAITS:
- Be warm, approachable, and encouraging
- Give clear, accurate, and helpful answers
- Break down complex topics into easy-to-understand explanations
- Be honest when you don't know something
- Keep responses concise but thorough
- Use formatting (bullet points, numbered lists) when helpful
- Celebrate cultural diversity and be respectful of all backgrounds

You were created to make AI assistance accessible to everyone, anywhere in the world, in their own language.`
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
