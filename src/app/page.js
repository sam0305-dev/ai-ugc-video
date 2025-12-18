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
          voiceId: voice,
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
      setError(
        err.message || "Something went wrong while generating the video."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <div className="brand-mark">U</div>
          <div>
            <h1 className="brand-name">UGCify AI</h1>
            <p className="brand-tagline">AI-powered UGC ad videos in minutes.</p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="app-panel app-panel-left">
          <h2 className="panel-title">1. Craft your UGC script</h2>
          <p className="panel-subtitle">
            Write a short, conversational script. We&apos;ll turn it into a
            ready-to-run UGC-style ad.
          </p>

          <label className="field-label" htmlFor="script">
            Script
          </label>
          <textarea
            id="script"
            className="field-textarea"
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Example: Hey, I just tried this new skincare serum and I’m obsessed..."
            rows={7}
          />

          <div className="field-group">
            <div>
              <p className="field-label">Avatar</p>
              <p className="field-help">Choose a face for your UGC creator.</p>
            </div>
            <AvatarPicker
              selected={selectedAvatar}
              onSelect={setSelectedAvatar}
            />
          </div>

          <div className="field-group">
            <div>
              <p className="field-label">Voice</p>
              <p className="field-help">
                Pick a voice that matches your brand tone.
              </p>
            </div>
            <VoiceSelector selected={voice} onSelect={setVoice} />
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="actions">
            <button
              className="primary-btn"
              onClick={handleGenerateVideo}
              disabled={loading}
            >
              {loading ? "Generating your video..." : "Generate UGC Video"}
            </button>
          </div>
        </section>

        <section className="app-panel app-panel-right">
          <h2 className="panel-title">2. Preview your video</h2>
          <p className="panel-subtitle">
            We&apos;ll render a video preview here once it&apos;s ready.
          </p>
          <div className="preview-surface">
            <VideoPreview data={videoData} />
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <span>© {new Date().getFullYear()} UGCify AI</span>
        <span className="footer-dot">•</span>
        <span>AI-powered UGC ad videos in minutes.</span>
      </footer>
    </div>
  );
}
