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
    const { weekStart, childCounts, staffList, staffingRatios, currentSchedules } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Create detailed prompt for AI
    const systemPrompt = `Du är en AI-assistent som hjälper till att föreslå personalscheman för förskolor.
Din uppgift är att analysera barnantal, tillgänglig personal, och bemanningskrav för att föreslå optimala arbetsscheman.

Regler:
- Håll personaltätheten på max 1:5 (en personal per 5 barn) enligt svenska förskoleförordningen
- Fördela personal jämnt över veckan
- Ta hänsyn till vikarier som har begränsade anställningsperioder
- Föreslå scheman som täcker öppettider (vanligtvis 06:00-18:00)
- Om det finns för få personal, varna tydligt`;

    const userPrompt = `Föreslå personalschema för vecka som börjar ${weekStart}.

BARNANTAL PER DAG:
${JSON.stringify(childCounts, null, 2)}

TILLGÄNGLIG PERSONAL:
${JSON.stringify(staffList, null, 2)}

BEMANNINGSKRAV:
${JSON.stringify(staffingRatios, null, 2)}

NUVARANDE SCHEMA (för referens):
${JSON.stringify(currentSchedules, null, 2)}

Analysera dessa data och returnera förslag på arbetscheman för varje personal och dag.
Returnera ENDAST ett JSON-objekt enligt denna struktur:
{
  "recommendations": [
    {
      "staffId": "staff1",
      "staffName": "Jonas Nilsson",
      "department": "Blåbär",
      "schedule": {
        "monday": { "start": "07:00", "end": "16:00" },
        "tuesday": { "start": "07:00", "end": "16:00" },
        ...
      }
    }
  ],
  "reasoning": "Förklaring av hur schemat optimerats...",
  "warnings": ["Varning om underbemanning på fredagar kl 15:00-18:00"],
  "optimizations": ["Förslag på förbättringar"]
}`;

    console.log("Calling Lovable AI with prompt...");

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit överskriden. Försök igen om en stund.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI-krediter slut. Lägg till krediter i Lovable inställningar.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI Response received");
    
    const aiResponse = data.choices[0].message.content;
    
    // Parse AI response - handle both plain JSON and markdown-wrapped JSON
    let parsedResponse;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/) || 
                        aiResponse.match(/```\s*([\s\S]*?)\s*```/);
      
      const jsonString = jsonMatch ? jsonMatch[1] : aiResponse;
      parsedResponse = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiResponse);
      throw new Error("AI returnerade ogiltigt format");
    }

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in suggest-staff-schedule:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Okänt fel uppstod' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
