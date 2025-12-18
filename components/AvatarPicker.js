"use client";
import { useState } from "react";

const avatarGroups = {
  male: ["/avatars/male/male1.jpg", "/avatars/male/male2.jpg"],
  female: ["/avatars/female/female1.png", "/avatars/female/female2.png"],
  business: ["/avatars/business/business1.png"],
};

export default function AvatarPicker({ selected, onSelect }) {
  const [group, setGroup] = useState("male");

  return (
    <div>
      <select
        value={group}
        onChange={(e) => setGroup(e.target.value)}
        style={{ marginBottom: "10px" }}
      >
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="business">Business</option>
      </select>

      <div style={{ display: "flex", gap: "10px" }}>
        {avatarGroups[group].map((url) => (
          <img
            key={url}
            src={url}
            onClick={() => onSelect(url)}
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              cursor: "pointer",
              border:
                selected === url
                  ? "3px solid #0070f3"
                  : "2px solid #ccc",
            }}
          />
        ))}
      </div>
    </div>
  );
}
