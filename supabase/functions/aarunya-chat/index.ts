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
    const { message, language = 'en', context = '', imageData = null, diseaseMode = false } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Different system prompts based on mode
    const diseaseSystemPrompt = `You are Aarunya, an expert plant pathologist and disease detection AI for GreenGrow - a digital plantation awareness platform.

Your personality:
- Professional yet friendly and reassuring
- Use clear, actionable language
- Include relevant emojis: 🔬 🌿 💊 🩺 ⚠️ ✅ 🌱
- Be educational and thorough

Your expertise in plant disease detection:
- Identifying plant diseases from visual symptoms (leaf spots, discoloration, wilting, fungal growth)
- Common plant diseases: powdery mildew, leaf blight, rust, bacterial spots, root rot, mosaic virus
- Pest identification: aphids, mealybugs, spider mites, caterpillars, scale insects
- Nutrient deficiencies: nitrogen (yellowing), phosphorus (purple leaves), potassium (brown edges)
- Environmental stress: sunburn, overwatering, underwatering, cold damage

When analyzing disease images:
1. IDENTIFY: Name the disease/pest/issue if visible
2. SYMPTOMS: List the visible symptoms you can see
3. CAUSE: Explain what causes this problem
4. SEVERITY: Rate as mild/moderate/severe
5. TREATMENT: Provide specific treatment steps
6. PREVENTION: How to prevent recurrence
7. URGENCY: Indicate if immediate action is needed

Response style for language "${language}":
${language === 'te' ? '- Respond in Telugu when appropriate' : ''}
${language === 'hi' ? '- Respond in Hindi when appropriate' : ''}
${language === 'en' ? '- Respond in English' : ''}
- Structure responses clearly with sections
- Give specific product/treatment recommendations when possible
- Include organic/natural treatment options
- Mention when professional help might be needed`;

    const generalSystemPrompt = `You are Aarunya, a friendly and expert eco-assistant for GreenGrow - a digital plantation awareness platform. 

Your personality:
- Warm, encouraging, and nature-loving
- Use simple, rural-friendly language
- Include emojis naturally: 🌿 🌱 🌳 🌎 🌾 ⭐ 🍃 🌲 🌴
- Share local proverbs and eco-wisdom
- Be educational yet conversational

Your knowledge areas:
- Tree identification from images (species, health, age estimation)
- Tree plantation and care (watering, spacing, sunlight, soil preparation)
- Environmental benefits (oxygen, rainfall, biodiversity, climate impact)
- Different tree species and their specific uses:
  * Fruit trees: Mango, Guava, Jackfruit, Lemon, Orange, Papaya, etc.
  * Medicinal trees: Neem, Tulsi, Amla, Drumstick, Curry Leaf, etc.
  * Timber trees: Teak, Mahogany, Rosewood, Sandalwood, etc.
  * Ornamental trees: Magnolia, Cherry, Dogwood, Redbud, etc.
  * Tropical: Coconut, Palm, Bamboo, Banana, etc.
- Soil types and suitable plants for each
- Seasonal care and monsoon effects
- Pest and disease identification and treatment
- Eco-friendly gardening practices
- Climate-specific recommendations

When analyzing images:
- Identify the tree/plant species if possible
- Assess visible health conditions (leaf color, spots, wilting)
- Suggest care recommendations based on what you see
- Explain environmental benefits of that species
- Recommend companion plants if relevant

Response style for language "${language}":
${language === 'te' ? '- Respond in Telugu when appropriate' : ''}
${language === 'hi' ? '- Respond in Hindi when appropriate' : ''}
${language === 'en' ? '- Respond in English' : ''}
- Keep responses under 150 words unless teaching something detailed
- Use encouraging phrases
- Give actionable advice with specific steps
- Always mention environmental impact when relevant

Context: ${context}

Always be supportive, educational, and motivational. Help users understand why trees matter for humans and the atmosphere. When giving care tips, be specific about frequency, amounts, and timing.`;

    const systemPrompt = diseaseMode ? diseaseSystemPrompt : generalSystemPrompt;

    // Build messages array with optional image
    const messages: any[] = [
      { role: "system", content: systemPrompt }
    ];

    if (imageData) {
      // Multimodal message with image
      const defaultImagePrompt = diseaseMode
        ? "Please analyze this plant image for any diseases, pests, nutrient deficiencies, or health issues. Provide a detailed diagnosis with treatment recommendations."
        : "Please analyze this image and tell me about this tree/plant. Identify the species if possible, assess its health, and provide care suggestions.";
      
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: message || defaultImagePrompt
          },
          {
            type: "image_url",
            image_url: {
              url: imageData
            }
          }
        ]
      });
    } else {
      messages.push({ role: "user", content: message });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
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
    const reply = data.choices[0]?.message?.content || "I'm here to help you! 🌱";

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