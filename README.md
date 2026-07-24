# 🎓 Attendly — Semester Attendance Tracker PWA

[![PWA Ready](https://img.shields.io/badge/PWA-100%25_Offline_Ready-4f46e5?style=for-the-badge&logo=pwa&logoColor=white)](https://github.com/)
[![React](https://img.shields.io/badge/React-18.3-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.3-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

**Attendly** is a modern, mobile-first **Progressive Web App (PWA)** engineered for university students to effortlessly track semester class attendance, manage academic collegiate status rules (*Collegiate*, *Non-Collegiate*, *Dis-Collegiate*), and calculate safe bunk limits — all saved 100% offline in client-side LocalStorage.

---

## ✨ Features

- 📱 **Mobile-First PWA**: Can be installed directly onto iOS & Android homescreens with offline service worker support.
- 🎓 **University Collegiate Attendance System**: Real-time status classification:
  - 🟢 **COLLEGIATE** ($\ge 75\%$): Regular exam status.
  - 🟡 **NON-COLLEGIATE** ($50\% - 74.9\%$): Warning / fine required.
  - 🔴 **DIS-COLLEGIATE** ($< 50\%$): Debarred / critical alert status.
- 🎚️ **Live Instant Criteria Sliders**: Customize Non-Collegiate and Dis-Collegiate percentage cutoffs on the settings page to match your specific university policies.
- 📅 **Multi-Entry Date Logging**: Log multiple lectures, labs, or substitute classes on the same day with custom notes and backdated date picker support.
- 📊 **Semester Analytics Dashboard**: Dedicated stats tab displaying overall attendance percentage, total presences, total absences, and collegiate health summaries.
- 💾 **LocalStorage DB & Backup**: 100% private, client-side data persistence with `.json` export and import capabilities for cross-device synchronization.
- 💎 **White-Glassmorphic UI**: High-aesthetic UI crafted using Tailwind CSS, Outfit & Inter Google Fonts, glassmorphism panels, and smooth micro-animations.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom Glassmorphism Utilities
- **Icons**: [Lucide React](https://lucide.dev/)
- **Storage**: Browser `localStorage` (Client-side offline database)
- **PWA**: Web App Manifest (`manifest.json`) + Cache-First Service Worker (`sw.js`)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) installed on your machine.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/attendly.git
   cd attendly
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your web browser.

---

## 📁 Project Structure

```text
AttendenceTracker/
├── public/
│   ├── manifest.json       # PWA Web App Manifest
│   ├── sw.js               # Service Worker for offline caching
│   └── pwa-icon.jpg        # 3D Graduation Cap PWA App Icon
├── src/
│   ├── components/
│   │   ├── AddCourseModal.tsx       # Course creation modal dialog
│   │   ├── BottomNav.tsx            # Floating mobile app navigation dock
│   │   ├── CourseCard.tsx           # Subject attendance card component
│   │   ├── CourseHistoryModal.tsx   # Detailed chronological logs drawer
│   │   ├── ExportImportModal.tsx    # JSON backup & restore dialog
│   │   ├── MarkAttendanceModal.tsx  # Daily presence/absence recorder
│   │   ├── Navbar.tsx               # Top branding header
│   │   ├── PwaSettingsView.tsx      # Live criteria sliders & PWA settings
│   │   └── Toast.tsx                # Elastic action notifications
│   ├── types/
│   │   └── attendance.ts            # TypeScript interfaces & types
│   ├── utils/
│   │   ├── calculations.ts          # Attendance math & collegiate classification
│   │   └── storage.ts               # LocalStorage persistence manager
│   ├── App.tsx                      # Root application controller
│   ├── main.tsx                     # React DOM root entry
│   └── index.css                    # Tailwind directives & glassmorphic styles
├── index.html                       # HTML entry point & PWA meta tags
├── tailwind.config.js               # Design tokens, fonts & keyframe animations
├── vite.config.ts                   # Vite bundler configuration
└── README.md                        # Project documentation
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/attendly/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
