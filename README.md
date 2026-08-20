# 🌟 LifeSync - All-in-One Life Operating System & Productivity App

A beautifully crafted, high-performance life operating system built with **React Native (Expo)**, **TypeScript**, **Zustand**, and **React Native Reanimated**. LifeSync brings together your daily tasks, habit streaks, expense tracking, goal milestones, Pomodoro focus timer, Apple Fitness-style activity rings, meal plans, and daily reflections into a unified, fluid dashboard.

---

## 📲 Download & Install

[![Download Android APK](https://img.shields.io/badge/Download_APK-Latest_Release-22c55e?style=for-the-badge&logo=android&logoColor=white)](https://github.com/rohitkumar-14/LifeSync/releases/download/v1.0.0/LifeSync.apk)
[![Release Version](https://img.shields.io/badge/Release-v1.0.0-4361ee?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rohitkumar-14/LifeSync/releases)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-informational?style=for-the-badge&logo=react)](https://github.com/rohitkumar-14/LifeSync)

> 💡 **Quick Install**: Download the prebuilt, production-ready release APK directly from [**GitHub Releases**](https://github.com/rohitkumar-14/LifeSync/releases/download/v1.0.0/LifeSync.apk) or grab `LifeSync.apk` from the root of this repository.

---

## ✨ Key Features

### 1. 🗓️ Dynamic Calendar & Daily Agenda
- **Real-Time Rolling Date Strip**: 14-day interactive horizontal calendar strip centered around today with quick "Today" jump badge.
- **Unified Day Overview**: Automatically filters scheduled tasks, active habits, and logged expenses for the selected date.
- **Interactive Checklists**: Check off tasks and toggle habit completion directly from the agenda view.

### 2. ✅ Smart Task Management
- **Custom Priorities & Categories**: Organize to-dos with `Urgent`, `High`, `Medium`, and `Low` priority tags across `Work`, `Personal`, `Health`, `Finance`, and `Study`.
- **Flexible Due Dates & Schedules**: Interactive date pickers (`Today`, `Tomorrow`, `Next Week`) and recurring repeat rules (`Daily`, `Weekdays`, `Weekly`, `Monthly`).
- **Optimistic State Updates**: Instant UI responsiveness backed by persistent local storage.

### 3. 🌱 Habit Tracker & Consistency Streaks
- **Frequency Customization**: Track daily habits with custom day selectors (`Mon`–`Sun` with `Daily`, `Weekdays`, and `Weekends` presets).
- **Daily Target Counters**: Multi-step target counters with increment/decrement steppers.
- **Streak & Progress History**: Monitor your momentum with streak milestones and custom color palettes.

### 4. 💰 Expense & Personal Finance Tracker
- **Smart Category Grid**: Log expenses across `Food`, `Transport`, `Shopping`, `Entertainment`, `Bills`, `Health`, and `Other` with custom emojis.
- **Multiple Payment Methods**: Track cash flows via `UPI`, `Card`, `Cash`, and `Net Banking`.
- **Monthly Budget Limits**: Set category-specific spending caps with real-time remaining balance alerts.

### 5. 🎯 Goals & Milestone Planner
- **Target Tracking**: Set short-term and long-term targets with start and target dates.
- **Fund Contributions**: Record savings and financial contributions towards your dream purchases or milestones with progress bar feedback.

### 6. 🍅 Focus Mode & Pomodoro Timer
- **Animated Circular SVG Progress**: Minimalist dark-mode timer with smooth ring animation powered by `react-native-svg` and `react-native-reanimated`.
- **Work & Break Intervals**: Standard 25-minute Pomodoro sessions with instant start, pause, and reset controls.

### 7. ⭕ Activity Rings (Fitness Dashboard)
- **Interlocking 3-Ring Visualization**: Apple Fitness-inspired animated concentric rings tracking **Move (Active Calories)**, **Exercise (Minutes)**, and **Hydration (Glasses)**.
- **Interactive Steppers**: Log water intake and workouts with live ring filling animations.

### 8. 📖 Daily Journal & Mood Logger
- **Reflections & Daily Notes**: Capture thoughts, gratitude, and key learnings with date timestamps.
- **Emoji Mood Tracker**: Log your daily emotional well-being (`Great`, `Good`, `Okay`, `Low`, `Tough`) to observe trends over time.

### 9. 🛒 Smart Grocery & Pantry Checklist
- **Interactive Shopping List**: Add grocery items with quantity steppers and category tags.
- **Instant Strike-Through**: Check off items while shopping with one tap.

### 10. 🍳 Meal Planning & Recipes
- **Curated Meal Ideas**: Discover recipes complete with prep times, calorie counts, difficulty ratings, and ingredient lists.

### 11. 🎉 Life Wrapped (Year-in-Review)
- **Spotify-Wrapped Style Carousel**: Full-screen, slide-by-slide celebratory presentation aggregating total tasks completed, habit streaks, money saved, and top moods.

### 12. 🔒 Biometric Security & Glassmorphic UI
- **Hardware-Backed Unlock**: Fast login via Fingerprint / Face ID (`expo-local-authentication`).
- **Interactive Password Visibility**: Eye icon toggle on all password inputs.
- **Custom Confirmation Modals**: Glowing glassmorphic logout and action bottom sheets.

---

## 🛠️ Tech Stack

- **Framework**: [Expo SDK 52](https://expo.dev) / [React Native 0.76](https://reactnative.dev)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (Typed File-based Routing)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Database & Persistence**: [AsyncStorage](https://github.com/react-native-async-storage/async-storage) & [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) & [React Native SVG](https://github.com/software-mansion/react-native-svg)
- **Biometrics**: [expo-local-authentication](https://docs.expo.dev/versions/latest/sdk/local-authentication/)
- **Haptics**: [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)
- **Typography & Theme**: Google Fonts (Plus Jakarta Sans), Light & Dark Theme Support

---

## 📂 Project Structure

```
lifesyncc/
├── app/                         # Expo Router screens & navigation
│   ├── (auth)/                  # Login & registration screens
│   ├── (modals)/                # Add Task, Habit, Expense, Goal modals
│   ├── (onboarding)/            # Swipeable onboarding carousel with expanding dots
│   ├── (tabs)/                  # 5-tab bottom navigation
│   │   ├── index.tsx            # Home dashboard
│   │   ├── tasks.tsx            # Tasks screen
│   │   ├── habits.tsx           # Habits screen
│   │   ├── finance.tsx          # Finance & expense screen
│   │   └── menu.tsx             # "More" grid dashboard
│   ├── agenda.tsx               # Dynamic 14-day rolling calendar agenda
│   ├── fitness.tsx              # 3-ring Apple Fitness activity tracker
│   ├── focus.tsx                # Pomodoro timer with animated SVG ring
│   ├── journal.tsx              # Daily journal & mood logger
│   ├── groceries.tsx            # Smart shopping & pantry checklist
│   ├── wrapped.tsx              # Spotify-Wrapped style year-in-review
│   └── settings.tsx             # App preferences & data export
├── src/
│   ├── components/              # Reusable UI components & modals
│   │   ├── cards/               # Task, Habit, Expense cards
│   │   ├── modals/              # LogoutModal & custom sheets
│   │   └── ui/                  # Button, Input with eye icon toggle, Badges
│   ├── hooks/                   # Custom theme & color scheme hooks
│   ├── store/                   # Zustand persistent data stores
│   │   ├── useTaskStore.ts      # Tasks state
│   │   ├── useHabitStore.ts     # Habits & streaks state
│   │   ├── useFinanceStore.ts   # Expenses & budgets state
│   │   ├── useGoalStore.ts      # Goals & contributions state
│   │   └── useAppStore.ts       # Auth, profile & onboarding state
│   └── theme/                   # Colors, typography, spacing & border radii
├── assets/images/               # App icons, splash screens, and illustrations
├── app.json                     # Expo configuration
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) on your mobile device or an Android/iOS emulator

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rohitkumar-14/LifeSync.git
   cd LifeSync
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npx expo start
   ```

4. **Launch on your device**:
   - Scan the QR code using the **Expo Go** app on Android or the **Camera** app on iOS.
   - Or press `a` for Android Emulator / `i` for iOS Simulator.

---

## 📱 Building Android Release APK Locally

To compile a native Release APK on your local machine:

1. Navigate to the `android/` directory:
   ```bash
   cd android
   ```

2. Assemble the release APK using Gradle:
   ```bash
   .\gradlew.bat :app:assembleRelease -x lint -x lintVitalAnalyzeRelease
   ```

3. The generated release APK will be located at:
   `android/app/build/outputs/apk/release/app-release.apk`

---

## 🍎 Building for iOS

LifeSync is 100% cross-platform compatible. You can build for iOS via EAS Cloud (without a Mac) or locally via Xcode:

```bash
# Cloud build via Expo EAS (No Mac required)
npx eas-cli build --platform ios --profile preview
```

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
