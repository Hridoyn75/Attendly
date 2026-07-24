# DealershipIQ Design System Styling Guide

This guide establishes the comprehensive **Premium White-Glassmorphic Design System** utilized consistently across the **DealershipIQ Web Dashboard** and the **Chrome Extension popup**. Use this specification file when developing new modules, refactoring views, or creating components to ensure perfect, pixel-perfect visual consistency.

---

## 1. Design Philosophy & Core Principles

The DealershipIQ interface is engineered to feel **responsive, alive, premium, and clean**. It uses a curated light mode palette with modern spacing, high information density, and subtle micro-interactions that elevate the CRM and Sourcing experience.

*   **Premium White-Glassmorphism:** Components leverage soft gradients, background blurs (`backdrop-filter`), thin neutral borders (`border-zinc-200/60`), and subtle drop-shadows rather than flat opaque fills.
*   **High Information Density:** Typography and paddings are tailored for expert CRM users (small text `10px`-`13px`, compact paddings `py-1.5 px-3`) to maximize the data visible on screen without inducing clutter.
*   **Micro-Animations & Tactility:** Hover effects (`hover:-translate-y-0.5`, `active:scale-95`) and custom elastic animations (`animate-slide-in-right`, `animate-live-pulse`) make the interface react dynamically to user actions.
*   **Identical Style Sync:** Both the Vite web dashboard and the Chrome Extension popup share identical color configurations and custom CSS class extensions to provide a seamless workflow experience.

---

## 2. Color Palette & Semantic Tokens

Never use raw colors like plain red, green, or blue. Always use this harmonious color palette, built strictly on **Tailwind Zinc** and highly specific semantic color weights.

### A. Core Neutral Scales (Zinc)
Used for panel backdrops, structural cards, headers, borders, and copy.
*   **Body Backdrop:** `bg-zinc-50/95` (paired with radial glow gradients)
*   **Clean White Fills:** `bg-white` (essential for cards, dropdown options, and input boxes)
*   **Soft Dark Neutral:** `bg-zinc-950/45` (backdrop overlays)
*   **Divider & Border Lines:** `border-zinc-200/60` or `border-zinc-200/50`
*   **Primary Dark Typography:** `text-zinc-900` or `text-zinc-800` (high readability)
*   **Secondary Body Typography:** `text-zinc-500` or `text-zinc-600` (subtitles and descriptions)
*   **Muted Label / Placeholder Typography:** `text-zinc-400` or `text-zinc-450`

### B. Primary & Accent Colors (Indigo & Violet)
Used to draw user attention to interactive nodes, active navigation elements, and primary call-to-actions.
*   **Primary Action Fill:** `bg-indigo-600` (hover: `bg-indigo-500`)
*   **Primary Text & Highlights:** `text-indigo-700` / `text-indigo-600`
*   **Soft Action Backdrop:** `bg-indigo-50` / `bg-indigo-50/70`
*   **Soft Indigo Border:** `border-indigo-200/40` or `border-indigo-300`
*   **Secondary/Tertiary Fills:** `bg-violet-50` (hover: `bg-violet-100`)
*   **Secondary Text:** `text-violet-600`

### C. Semantic Status Colors (Emerald, Rose, Amber, Sky)
Used for status badges, inline warnings, confirm dialogs, and progress tracking.

| Status | Usage | Text Class | BG Class | Border Class | Hex |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Success / Claimed** | Active, Available, Success | `text-emerald-700` | `bg-emerald-50` | `border-emerald-200/50` | `#10b981` |
| **Danger / Restricted** | Errors, Over Seat Limits, Removes | `text-red-600` | `bg-red-50` | `border-red-100` | `#ef4444` |
| **Warning / Negotiating** | Warnings, Private notes, Cautions | `text-amber-600` | `bg-amber-50` | `border-amber-200/50` | `#f59e0b` |
| **Information / Scheduled** | Scheduled calls, appointments, logs | `text-sky-600` | `bg-sky-50` | `border-sky-200/50` | `#0284c7` |

---

## 3. Typography & Text Gradients

Typography relies on a dual-font structure to emphasize visual hierarchy.

*   **Primary Font Family:** `Inter`, `Outfit`, `sans-serif` (configured in tailwind under `font-sans`).
*   **Heading Font (Large Titles):** `Outfit` for brand titles, modals, and settings controls.
*   **Scale Metrics:**
    *   **Large Dash Titles:** `text-2xl font-black text-zinc-900 tracking-tight` (24px)
    *   **Section Headers:** `text-[14px] font-semibold text-zinc-800` (14px)
    *   **Normal UI Text / Buttons:** `text-xs font-bold` or `text-[11px] font-semibold` (11px-12px)
    *   **Fine Print / Captions:** `text-[10px] font-bold uppercase tracking-wider` (10px)
    *   **Super Mini Stats:** `text-[8.5px] font-black uppercase tracking-wider` (8.5px)

### Typography Code Snippets:
```html
<!-- Dark Charcoal Sleek Title Gradient -->
<h1 className="text-gradient font-sans text-2xl font-black tracking-tight">
  Team Control Panel
</h1>

<!-- High-End Indigo/Purple Heading Gradient -->
<h2 className="text-gradient-purple font-sans font-black tracking-tight">
  DealershipIQ Executive Panel
</h2>
```

```css
/* Core Gradient Styles from stylesheet */
.text-gradient {
  background: linear-gradient(135deg, #09090b 0%, #3f3f46 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-gradient-purple {
  background: linear-gradient(135deg, #4f46e5 0%, #312e81 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## 4. Custom Tailwind Config & Global Keyframes

Ensure these classes are correctly defined in `tailwind.config.js` or in the base CSS layers for both repositories.

### A. tailwind.config.js extensions
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        glow: {
          indigo: 'rgba(99, 102, 241, 0.15)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse-slow 3s infinite ease-in-out',
        'live-pulse': 'livePulse 2.2s infinite ease-in-out',
        'fade-in': 'fadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 0.32s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards',
      }
    },
  },
}
```

### B. Custom CSS Keyframes (`index.css` & `Popup.css`)
```css
/* y-axis subtle slide & fade in */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Green dot pulse indicator with glow shadows */
@keyframes livePulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
  }
  50% {
    transform: scale(1.15);
    opacity: 0.85;
    box-shadow: 0 0 8px 3px rgba(16, 185, 129, 0.25);
  }
}

/* Slow scale breathing animation */
@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.75;
    transform: scale(0.97);
  }
}

/* Elastic spring slide-in from right used for Toast Notifications */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(120%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}
```

---

## 5. Structural Layout & Glassmorphism Panels

The interface avoids sharp, highly contrasting edges in favor of blurred glass structures. The main layout is loaded on top of a soft background radial gradient pattern.

### A. Body Radial Backdrop
```html
<div className="min-h-screen bg-zinc-50/95 text-zinc-800 antialiased font-sans"
     style={{
       backgroundImage: `
         radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.03) 0, transparent 50%),
         radial-gradient(at 50% 0%, rgba(139, 92, 246, 0.02) 0, transparent 50%),
         radial-gradient(at 100% 0%, rgba(99, 102, 241, 0.03) 0, transparent 50%)
       `
     }}>
  {/* Content Layer */}
</div>
```

### B. Standard Glass Panel and Glass Card
```css
/* Defined classes in stylesheet */
.glass-panel {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(228, 228, 231, 0.6);
}

.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(228, 228, 231, 0.5);
  box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.02);
}

.bg-glow {
  background: radial-gradient(circle at top, rgba(99, 102, 241, 0.05) 0%, rgba(255, 255, 255, 0) 75%);
}

.glow-indigo {
  box-shadow: 0 10px 40px -10px rgba(99, 102, 241, 0.08);
}
```

---

## 6. Copy-Pasteable Component Specifications

Use these precise code recipes to create matches for existing components.

### A. Interactive Buttons (Tactile Micro-Animations)
Buttons have a scale spring effect on click (`active:scale-[0.98]` or `active:scale-95`). Icons inside buttons must trigger a subtle vertical slide on hover via `.nav-button-icon`.

```tsx
import React from 'react';
import { Download, X, Copy, RefreshCw } from 'lucide-react';

export const ButtonsGuide: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-4 p-6 bg-zinc-50 border border-zinc-200 rounded-2xl">
      
      {/* 1. Primary Action Button (Indigo Action style) */}
      <button className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-[11px] font-bold text-white rounded-xl shadow-md shadow-indigo-650/10 hover:shadow-indigo-600/20 transition-all select-none cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]">
        <span>Save Changes</span>
      </button>

      {/* 2. Secondary Outline / Cancel Button */}
      <button className="py-2.5 px-4 border border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50 text-[11px] font-bold rounded-xl text-zinc-650 hover:text-zinc-800 transition-all select-none cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] shadow-sm">
        <span>Cancel</span>
      </button>

      {/* 3. Small Tactile Export Button */}
      <button className="flex items-center gap-1.5 px-3 py-[7px] text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 hover:border-zinc-300 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer">
        <Download className="w-3.5 h-3.5" />
        <span>Export Summary</span>
      </button>

      {/* 4. Dashed border / Regenerate Team Code Button */}
      <button className="w-full py-2 bg-white hover:bg-zinc-50 border border-dashed border-zinc-250 hover:border-indigo-300 text-[10px] font-extrabold rounded-xl text-zinc-500 hover:text-indigo-600 transition-all select-none shadow-sm cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-[0.99]">
        <RefreshCw className="w-3 h-3 text-zinc-400" />
        <span>Regenerate Secure Code</span>
      </button>

      {/* 5. Minimal Icon Danger Button (Red trash/remove style) */}
      <button className="p-1.5 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-lg text-zinc-400 hover:text-red-500 transition-all cursor-pointer">
        <X className="w-4 h-4" />
      </button>

    </div>
  );
};
```

---

### B. Form Fields & Inputs
Inputs use high-contrast text, custom rounded corners (`rounded-xl`), and soft Indigo halo shadows when focused.

```tsx
import React, { useState } from 'react';

export const FormInput: React.FC = () => {
  const [value, setValue] = useState("");
  
  return (
    <div className="space-y-4 max-w-sm p-5 bg-white border border-zinc-200 rounded-2xl">
      {/* 1. Normal Text Input Group */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black text-zinc-450 uppercase tracking-wider pl-1 select-none">
          Dealership Name
        </label>
        <input 
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="E.G. Apex Motors"
          className="w-full bg-white border border-zinc-200 focus:border-indigo-500/55 focus:ring-2 focus:ring-indigo-500/5 text-zinc-800 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none shadow-sm transition-all"
        />
      </div>

      {/* 2. Monospaced / Uppercase Code Input */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black text-zinc-450 uppercase tracking-wider pl-1 select-none">
          Invite Access Code
        </label>
        <input 
          type="text"
          placeholder="E.G. TC-FBF7DX"
          className="w-full bg-white border border-zinc-200 focus:border-indigo-500/55 focus:ring-2 focus:ring-indigo-500/5 text-zinc-800 text-xs font-mono font-bold uppercase tracking-widest rounded-xl px-3 py-2.5 focus:outline-none shadow-sm transition-all"
        />
      </div>
    </div>
  );
};
```

---

### C. Custom Select & Dropdown (Shadcn UI Style with React Portal)
To prevent clipping inside overflow scroll containers, the dropdown panel uses a React Portal wrapper (`createPortal`) with dynamically computed coordinates.

```tsx
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export interface SelectOption {
  value: string;
  label: React.ReactNode;
}

export const CustomSelect: React.FC<{
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
}> = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateCoords();
      window.addEventListener("scroll", updateCoords, true);
      window.addEventListener("resize", updateCoords);
    }
    return () => {
      window.removeEventListener("scroll", updateCoords, true);
      window.removeEventListener("resize", updateCoords);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative inline-block w-full">
      {/* Trigger Button mimicking Shadcn UI */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-1.5 w-full bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700 font-sans shadow-sm hover:shadow-xs px-2.5 py-1.5 rounded-lg text-[10px] font-bold outline-none transition-all text-left cursor-pointer"
      >
        <span className="truncate">{selectedOption ? selectedOption.label : "Select..."}</span>
        <svg
          className={`w-3 h-3 text-zinc-400 transition-transform duration-150 shrink-0 ${isOpen ? "rotate-180 text-zinc-650" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Portal Overlay Dropdown List */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: `${coords.top + 4}px`,
              left: `${coords.left}px`,
              width: `${coords.width}px`,
              zIndex: 999999,
            }}
            className="bg-white border border-zinc-200/80 rounded-xl shadow-xl py-1 overflow-y-auto max-h-[220px] scrollbar-thin animate-fade-in"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange(opt.value); setIsOpen(false); }}
                  className={`flex items-center justify-between w-full px-2.5 py-1.5 text-left text-[10px] font-semibold transition-colors font-sans hover:bg-zinc-50 ${
                    isSelected ? "bg-indigo-50/80 text-indigo-700 font-bold" : "text-zinc-700"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <svg className="w-3 h-3 text-indigo-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
};
```

---

### D. Toggle Switch Component (CRM Preferences style)
Used for switches, toggling rules, and background execution settings.

```tsx
import React, { useState } from 'react';

export const PreferencesToggle: React.FC = () => {
  const [autoOpen, setAutoOpen] = useState(false);

  return (
    <div className="p-4 rounded-xl border border-zinc-200 bg-white shadow-sm flex items-center justify-between gap-3 max-w-sm">
      <div className="min-w-0 pr-2">
        <p className="text-zinc-800 text-xs font-bold">Auto-Open Sidebar</p>
        <p className="text-[9.5px] text-zinc-400 font-semibold leading-relaxed mt-0.5">
          Automatically open the sourcing panel when visiting Marketplace listings.
        </p>
      </div>
      <button
        type="button"
        onClick={() => setAutoOpen(!autoOpen)}
        className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 outline-none cursor-pointer shrink-0 ${
          autoOpen ? "bg-indigo-600" : "bg-zinc-200"
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full bg-white shadow-sm transform duration-200 ${
            autoOpen ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};
```

---

### E. Glassmorphic Confirmation Modal / Dialog
Includes standard scale-up transitions (`animate-scale-up`), high-blur overlays, and customizable icons depending on action risk.

```tsx
import React from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

interface DialogProps {
  type: "alert" | "confirm";
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
}

export const GlassDialog: React.FC<DialogProps> = ({ type, title, message, onClose, onConfirm }) => {
  const isWarning = type === "confirm" || title.toLowerCase().includes("fail") || title.toLowerCase().includes("restrict");

  return (
    <div className="fixed inset-0 bg-zinc-950/45 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="w-full max-w-[340px] bg-white border border-zinc-200/80 p-6 rounded-2xl shadow-2xl flex flex-col gap-4 text-center relative overflow-hidden animate-scale-up">
        
        {/* Close Button top-right */}
        <button onClick={onClose} className="absolute top-3.5 right-3.5 p-1 text-zinc-400 hover:text-zinc-650 rounded-lg hover:bg-zinc-55 transition-colors cursor-pointer">
          <X className="w-4 h-4" />
        </button>

        {/* Dynamic Icon */}
        <div className={`w-11 h-11 rounded-full flex items-center justify-center mx-auto shrink-0 ${
          isWarning ? "bg-red-50 border border-red-100 text-red-500" : "bg-indigo-50 border border-indigo-100 text-indigo-600"
        }`}>
          {isWarning ? <AlertTriangle className="w-5.5 h-5.5" /> : <Info className="w-5.5 h-5.5" />}
        </div>

        {/* Text */}
        <div className="flex flex-col gap-1.5 font-sans">
          <h4 className="text-sm font-black text-zinc-900 tracking-tight font-outfit">{title}</h4>
          <p className="text-[11px] text-zinc-500 font-semibold leading-relaxed px-1">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 mt-1 font-sans">
          {type === "confirm" ? (
            <>
              <button onClick={onClose} className="flex-1 py-2.5 border border-zinc-200 hover:bg-zinc-50 text-zinc-650 hover:text-zinc-800 font-bold text-[11px] rounded-xl cursor-pointer transition-colors shadow-sm">
                Cancel
              </button>
              <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] rounded-xl shadow-md shadow-red-650/10 hover:shadow-red-600/20 transition-all cursor-pointer">
                Confirm
              </button>
            </>
          ) : (
            <button onClick={onClose} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] rounded-xl shadow-md shadow-indigo-650/10 hover:shadow-indigo-600/20 transition-all cursor-pointer">
              Acknowledge
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
```

---

### F. Real-time Toast Notifications (Elastic Slide-In)
Toasts fly in using the customized elastic transition `animate-slide-in-right`.

```tsx
import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  type: "success" | "error" | "info";
  title: string;
  message: string;
  onRemove: () => void;
}

export const ToastItem: React.FC<ToastProps> = ({ type, title, message, onRemove }) => {
  const cardStyles = {
    success: "border-emerald-500/15 bg-white/95 shadow-emerald-550/5",
    error: "border-rose-500/15 bg-white/95 shadow-rose-550/5",
    info: "border-indigo-500/15 bg-white/95 shadow-indigo-550/5",
  };

  const iconStyles = {
    success: "bg-emerald-50 border border-emerald-100 text-emerald-600",
    error: "bg-rose-50 border border-rose-100 text-rose-600",
    info: "bg-indigo-50 border border-indigo-100 text-indigo-650",
  };

  const icons = {
    success: <CheckCircle2 className="w-4.5 h-4.5" />,
    error: <AlertCircle className="w-4.5 h-4.5" />,
    info: <Info className="w-4.5 h-4.5" />,
  };

  return (
    <div className={`flex items-start gap-3.5 p-4 rounded-2xl border backdrop-blur-md shadow-xl transition-all duration-300 animate-slide-in-right ${cardStyles[type]}`}>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${iconStyles[type]}`}>
        {icons[type]}
      </div>
      
      <div className="flex-1 min-w-0 pr-2 font-sans text-left">
        <h5 className="text-[11px] font-black text-zinc-900 tracking-tight leading-none mt-1">{title}</h5>
        <p className="text-[10px] text-zinc-500 font-semibold leading-relaxed mt-2">{message}</p>
      </div>
      
      <button onClick={onRemove} className="shrink-0 p-1 text-zinc-400 hover:text-zinc-650 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer self-start">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
```

---

### G. CRM Roster & Data Tables
Tables employ clear, elegant spacing with extremely light backgrounds and detailed statuses.

```tsx
import React from 'react';
import { Users, UserX } from 'lucide-react';

export const TeamTable: React.FC = () => {
  const members = [
    { id: "1", name: "Sarah Connor", email: "sarah@apexmotors.com", role: "Manager", status: "Active" },
    { id: "2", name: "John Doe", email: "john@apexmotors.com", role: "Buyer", status: "Active" },
  ];

  return (
    <div className="glass-panel rounded-2xl border border-zinc-200/60 shadow-sm overflow-hidden bg-white max-w-2xl font-sans">
      
      {/* Table Header Section */}
      <div className="p-5 border-b border-zinc-200/50 flex justify-between items-center select-none">
        <h3 className="text-xs font-extrabold text-zinc-500 uppercase tracking-widest flex items-center">
          <Users className="w-4 h-4 mr-1.5 text-indigo-600" /> Active Sourcing Team
        </h3>
        <span className="text-[10px] bg-zinc-50 border border-zinc-200 rounded-full px-2 py-0.5 font-bold text-zinc-500">
          {members.length} Active
        </span>
      </div>

      {/* Core Table Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/50 text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">
              <th className="p-4 pl-6">Buyer Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/50">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-zinc-50/30 transition-colors">
                <td className="p-4 pl-6 font-bold text-zinc-800">{m.name}</td>
                <td className="p-4 font-semibold text-zinc-500 font-mono">{m.email}</td>
                <td className="p-4 font-semibold text-indigo-600 uppercase text-[9px] tracking-widest">{m.role}</td>
                <td className="p-4">
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                    {m.status}
                  </span>
                </td>
                <td className="p-4 pr-6 text-right">
                  <button className="p-1.5 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-lg text-zinc-400 hover:text-red-500 transition-all cursor-pointer">
                    <UserX className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

---

### H. Kanban Columns & Sourcing Cards
Used for sorting listings by stage inside CRM pipelines. Supports custom dragging visual properties.

```tsx
import React from 'react';
import { MapPin, Lock, Car } from 'lucide-react';

export const KanbanBoardItem: React.FC = () => {
  return (
    <div className="w-72 bg-white/60 border border-zinc-200/60 shadow-sm rounded-2xl flex flex-col p-3 gap-2.5 font-sans">
      
      {/* Column title header */}
      <div className="flex justify-between items-center px-1 border-b border-zinc-200/40 pb-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-650">New Lead</h3>
        </div>
        <span className="text-[10px] bg-indigo-50 border border-indigo-200/50 rounded-full px-2 py-0.5 font-black text-indigo-600">
          1
        </span>
      </div>

      {/* Sourcing card body */}
      <div className="p-3.5 bg-white rounded-xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md border border-zinc-100 hover:border-indigo-200/60 group">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[9px] bg-indigo-50 text-indigo-600 border border-indigo-200/50 px-2 py-0.5 rounded-md font-black">
            2021
          </span>
          <span className="text-xs font-black text-zinc-800">$18,400</span>
        </div>

        <h4 className="text-[11px] font-bold text-zinc-800 group-hover:text-zinc-900 truncate leading-snug">
          Ford Explorer Limited AWD
        </h4>

        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-zinc-100">
          <span className="flex items-center text-[9px] text-zinc-400 font-semibold truncate max-w-[100px]">
            <MapPin className="w-3 h-3 mr-1 text-zinc-300 shrink-0" />
            Austin, TX
          </span>
          <span className="text-[9px] text-zinc-400 font-semibold">54k mi</span>
        </div>

        <div className="mt-2">
          <span className="flex items-center w-fit text-[8px] text-indigo-600 bg-indigo-50 border border-indigo-200/40 px-2 py-0.5 rounded-full font-bold max-w-full truncate">
            <Lock className="w-2.5 h-2.5 mr-1 shrink-0" />
            Sarah Connor
          </span>
        </div>
      </div>

    </div>
  );
};
```

---

### I. Custom Scrollbars (Horizontal/Vertical)
Include this definition in the main styles file to unify scrollbar UI across scrollable elements (e.g., Kanban boards, drawers, activity streams).

```css
/* Thin premium custom scrollbars matching Chrome Ext popup */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.08);
  border-radius: 9999px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.15);
}
```

---

### J. Premium Hover Tooltips (Pure-CSS Glassmorphism)
Used to display brief helper descriptions above compact icons or action triggers without generating generic OS-level tooltips.

```html
<!-- Tooltip Wrapper Container (Must be relative) -->
<div className="relative group/tooltip inline-block">
  
  <!-- Trigger Element -->
  <button className="w-8 h-8 rounded-xl border flex items-center justify-center transition-all hover:scale-[1.05] active:scale-[0.95]">
    ✏️
  </button>
  
  <!-- Glassmorphic Tooltip Card -->
  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-zinc-950/90 text-white text-[10px] font-black rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 shadow-xl border border-zinc-800 whitespace-nowrap z-50 pointer-events-none select-none">
    <span>Edit Sourcing Note</span>
    <!-- Micro Arrow Element -->
    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-zinc-950/90" />
  </div>
</div>
```

*   **Premium Accent Details:** Uses a deep charcoal background with heavy opacity (`bg-zinc-950/90`), paired with a neat custom border (`border-zinc-800`), standard dropshadows, and a perfectly centered bottom pointer arrow.
*   **Volumetric Animation:** Blends `opacity-0 invisible` with `group-hover/tooltip:opacity-100 group-hover/tooltip:visible` via standard Tailwind transitions to glide in instantly upon pointer entry.

---

## 7. Component Development Checklist

When building or styling a new element, verify it matches these guidelines:
1. `[ ]` Uses **Inter** or **Outfit** as font families (ensure `font-sans` is present).
2. `[ ]` Fits the standard typography hierarchy (small core sizes `10px`-`13px`).
3. `[ ]` Has clean transitions (hover state triggers scale / vertical icon movement).
4. `[ ]` Implements soft white-glassmorphic style rather than opaque dark panels.
5. `[ ]` Respects mobile viewports (uses standard Tailwind `md:` and `sm:` responsive rules).
6. `[ ]` If building select controls, wraps inside a portal coordinate engine to prevent parent clipping.
7. `[ ]` Employs semantic colors strictly using the Tailwind Zinc/Indigo color matrix.
