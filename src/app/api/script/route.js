export async function POST(req) {
  const { product } = await req.json();

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "user",
            content: `Write a short UGC ad script for ${product}`
          }
        ]
      }),
    }
  );

  const data = await response.json();
  return Response.json({ script: data.choices[0].message.content });
}
