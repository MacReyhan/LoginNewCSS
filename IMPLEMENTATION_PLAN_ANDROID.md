# Implementation Plan - Shift Timer Android (Kotlin)

This plan outlines the steps to build the Kotlin version of the Shift Timer.

## 1. Project Setup
- **Directory**: `android/` folder in the project root.
- **Framework**: Jetpack Compose (Material 3).
- **Minimum SDK**: 24 (Android 7.0+).

## 2. Core Components
- **ViewModel**: `ShiftTimerViewModel.kt` to handle the calculation logic and state.
- **UI Screens**: `ShiftTimerScreen.kt` for the main dashboard.
- **Theme**: Custom `Color.kt` and `Theme.kt` to match the web app's blue/yellow/green palette.

## 3. Calculation Logic (ViewModel)
- State Variables: `loginTime`, `shiftHours`, `breaks`.
- Computed State: `logoutTime`, `timeLeft`.
- Tick Logic: A `Flow` or `delay` loop to update the clock every second.

## 4. UI Implementation (Compose)
- **Background**: `Box` with a `Brush.radialGradient`.
- **Card**: Semi-transparent `Surface` with `RoundedCornerShape(24.dp)` and `border`.
- **Inputs**: 
    - `TimePickerDialog` for Login Time.
    - `OutlinedTextField` with custom styling for Shift Hours.
    - Dynamic `Column` for Breaks.
- **Clock**: `Text` with `tabular-nums` equivalent styling.

## 5. Deployment
- Provide the complete `android/` source code.
- Prepare a `README_ANDROID.md` for GitHub release.
