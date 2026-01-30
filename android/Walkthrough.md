# 🚶‍♂️ Project Walkthrough: Shift Timer

This document provides a guided tour of the **Shift Timer** application, explaining its features and how they are implemented.

## 1. Core Concept
The app is designed for shift-based workers to calculate their exact logout time without mental math. It accounts for:
- **Login Time**: When you started your shift.
- **Shift Duration**: Standard hours (e.g., 9 hours, 8.5 hours).
- **Total Breaks**: Sum of all breaks taken in minutes.

## 2. Screens & Components
- **Live Clock**: A `LaunchedEffect` in Compose updates the current time every second, providing immediate feedback.
- **Time Picker**: Uses the standard Android `TimePickerDialog` wrapped in a Compose-friendly state.
- **Dynamic List**: A `LazyColumn` manages break entries, allowing users to add or remove them dynamically.
- **Result Card**: A logic-driven component that calculates the logout time using `java.time` APIs.

## 3. UI/UX: Glassmorphism
The app uses a modern aesthetic:
- **Radial Gradients**: Deep blue backgrounds for a premium feel.
- **Translucent Surfaces**: White backgrounds with alpha (`0.05f`) and blur effects (via border/shadow) to mimic glass.
- **High-Contrast Accents**: Yellow, Green, and Red gradients for functional buttons.

## 4. Key Logic
- **Midnight Crossover**: If the calculated start time is more than 12 hours in the future compared to 'now', the app intelligently assumes you started yesterday (handling the 10 PM - 6 AM shift scenario).
- **OT Counter**: Once the current time passes the logout time, the status switches to "Shift Ended!" and displays an active Overtime counter.
