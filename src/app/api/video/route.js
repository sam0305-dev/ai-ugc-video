export async function POST(req) {
  try {
    const body = await req.json();
    console.log("REQUEST BODY:", body);

    const { script, avatarImage, voiceId } = body;

    const createResponse = await fetch("https://api.d-id.com/talks", {
      method: "POST",
      headers: {
        Authorization: `Basic ${process.env.DID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_url: avatarImage,
        script: {
          type: "text",
          input: script,
          provider: {
            type: "microsoft",
            voice_id: voiceId || "en-US-JennyNeural",
          },
        },
      }),
    });

    const text = await createResponse.text();
    console.log("D-ID CREATE RESPONSE:", text);

    if (!createResponse.ok) {
      return new Response(text, { status: createResponse.status });
    }

    let talk = JSON.parse(text);

    if (talk.result_url || talk.status === "done") {
      return Response.json(talk);
    }

    const talkId = talk.id;

    for (let i = 0; i < 15; i++) {
      await new Promise((r) => setTimeout(r, 2000));

      const statusRes = await fetch(
        `https://api.d-id.com/talks/${talkId}`,
        {
          headers: {
            Authorization: `Basic ${process.env.DID_API_KEY}`,
          },
        }
      );

      const statusText = await statusRes.text();
      console.log("D-ID STATUS RESPONSE:", statusText);

      if (!statusRes.ok) {
        return new Response(statusText, { status: statusRes.status });
      }

      talk = JSON.parse(statusText);

      if (talk.status === "done" && talk.result_url) {
        return Response.json(talk);
      }

      if (talk.status === "error") {
        return Response.json(talk, { status: 500 });
      }
    }

    return new Response(
      JSON.stringify({ error: "Timeout waiting for video" }),
      { status: 504 }
    );
  } catch (err) {
    console.error("API CRASH:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Server crash" }),
      { status: 500 }
    );
  }
}
