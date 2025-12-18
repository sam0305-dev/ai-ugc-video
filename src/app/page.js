"use client";

import { useState } from "react";
import AvatarPicker from "../../components/AvatarPicker";
import VideoPreview from "../../components/VideoPreview";
import VoiceSelector from "../../components/VoiceSelector";


export default function Home() {
  const [script, setScript] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [videoData, setVideoData] = useState(null);
  const [voice, setVoice] = useState("en-US-JennyNeural");


  // ✅ NO SPACES
  const BASE_URL = "https://ai-ugcvideo.vercel.app/";

  async function handleGenerateVideo() {
    setError("");

    if (!script.trim()) {
      setError("Please enter a script for your UGC ad.");
      return;
    }

    if (!selectedAvatar) {
      setError("Please select an avatar image first.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          script,
          avatarImage: `${BASE_URL}${selectedAvatar}`,
          voiceId: voice, // 
        }),
      });

   
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to generate video");
  }

  const data = await res.json();
  setVideoData(data);
} catch (err) {
  console.error(err);
  setError(err.message || "Something went wrong while generating the video.");
} finally {
  setLoading(false);
}
  }

return (
  <main className="container">
    <h1>AI UGC Ad Video Generator</h1>

    <section style={{ marginBottom: "1rem" }}>
      <label>UGC Ad Script</label>
      <textarea
        value={script}
        onChange={(e) => setScript(e.target.value)}
        rows={6}
        style={{ width: "100%", maxWidth: "600px" }}
      />
    </section>

    <section style={{ marginBottom: "1rem" }}>
      <p>Choose an avatar:</p>
      <AvatarPicker
        selected={selectedAvatar}
        onSelect={setSelectedAvatar}
      />
    </section>
    <VoiceSelector selected={voice} onSelect={setVoice} />


    <button onClick={handleGenerateVideo} disabled={loading}>
      {loading ? "Generating..." : "Generate Video"}
    </button>

    {error && <p style={{ color: "red" }}>{error}</p>}

    <section style={{ marginTop: "2rem" }}>
      <VideoPreview data={videoData} />
    </section>
  </main>
);
}
