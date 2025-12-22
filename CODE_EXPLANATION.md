# Code Explanation: UGCify AI - Step by Step

This document explains how each file in the UGCify AI application works and how they interact together.

---

## 📁 File Structure Overview

```
ai-ugc-video/
├── src/app/
│   ├── layout.js          # Root layout (wraps entire app)
│   ├── page.js            # Main page component (home page)
│   └── globals.css        # Global styles (vanilla CSS)
├── components/
│   ├── AvatarPicker.js    # Avatar selection component
│   ├── VoiceSelector.js   # Voice selection dropdown
│   └── VideoPreview.js    # Video display component
└── src/app/api/           # API routes (not covered here)
```

---

## 1️⃣ **layout.js** - Root Layout Component

### Purpose

This is the root wrapper for the entire Next.js application. It sets up fonts, metadata, and the HTML structure.

### Code Breakdown

```javascript
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
```

- **Line 1**: Imports Google Fonts (Geist Sans and Geist Mono) from Next.js font optimization
- **Line 2**: Imports global CSS styles that apply to the entire app

```javascript
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
```

- Creates a font configuration for Geist Sans
- Sets a CSS variable `--font-geist-sans` that can be used in CSS
- Only loads Latin character subset (smaller file size)

```javascript
export const metadata = {
  title: "UGCify AI",
  description: "AI-powered UGC ad videos in minutes.",
};
```

- **Metadata**: Sets the browser tab title and SEO description
- This appears in search results and browser tabs

```javascript
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
```

- **RootLayout**: Wraps all pages in the app
- **`{children}`**: This is where `page.js` content gets inserted
- **Font classes**: Makes the font variables available to child components

### How It Works

1. Next.js loads this file first
2. It wraps every page with the HTML structure
3. Fonts are optimized and loaded automatically
4. Global CSS is applied to the entire app

---

## 2️⃣ **page.js** - Main Home Page Component

### Purpose

This is the main interactive page where users create UGC videos. It manages all the state and handles the video generation API call.

### Code Breakdown

#### **Step 1: Imports and Setup**

```javascript
"use client";
```

- **"use client"**: Tells Next.js this is a Client Component (uses React hooks and browser APIs)
- Required for `useState`, event handlers, and API calls

```javascript
import { useState } from "react";
import AvatarPicker from "../../components/AvatarPicker";
import VideoPreview from "../../components/VideoPreview";
import VoiceSelector from "../../components/VoiceSelector";
```

- **useState**: React hook for managing component state
- **Component imports**: Brings in reusable UI components

#### **Step 2: State Management**

```javascript
const [script, setScript] = useState("");
const [selectedAvatar, setSelectedAvatar] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [videoData, setVideoData] = useState(null);
const [voice, setVoice] = useState("en-US-JennyNeural");
```

**How State Works:**

- Each `useState` creates a variable and a function to update it
- **`script`**: Stores the user's text input (the ad script)
- **`selectedAvatar`**: Stores the path to the chosen avatar image
- **`loading`**: Boolean flag - true when API call is in progress
- **`error`**: Stores error messages to display to user
- **`videoData`**: Stores the API response with video URL/data
- **`voice`**: Stores the selected voice ID (defaults to Jenny)

**Example Flow:**

```javascript
// User types in textarea
onChange={(e) => setScript(e.target.value)}
// This updates the 'script' state, which re-renders the component
```

#### **Step 3: Video Generation Function**

```javascript
async function handleGenerateVideo() {
  setError(""); // Clear any previous errors

  // Validation
  if (!script.trim()) {
    setError("Please enter a script for your UGC ad.");
    return; // Stop execution
  }

  if (!selectedAvatar) {
    setError("Please select an avatar image first.");
    return;
  }

  setLoading(true); // Show loading state

  try {
    // API call
    const res = await fetch("/api/video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        script,
        avatarImage: `${BASE_URL}${selectedAvatar}`,
        voiceId: voice,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to generate video");
    }

    const data = await res.json();
    setVideoData(data); // Save video data to state
  } catch (err) {
    setError(err.message); // Show error to user
  } finally {
    setLoading(false); // Always stop loading
  }
}
```

**Step-by-Step Flow:**

1. **Clear errors**: Reset any previous error messages
2. **Validate input**: Check if script and avatar are provided
3. **Set loading**: Disable button and show "Generating..." text
4. **API call**: Send POST request to `/api/video` endpoint
   - Includes: script text, avatar image URL, voice ID
5. **Handle response**:
   - Success: Save video data to state → triggers re-render → shows video
   - Error: Save error message → shows error text
6. **Cleanup**: Always set loading to false (even if error occurred)

#### **Step 4: JSX Structure (UI Rendering)**

```javascript
return (
  <div className="app-shell">
    {/* Header */}
    <header className="app-header">
      <div className="brand">
        <div className="brand-mark">U</div>
        <div>
          <h1 className="brand-name">UGCify AI</h1>
          <p className="brand-tagline">AI-powered UGC ad videos in minutes.</p>
        </div>
      </div>
    </header>

    {/* Main Content */}
    <main className="app-main">
      {/* Left Panel - Input Form */}
      <section className="app-panel app-panel-left">
        {/* Script textarea */}
        <textarea value={script} onChange={(e) => setScript(e.target.value)} />

        {/* Avatar Picker Component */}
        <AvatarPicker selected={selectedAvatar} onSelect={setSelectedAvatar} />

        {/* Voice Selector Component */}
        <VoiceSelector selected={voice} onSelect={setVoice} />

        {/* Error Display */}
        {error && <p className="error-text">{error}</p>}

        {/* Generate Button */}
        <button onClick={handleGenerateVideo} disabled={loading}>
          {loading ? "Generating..." : "Generate UGC Video"}
        </button>
      </section>

      {/* Right Panel - Video Preview */}
      <section className="app-panel app-panel-right">
        <VideoPreview data={videoData} />
      </section>
    </main>

    {/* Footer */}
    <footer className="app-footer">
      <span>© {new Date().getFullYear()} UGCify AI</span>
    </footer>
  </div>
);
```

**How JSX Works:**

- **`className`**: Maps to CSS classes in `globals.css`
- **`value={script}`**: Controlled input - React controls the value
- **`onChange`**: Event handler - runs when user types
- **`{error && ...}`**: Conditional rendering - only shows if error exists
- **`disabled={loading}`**: Disables button during API call
- **`{new Date().getFullYear()}`**: JavaScript expression - calculates current year

**Component Props:**

- **AvatarPicker**: Receives `selected` (current selection) and `onSelect` (callback function)
- **VoiceSelector**: Same pattern - receives current value and update function
- **VideoPreview**: Receives `data` (video information from API)

---

## 3️⃣ **globals.css** - Styling System

### Purpose

Contains all the CSS styling using vanilla CSS (no frameworks). Creates a modern, dark-themed UI.

### Key Sections Explained

#### **CSS Reset & Base Styles**

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

- Makes all elements use `border-box` sizing (padding included in width/height)
- Prevents layout issues

```css
body {
  min-height: 100vh;
  background: radial-gradient(
    circle at top left,
    #111827,
    #020617 45%,
    #000 100%
  );
  color: #f9fafb;
}
```

- **`min-height: 100vh`**: Full viewport height
- **`radial-gradient`**: Creates dark gradient background (dark blue to black)
- **Color**: Light gray text for contrast

#### **Layout System**

```css
.app-shell {
  width: 100%;
  max-width: 1120px;
  min-height: 100vh;
  padding: 32px 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
```

- **Container**: Centers content, max width 1120px
- **Flexbox**: Stacks header, main, footer vertically
- **Gap**: Space between sections

```css
.app-main {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 20px;
}
```

- **CSS Grid**: Creates two-column layout
- **`1.2fr 1fr`**: Left panel slightly wider than right
- **`minmax(0, ...)`**: Prevents overflow issues

#### **Panel Styling**

```css
.app-panel {
  background: radial-gradient(
    circle at top,
    rgba(55, 65, 81, 0.35),
    rgba(15, 23, 42, 0.98)
  );
  border-radius: 24px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  padding: 22px 22px 20px;
  box-shadow: 0 22px 40px rgba(0, 0, 0, 0.6);
}
```

- **Gradient background**: Subtle dark gradient for depth
- **Border radius**: Rounded corners (24px)
- **Border**: Subtle gray border with transparency
- **Box shadow**: Deep shadow for 3D effect

#### **Form Elements**

```css
.field-textarea {
  width: 100%;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.6);
  background: rgba(15, 23, 42, 0.7);
  color: #f9fafb;
  padding: 12px 14px;
  transition: border-color 0.16s ease;
}
```

- **Textarea styling**: Dark background, light text, rounded corners
- **Transition**: Smooth color change on focus

```css
.field-textarea:focus {
  border-color: #38bdf8;
  box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.6);
  background: rgba(15, 23, 42, 0.95);
}
```

- **Focus state**: Blue border and glow when user clicks in textarea

#### **Button Styling**

```css
.primary-btn {
  border-radius: 999px; /* Fully rounded */
  background-image: linear-gradient(135deg, #22c55e, #16a34a);
  color: #ecfdf5;
  box-shadow: 0 16px 35px rgba(16, 185, 129, 0.55);
  transition: transform 0.16s ease;
}
```

- **Gradient button**: Green gradient background
- **Rounded**: Fully rounded (pill shape)
- **Shadow**: Green glow effect

```css
.primary-btn:hover {
  transform: translateY(-1px); /* Slight lift */
  filter: brightness(1.05);
}
```

- **Hover effect**: Button lifts up slightly and brightens

```css
.primary-btn:disabled {
  opacity: 0.65;
  cursor: wait;
}
```

- **Disabled state**: Faded and shows wait cursor

#### **Responsive Design**

```css
@media (max-width: 900px) {
  .app-main {
    grid-template-columns: minmax(0, 1fr); /* Single column */
  }
}
```

- **Mobile breakpoint**: Stacks panels vertically on small screens
- **`@media`**: CSS media queries for responsive design

---

## 4️⃣ **AvatarPicker.js** - Avatar Selection Component

### Purpose

Allows users to select an avatar image from different categories (male, female, business).

### Code Breakdown

```javascript
"use client";
import { useState } from "react";
```

```javascript
const avatarGroups = {
  male: ["/avatars/male/male1.jpg", "/avatars/male/male2.jpg"],
  female: ["/avatars/female/female1.png", "/avatars/female/female2.png"],
  business: ["/avatars/business/business1.png"],
};
```

- **Data structure**: Object mapping category names to image paths
- Images are in the `public/avatars/` folder

```javascript
export default function AvatarPicker({ selected, onSelect }) {
  const [group, setGroup] = useState("male");
```

- **Props**:
  - `selected`: Currently selected avatar path (from parent)
  - `onSelect`: Callback function to update parent state
- **Local state**: Tracks which category is active

```javascript
return (
  <div>
    <select value={group} onChange={(e) => setGroup(e.target.value)}>
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
            border: selected === url ? "3px solid #0070f3" : "2px solid #ccc",
          }}
        />
      ))}
    </div>
  </div>
);
```

**How It Works:**

1. **Dropdown**: User selects category (male/female/business)
2. **State update**: `setGroup` updates local state
3. **Render avatars**: Maps through images in selected category
4. **Click handler**: `onClick={() => onSelect(url)}` calls parent's function
5. **Visual feedback**: Selected avatar has blue border

**Data Flow:**

```
User clicks avatar
  → onClick calls onSelect(url)
    → Parent's setSelectedAvatar(url) runs
      → Parent re-renders with new selectedAvatar
        → AvatarPicker receives new 'selected' prop
          → Border updates to show selection
```

---

## 5️⃣ **VoiceSelector.js** - Voice Selection Component

### Purpose

Simple dropdown to select a voice for text-to-speech.

### Code Breakdown

```javascript
export default function VoiceSelector({ selected, onSelect }) {
  const voices = [
    { label: "Female – Jenny (US)", id: "en-US-JennyNeural" },
    { label: "Female – Aria (US)", id: "en-US-AriaNeural" },
    // ... more voices
  ];
```

- **Voices array**: List of available voices with display labels and API IDs
- Uses Microsoft Azure Neural Voices format

```javascript
return (
  <select value={selected} onChange={(e) => onSelect(e.target.value)}>
    <option value="">Select Voice</option>
    {voices.map((v) => (
      <option key={v.id} value={v.id}>
        {v.label}
      </option>
    ))}
  </select>
);
```

**How It Works:**

1. **Controlled select**: `value={selected}` shows current selection
2. **Change handler**: `onChange` calls `onSelect` with new value
3. **Options**: Maps voices array to `<option>` elements
4. **Key prop**: React uses `key` for efficient re-rendering

**Data Flow:**

```
User selects voice from dropdown
  → onChange event fires
    → onSelect(e.target.value) called
      → Parent's setVoice(newValue) runs
        → Parent re-renders
          → VoiceSelector shows new selected value
```

---

## 6️⃣ **VideoPreview.js** - Video Display Component

### Purpose

Displays the generated video or shows a message if no video exists yet.

### Code Breakdown

```javascript
export default function VideoPreview({ data }) {
  if (!data) {
    return <p>No video generated yet. Submit a script to generate one.</p>;
  }
```

- **Early return**: If no data, show placeholder message
- Prevents errors from accessing undefined properties

```javascript
const possibleUrl =
  data.result_url || data.url || (data.result && data.result.url) || null;
```

- **Flexible URL extraction**: Checks multiple possible response formats
- **Logical OR (`||`)**: Returns first truthy value
- Handles different API response structures

```javascript
return (
  <div>
    <h2>Video Result</h2>
    {possibleUrl ? (
      <video src={possibleUrl} controls />
    ) : (
      <pre>{JSON.stringify(data, null, 2)}</pre>
    )}
  </div>
);
```

**How It Works:**

1. **Check for URL**: Tries to find video URL in response
2. **Render video**: If URL exists, shows `<video>` element with controls
3. **Fallback**: If no URL, shows raw JSON response (for debugging)

**Conditional Rendering:**

- **Ternary operator**: `condition ? trueValue : falseValue`
- Shows video if URL found, otherwise shows JSON

---

## 🔄 **Complete Data Flow**

### User Journey:

1. **Page Loads**

   - `layout.js` wraps `page.js`
   - `page.js` renders with initial state (empty script, no avatar selected)
   - Components render with default values

2. **User Types Script**

   - Textarea `onChange` → `setScript(e.target.value)`
   - Component re-renders with new script value

3. **User Selects Avatar**

   - Clicks avatar → `AvatarPicker` calls `onSelect(url)`
   - Parent's `setSelectedAvatar(url)` updates state
   - Avatar border updates to show selection

4. **User Selects Voice**

   - Selects from dropdown → `VoiceSelector` calls `onSelect(value)`
   - Parent's `setVoice(value)` updates state

5. **User Clicks Generate**

   - `handleGenerateVideo()` runs
   - Validates inputs
   - Sets `loading = true` → button shows "Generating..."
   - API call to `/api/video` with script, avatar, voice
   - On success: `setVideoData(response)` → `VideoPreview` shows video
   - On error: `setError(message)` → error text appears
   - `setLoading(false)` → button re-enables

6. **Video Displays**
   - `VideoPreview` receives `videoData` prop
   - Extracts video URL
   - Renders `<video>` element with controls

---

## 🎨 **Styling Architecture**

### CSS Class Naming Convention:

- **`.app-*`**: Top-level layout (shell, header, main, footer)
- **`.panel-*`**: Panel-specific styles
- **`.field-*`**: Form input styles
- **`.primary-btn`**: Button styles
- **`.brand-*`**: Branding/header styles

### Design Principles:

1. **Dark theme**: Dark backgrounds with light text
2. **Gradients**: Subtle gradients for depth
3. **Shadows**: Box shadows for elevation
4. **Transitions**: Smooth animations on interactions
5. **Responsive**: Mobile-friendly with media queries

---

## 🔑 **Key React Concepts Used**

1. **useState Hook**: Manages component state
2. **Props**: Passes data from parent to child
3. **Event Handlers**: `onClick`, `onChange` for user interactions
4. **Controlled Components**: Inputs controlled by React state
5. **Conditional Rendering**: `{condition && <element>}` or ternary
6. **Async/Await**: Handles API calls asynchronously
7. **Error Handling**: Try/catch for API errors

---

## 📝 **Summary**

- **layout.js**: Sets up app structure and fonts
- **page.js**: Main logic - state management and API calls
- **globals.css**: All styling with vanilla CSS
- **Components**: Reusable UI pieces (AvatarPicker, VoiceSelector, VideoPreview)
- **Data Flow**: Parent manages state, children receive props and call callbacks
- **Styling**: Modern dark theme with gradients, shadows, and smooth transitions

This architecture follows React best practices: state lifted to parent, components are reusable, and styling is separated into CSS files.
