# 🕒 Shift Timer

![Kotlin](https://img.shields.io/badge/kotlin-%237F52FF.svg?style=for-the-badge&logo=kotlin&logoColor=white)
![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)
![Jetpack Compose](https://img.shields.io/badge/Jetpack%20Compose-4285F4?style=for-the-badge&logo=jetpackcompose&logoColor=white)

**Shift Timer** is a sleek, modern Android application built to help professionals (like Customer Support Executives) track their shifts with precision. No more manual math at 3 AM to figure out when you can finally head home.

## ✨ Features

* **Real-Time Tracking:** A live-updating clock keeps you synced with the current second.
* **Smart Logout Calculation:** Automatically calculates your logout time based on login time, shift duration, and total breaks.
* **Dynamic Break Management:** Add or remove multiple break periods on the fly.
* **Overtime Monitor:** High-visibility alerts that switch to "Shift Ended" mode with a live Overtime (OT) counter once your shift is done.
* **Glassmorphism UI:** A beautiful dark-themed interface with radial gradients and a modern aesthetic.
* **Smart Date Logic:** Correctly handles shifts that cross over past midnight.

## 🚀 Tech Stack

* **Language:** Kotlin
* **UI Framework:** Jetpack Compose (100% Declarative UI)
* **Architecture:** Clean Component-based UI
* **Time API:** Java Time (java.time) for robust scheduling logic

## 🛠️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/yourusername/ShiftTimer.git](https://github.com/yourusername/ShiftTimer.git)
    ```
2.  **Open in Android Studio:**
    Ensure you are using the latest version of Android Studio (Hedgehog or later recommended).
3.  **Build & Run:**
    Sync Gradle and hit the **Run** button. The app is optimized for devices running Android 8.0 (API 26) and above.

## 📸 Screenshots

| Dashboard | Calculation View | Overtime Alert |
| :---: | :---: | :---: |
| *[Add Image Here]* | *[Add Image Here]* | *[Add Image Here]* |

## ⚙️ Configuration

To speed up your local builds (highly recommended for this project), ensure your `gradle.properties` includes:
```properties
org.gradle.jvmargs=-Xmx4096m
org.gradle.caching=true
org.gradle.parallel=true
org.gradle.configuration-cache=true