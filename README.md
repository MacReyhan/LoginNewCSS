# 🕒 Shift Timer

[![Build and Deploy](https://github.com/MacReyhan/LoginNewCSS/actions/workflows/build-deploy.yml/badge.svg)](https://github.com/MacReyhan/LoginNewCSS/actions/workflows/build-deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Shift Timer** is a sleek, premium, and unified workspace utility designed for shift-based professionals (e.g., Customer Support, Operations) to track their hours, breaks, and shifts without the hassle of manual time arithmetic.

It comprises a fully responsive **Progressive Web App (PWA)** and a matching native **Android App**.

---

## ✨ Features

### 🌐 Web Application (TypeScript PWA)
*   **Visual Shift Timeline:** A glassmorphic progress bar displaying elapsed shift percentage. Transitions colors dynamically: **emerald green** during active work, **amber/gold** near completion (>= 90%), and **rose/red** in overtime.
*   **Quick Break Presets:** Inject breaks instantly using button chips (`+15m`, `+30m Lunch`, `+45m`).
*   **State Persistence:** Saves inputs (`Login Time`, `Shift Hours`, and `Breaks`) to `localStorage` automatically as you type so you never lose tracking state on page reload.
*   **Audio Chime & Vibration:** Synthesizes a pleasant C-major chime using the native browser **Web Audio API** (100% offline-ready, zero external media files) and triggers confetti when the shift ends.
*   **Browser Notifications:** Supports opt-in native system push notifications to alert you when your shift finishes.
*   **PWA Installable:** Complete PWA configuration with `manifest.json` and customized Play Store launcher icons.

### 🤖 Android Application (Kotlin & Jetpack Compose)
*   **Native Replicas:** Built with a fully declarative Jetpack Compose UI matching the web app's Glassmorphic design and gradients.
*   **Persistent Storage:** Saves configurations to the device using `SharedPreferences` to preserve data across app restarts.
*   **Vibration Alert:** Triggers a native device vibration pattern the second your shift ends.
*   **Midnight Crossover Support:** Intelligently handles shifts spanning over midnight (e.g. shifts starting at 10 PM and ending at 6 AM).

---

## 🚀 Tech Stack

### Web App
- **Language:** TypeScript
- **Styling:** CSS3, Tailwind CSS (Glassmorphism & Radial gradients)
- **Bundler:** Esbuild
- **Hosting:** Cloudflare Pages (Serverless)

### Android App
- **Language:** Kotlin
- **UI Framework:** Jetpack Compose (Material 3)
- **Minimum SDK:** API 24 (Android 7.0+)
- **Time Library:** Java 8 Time API (`java.time`)

---

## 🛠️ Build & Development

### Web App
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the Cloudflare Pages development server locally:
   ```bash
   npm run dev
   ```
3. Build the minified production bundle in `/dist`:
   ```bash
   npm run build
   ```

### Android App
1. Open the `/android` directory inside **Android Studio** (Hedgehog or later recommended).
2. Android Studio will automatically resolve dependencies and configure the Gradle Wrapper.
3. Build the project or click the **Run** button to run it on an emulator or physical device.

---

## 🤖 CI/CD Automation (GitHub Actions)
The repository includes a GitHub Actions workflow in `.github/workflows/build-deploy.yml` which executes automatically on pushes to the `main` branch:
1.  **Android Build:** Compiles the Kotlin source code using the Gradle Wrapper and uploads the compiled `app-debug.apk` as a download artifact.
2.  **Web Deploy:** Compiles TypeScript, minifies assets, and deploys the output to Cloudflare Pages.

---

## ✍️ Credits
*   **Developer:** [MacReyhan](https://github.com/MacReyhan)
*   **Libraries:** 
    *   [canvas-confetti](https://github.com/catdad/canvas-confetti) for celebratory animation effects.
    *   [Tailwind CSS](https://tailwindcss.com) for utility-first styling.
    *   Google Fonts (Outfit) for clean typography.
*   **AI Pair-Programming Assistant:** Built with the assistance of Antigravity (Google DeepMind).

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
