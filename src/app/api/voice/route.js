export async function POST(req) {
  const { text } = await req.json();

  const response = await fetch(
    "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL",
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVEN_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        voice_settings: { stability: 0.5, similarity_boost: 0.5 },
      }),
    }
  );

  const audio = await response.arrayBuffer();
  return new Response(audio, { headers: { "Content-Type": "audio/mpeg" } });
}
