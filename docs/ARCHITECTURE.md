# TI Junction — Architecture Document

## Overview

TI Junction is a native social media application built with React Native (Expo SDK 56), Firebase, and AdMob. The architecture follows a feature-based modular pattern with clear separation of concerns.

## Layer Architecture

```
┌─────────────────────────────────────────┐
│              Screens (app/)             │  Expo Router file-based screens
├─────────────────────────────────────────┤
│           Components (components/)      │  Reusable UI + feature components
├─────────────────────────────────────────┤
│     Hooks (hooks/) + Store (store/)     │  TanStack Query + Zustand
├─────────────────────────────────────────┤
│            Services (services/)         │  Firebase CRUD operations
├─────────────────────────────────────────┤
│     Firebase (firebase/) + Types        │  Config, collections, converters
└─────────────────────────────────────────┘
```

## Data Flow

1. **Screens** consume hooks for data + state
2. **Hooks** use TanStack Query for server state (caching, pagination, invalidation)
3. **Zustand stores** manage client-only state (auth, ads)
4. **Services** execute Firestore/Storage/Auth operations
5. **Converters** transform Firestore documents into typed models

## Navigation

Expo Router with file-based routing:
- `(auth)/` — Login, Register, Reset Password (Stack)
- `(tabs)/` — Main app with Bottom Tabs: Feed, Search, Notifications, Messages, Profile
- `post/[id]` — Post detail with comments
- `user/[id]` — User profile
- `chat/[id]` — Chat conversation

## State Management

| Concern | Solution |
|---------|----------|
| Server State (posts, users, messages) | TanStack Query |
| Auth State | Zustand (`authStore`) |
| Ad State (cooldowns, counters) | Zustand (`adStore`) |
| Real-time data (messages, typing) | Firestore `onSnapshot` listeners |

## Ad Strategy

- **Native Ads**: Interleaved in feed every 5 posts via data transform
- **Interstitial**: Shown after every 10 post opens with 60s frequency cap
- **Rewarded Video**: Available every 5 minutes with countdown timer

## Firebase Collections

7 top-level collections with sub-collections for scalable social graph queries:
- `users` → `followers`, `following`, `savedPosts`
- `posts` → `likes`, `comments`
- `conversations` → `messages`
- `notifications`
- `reports`

## Performance Strategy

- FlashList for all long lists (60fps scrolling)
- Memo'd components (`React.memo`)
- Cursor-based Firestore pagination
- Firestore offline persistence
- expo-image for optimized image loading with caching
- Lazy ad loading with recycling
