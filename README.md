# TI Junction App

A fully native React Native social media application built with Expo SDK 56, Firebase, and AdMob.

## Tech Stack

- **React Native** 0.85.3 + **Expo SDK** 56
- **Expo Router** — file-based navigation
- **TypeScript** — strict mode
- **Firebase** — Auth, Firestore, Storage, FCM, Analytics, Crashlytics
- **TanStack Query** — server state management
- **Zustand** — client state
- **React Hook Form + Zod** — form validation
- **FlashList** — optimized list rendering
- **NativeWind** — Tailwind CSS for React Native
- **AdMob** — native, interstitial, and rewarded ads (test IDs)

## Prerequisites

- **Node.js** >= 22.13.x
- **npm** >= 10.x
- An [Expo](https://expo.dev) account
- [EAS CLI](https://docs.expo.dev/build/introduction/) installed globally: `npm install -g eas-cli`
- Firebase project with `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/jesusnwadavid9-commits/tijunctionapp.git
cd tijunctionapp
npm install
```

### 2. Add Firebase config files

Place your Firebase config files in the project root:

- `google-services.json` — from Firebase Console > Project Settings > Android app
- `GoogleService-Info.plist` — from Firebase Console > Project Settings > iOS app

### 3. Link to your Expo project

```bash
eas login
eas init --id your-project-id
```

This updates `app.json` with your actual project ID. Also update:
- `"owner"` in `app.json` with your Expo username
- `"updates.url"` with your project ID

## Building with EAS

### Development Build (for testing with dev tools)

```bash
# Android APK (install directly on device)
eas build --profile development --platform android

# iOS Simulator build
eas build --profile development --platform ios
```

### Preview Build (for internal testing / sharing)

```bash
# Android APK
eas build --profile preview --platform android

# iOS (requires Apple Developer account)
eas build --profile preview --platform ios
```

### Production Build (for store submission)

```bash
# Android AAB (for Google Play)
eas build --profile production --platform android

# iOS (for App Store)
eas build --profile production --platform ios
```

## Running Locally

```bash
# Start the dev server
npx expo start

# Run on Android (requires Android Studio + emulator or connected device)
npx expo run:android

# Run on iOS (requires Xcode, macOS only)
npx expo run:ios
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run android` | Start on Android |
| `npm run ios` | Start on iOS |
| `npm run web` | Start on web |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run lint` | Run Expo linting |

## Project Structure

```
src/
├── app/              # Screens (Expo Router file-based routing)
│   ├── (auth)/       # Login, Register, Reset Password
│   ├── (tabs)/       # Bottom tab screens (Feed, Search, Notifications, Messages, Profile)
│   ├── post/[id]     # Post detail screen
│   ├── user/[id]     # User profile screen
│   └── chat/[id]     # Chat screen
├── components/       # Reusable UI components
│   ├── ui/           # Button, Input, Avatar
│   ├── common/       # ErrorBoundary, Loading, EmptyState
│   ├── post/         # PostCard, CreatePostForm
│   ├── profile/      # ProfileHeader
│   └── chat/         # ChatBubble, ChatInput
├── services/         # Firebase service layer (auth, posts, users, messages, etc.)
├── hooks/            # Custom React hooks (useFeed, usePost, useProfile, etc.)
├── firebase/         # Firebase config, collection refs, converters
├── store/            # Zustand stores (auth, ads)
├── ads/              # AdMob integration (native, interstitial, rewarded)
├── notifications/    # Push notification handler
├── utils/            # Formatting, validation schemas
├── types/            # TypeScript interfaces
└── constants/        # App-wide constants (colors, spacing, ad config)
```

## Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password provider)
3. Create a **Firestore** database
4. Enable **Firebase Storage**
5. Enable **Cloud Messaging**
6. Enable **Analytics** and **Crashlytics**
7. Register Android app (`com.tijunction.app`) and download `google-services.json`
8. Register iOS app (`com.tijunction.app`) and download `GoogleService-Info.plist`

## AdMob

The app uses **test ad IDs** during development. Before deploying to production, replace the test IDs in `app.json` and `src/constants/index.ts` with your real AdMob IDs.

## License

MIT
