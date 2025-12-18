"use client";

export default function VoiceSelector({ selected, onSelect }) {
  const voices = [
    { label: "Female – Jenny (US)", id: "en-US-JennyNeural" },
    { label: "Female – Aria (US)", id: "en-US-AriaNeural" },
    { label: "Male – Guy (US)", id: "en-US-GuyNeural" },
    { label: "Male – Davis (US)", id: "en-US-DavisNeural" },
    { label: "Female – Neerja (IN)", id: "en-IN-NeerjaNeural" },
    { label: "Male – Prabhat (IN)", id: "en-IN-PrabhatNeural" },
  ];

  return (
    <select
      value={selected}
      onChange={(e) => onSelect(e.target.value)}
      style={{ padding: "8px", width: "100%", maxWidth: "300px" }}
    >
      <option value="">Select Voice</option>
      {voices.map((v) => (
        <option key={v.id} value={v.id}>
          {v.label}
        </option>
      ))}
    </select>
  );
}
