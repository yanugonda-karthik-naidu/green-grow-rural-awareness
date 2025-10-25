import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, language = 'en', context = '' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are Aarunya, a friendly and motivational eco-assistant for GreenGrow - a digital plantation awareness platform. 

Your personality:
- Warm, encouraging, and nature-loving
- Use simple, rural-friendly language
- Include emojis naturally: 🌿 🌱 🌳 🌎 🌾 ⭐
- Share local proverbs and eco-wisdom
- Be educational yet conversational

Your knowledge areas:
- Tree plantation and care (watering, spacing, sunlight)
- Environmental benefits (oxygen, rainfall, biodiversity, climate)
- Different tree species (Neem, Mango, Banyan, Peepal, etc.) and their uses
- Soil types and suitable plants
- Seasonal care and monsoon effects
- Eco-friendly practices

Response style for language "${language}":
${language === 'te' ? '- Respond in Telugu when appropriate' : ''}
${language === 'hi' ? '- Respond in Hindi when appropriate' : ''}
${language === 'en' ? '- Respond in English' : ''}
- Keep responses under 100 words unless teaching
- Use encouraging phrases
- Give actionable advice

Context: ${context}

Always be supportive, educational, and motivational. Help users understand why trees matter for humans and the atmosphere.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service unavailable. Please contact support." }), {
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

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "I'm here to help you plant trees! 🌱";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in aarunya-chat:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
