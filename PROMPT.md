# HabitForge — Full Build Prompt

> Paste this entire file into your AI agent (Cursor / Windsurf / Claude) to begin.
> Keep this file at project root. Re-paste when the agent loses context.
> See `agents.md` for workflow tips, recovery prompts, and step-by-step guidance.

---

Build a complete React Native CLI app (no Expo) called "HabitForge" — a
premium habit tracker. Production-quality, fully optimized, TypeScript
throughout.

---

## TECH STACK

- React Native CLI (bare workflow, no Expo)
- React Navigation v6 (stack + bottom tabs)
- react-native-reanimated v3 — ALL animations on UI thread
- react-native-gesture-handler v2
- react-native-mmkv — local persistence (replaces AsyncStorage)
- Zustand — global state (lightweight, no boilerplate)
- Firebase Firestore — cloud storage (habits, completions, friends)
- Firebase Cloud Messaging (FCM) — remote push notifications
- @notifee/react-native — local scheduled notifications + ringtones
- react-native-svg — activity rings, heatmap
- react-native-widget-extension (iOS) + Android AppWidget
- @shopify/flash-list — all lists (never FlatList)
- react-native-fast-image — all remote images
- @gorhom/bottom-sheet v5 — all bottom sheets
- date-fns — all date logic
- react-native-flash-message — toast feedback
- react-native-skeleton-placeholder — loading states
- react-native-config — environment variables
- Flipper + Reactotron — debug tooling (dev only, stripped in release)

---

## OPTIMIZATION RULES

> Enforce in every file. Non-negotiable.

### React / JS

- Every list → FlashList, never FlatList
- Every component → React.memo() unless it owns top-level global state
- All callbacks → useCallback, all derived values → useMemo
- No anonymous functions as JSX props
- No inline object or array literals as JSX props
- Zustand: one slice per feature domain, no god-store
- Selectors are granular — components subscribe only to what they render
- Heavy computations (streak calc, ring %, heatmap matrix) → worklets
- All screens lazy-loaded with React.lazy + Suspense boundary
- No console.log in production (stripped via babel-plugin-transform-remove-console)

### Animations

- 100% UI thread — useAnimatedStyle, useSharedValue, withSpring, withTiming
- Zero JS-thread animations — no Animated API, no setState in animation callbacks
- All worklets annotated with the `'worklet'` directive
- Spring configs defined once in /animations/springConfigs.ts, never inline

### Navigation

- Native stack (@react-navigation/native-stack) for all push screens
- Each tab owns its own nested stack navigator
- Deep linking configured for widget taps + notification taps

### Firebase / Network

- All Firestore reads use onSnapshot with unsubscribe in useEffect cleanup
- Writes are optimistic — update MMKV + Zustand instantly, sync Firestore async
- Batch writes for bulk habit completions
- Firestore offline persistence enabled (memory cache on native)
- Firestore security rules enforced — see firestore.rules

### Assets / Images

- All icons → SVG React components, no PNG icons
- Remote avatars → FastImage with priority + cache policy set
- Splash + onboarding assets → webp format

### Bundle

- Hermes engine enabled (Android + iOS)
- RAM bundles / inline requires enabled for Android
- Metro config: tree shaking on, path aliases for /src
- Proguard rules included for Android release builds
- All env vars via react-native-config, never hardcoded

---

## AUTH — CLERK

- ClerkProvider wraps the entire app in index.tsx
- Sign-in methods: Email/password, Google OAuth, Apple Sign-In (iOS)
- Hooks: useUser() and useAuth() from @clerk/clerk-expo
- On first sign-in → create Firestore user doc if not exists
- Clerk userId is the Firestore document ID for all user docs
- JWT from Clerk exchanged for Firebase custom auth token via Cloud Function
  (see /services/clerk.ts)
- Auth-gated navigation:
  unauthenticated → AuthStack
  authenticated → MainTabs
- Session refresh handled automatically by Clerk SDK
- Never use Firebase Auth — Clerk is the sole auth provider

---

## FIRESTORE SCHEMA

```
users/{clerkUserId}
  username        string
  avatarUrl       string
  createdAt       timestamp
  friends         clerkUserId[]
  challenges      challengeId[]

habits/{habitId}
  ownerId         string  (clerkUserId)
  name            string
  icon            string  (emoji)
  color           string  (hex)
  category        string
  frequency       'daily' | 'weekly' | 'monthly' | 'yearly'
  targetCount     number
  isQuitHabit     boolean
  reminderTime    string  (HH:mm)
  ringtone        string
  createdAt       timestamp
  archivedAt      timestamp | null

completions/{completionId}
  habitId         string
  ownerId         string  (clerkUserId)
  completedAt     timestamp
  memo            string  (max 280 chars)
  mood            1 | 2 | 3 | 4 | 5

challenges/{challengeId}
  habitId         string
  participants    clerkUserId[]
  startDate       timestamp
  sharedStreak    number
  lastCompletions { [clerkUserId]: timestamp }
```

Composite indexes:

- completions: ownerId ASC + completedAt DESC
- habits: ownerId ASC + frequency ASC

---

## FIRESTORE SECURITY RULES

> Write to firestore.rules at project root.

- Users can only read and write their own user doc
- Users can read/write habits and completions where ownerId == request.auth.uid
- Challenge docs readable by all participants listed in participants[]
- No public reads anywhere
- No writes without authentication

---

## SCREENS & FEATURES

### ONBOARDING (one-time, gated by MMKV flag)

- 3 swipeable intro screens (PanGestureHandler + spring snap)
- Step 3: pick 3 starter habits from baked-in library
- Clerk sign-up embedded on final step
- On complete: set onboardingDone flag in MMKV, navigate to MainTabs

### HOME / DASHBOARD

- 3 concentric SVG activity rings: Daily / Weekly / Monthly completion %
- Ring stroke animates 0 → value on screen focus (withSpring, bouncy config)
- Today's habits in FlashList, grouped by category
- Swipe right to complete (spring snap + haptic)
- Swipe left to skip / add memo (spring snap)
- Streak flame badge on habit card; animate on milestones: 10, 30, 100 days
- Floating FAB with spring-stagger radial menu:
  options: + New Habit | + Quit Habit | Browse Library
- Skeleton loaders while Firestore snapshot initializes

### HABIT CREATION / QUIT HABIT FLOW

- Multi-step @gorhom/bottom-sheet (spring entry animation)
- Steps: Type → Name / Icon / Color → Frequency → Reminder → Confirm
- Frequency: Daily, Weekly, Monthly, Yearly
- Quit habit mode: tracks start date, shows "X days clean" ring
- Reminder: time picker + ringtone picker (3 bundled tones + system picker)
- Baked-in library (one-tap add):
  Water 8 Glasses, Sleep 8hrs, Meditate 10min, Exercise 30min,
  Read 30min, No Social Media, Journal, Vitamins, Cold Shower,
  Gratitude, Walk 10k Steps, No Alcohol, No Smoking, Floss,
  Learn Something New
- Write order: MMKV → Zustand → Firestore (optimistic)

### HABIT DETAIL & COMPLETION MEMO

- On complete: SVG checkmark stroke-draw + confetti burst
  (Reanimated particle system, 30 nodes max, auto-cleanup at 1200ms)
- Memo bottom sheet: 280 char limit, mood selector (5 emoji)
- Full completion log: FlashList timeline, paginated
- Per-habit heatmap: 12-week GitHub-style SVG grid
- Actions: Edit, Archive, Delete (spring confirmation modal)

### CALENDAR VIEW

- Custom month grid built with useMemo (no heavy calendar library)
- Each cell: colored completion dots per habit
- Tap a day → side sheet slides in (Reanimated translateX spring)
  showing all habits + status + memos for that day
- Swipe between months: PanGestureHandler + spring snap at boundary
- Yearly heatmap tab: 52-week SVG grid, color intensity = completion count

### NOTIFICATIONS & REMINDERS

- @notifee scheduled triggers, one per habit reminder time
- Notification channels per category (Health, Mindfulness, Fitness, Custom)
- Bundled ringtones:
  Android → /android/app/src/main/res/raw/_.mp3
  iOS → /ios/HabitForge/Sounds/_.mp3
- Notification copy: warm and specific, never robotic
  e.g. "Your 7-day streak is on the line 🔥" not "Reminder: complete habit"
- Missed habit → follow-up notification 2hrs later (only if not completed)
- FCM remote push:
  - friend completes a shared habit
  - challenge streak update or break

### FRIENDS & COMPETE

- Add friend: username search (Firestore query) or QR code scan
  (react-native-camera + custom QR generator)
- Friend leaderboard: ranked by weekly completion %, live via onSnapshot
- Challenges: pick a habit, invite a friend, both must complete daily
- Shared streak: breaks if either participant misses a day
- FCM push on: friend completion, streak milestone, streak break
- Friend card: FastImage avatar, streak count, mini completion ring

### WIDGETS

- iOS WidgetKit Swift extension:
  Small: next due habit + current streak
  Medium: today's 3 activity rings + top 3 habits
- Android AppWidget (RemoteViews):
  Same layouts as iOS equivalents
- Data bridge:
  iOS → MMKV with shared app group entitlement
  Android → SharedPreferences written on every Zustand state update
- Widget tap → deep link opens specific habit detail screen

### SETTINGS

- Theme: Dark / Light / System auto (persisted in MMKV)
- Notification preferences per category (toggle + time override)
- Account: Clerk profile view, sign out, delete account + data
- Export: full JSON export of all habits + completions
- App version, open source licenses

---

## ANIMATION SPECS

> All animations use react-native-reanimated v3 on the UI thread.

### Spring Configs — /animations/springConfigs.ts

```ts
export const springs = {
  gentle: { damping: 20, stiffness: 90, mass: 1 },
  bouncy: { damping: 10, stiffness: 120, mass: 0.8 },
  snappy: { damping: 15, stiffness: 200, mass: 1 },
  slow: { damping: 30, stiffness: 60, mass: 1 },
};
```

### Per-element Rules

| Element             | Animation                                                                  |
| ------------------- | -------------------------------------------------------------------------- |
| List items mount    | staggered translateY(20→0) + opacity, 40ms gap per item                    |
| Habit complete      | scale bouncy 1→1.3→1 + SVG checkmark stroke-draw                           |
| Bottom sheet entry  | spring gentle                                                              |
| Tab bar icons       | scale bouncy 1→0.85→1 on press                                             |
| Activity rings      | withSpring 0→value on screen focus                                         |
| FAB radial items    | spring bouncy, 60ms stagger per item, icon rotates 45°                     |
| Calendar swipe      | spring snappy snap to month boundary                                       |
| Theme switch        | interpolateColor over 250ms on bg + card surfaces                          |
| Confetti            | 30 Reanimated nodes, random translateX/Y/rotate/opacity, removed at 1200ms |
| Habit card → detail | shared element: position + size interpolation                              |

---

## THEME

```
Dark mode:
  background  #0D0D0D
  card        #1C1C1E
  border      #2C2C2E
  text        #FFFFFF
  subtext     #8E8E93

Light mode:
  background  #F2F2F7
  card        #FFFFFF
  border      #E5E5EA
  text        #000000
  subtext     #6C6C70

Accent:     per-habit user-chosen color (12-color default palette)
Font:       system default (SF Pro on iOS, Roboto on Android)
Radius:     card 16, button 12, chip 8
Shadow:     iOS shadow* props, Android elevation
```

---

## FOLDER STRUCTURE

```
HabitForge/
├── src/
│   ├── app/
│   │   ├── index.tsx              ← ClerkProvider + NavigationContainer
│   │   └── _layout.tsx            ← auth gate logic
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── AuthStack.tsx
│   │   ├── MainTabs.tsx
│   │   ├── HabitsStack.tsx
│   │   └── FriendsStack.tsx
│   ├── screens/
│   │   ├── Onboarding/
│   │   ├── Home/
│   │   ├── HabitDetail/
│   │   ├── CreateHabit/
│   │   ├── Calendar/
│   │   ├── Friends/
│   │   ├── Leaderboard/
│   │   └── Settings/
│   ├── components/
│   │   ├── ActivityRing/          ← SVG + Reanimated
│   │   ├── HabitCard/             ← memo'd, gesture-enabled
│   │   ├── MemoBottomSheet/
│   │   ├── CalendarGrid/
│   │   ├── HeatmapRow/
│   │   ├── FriendCard/
│   │   ├── ConfettiOverlay/
│   │   ├── SkeletonHabitCard/
│   │   └── FABMenu/
│   ├── animations/
│   │   ├── springConfigs.ts
│   │   ├── staggeredList.ts
│   │   ├── useConfetti.ts
│   │   └── useSharedElement.ts
│   ├── hooks/
│   │   ├── useHabits.ts           ← Firestore + Zustand sync
│   │   ├── useCompletions.ts
│   │   ├── useNotifications.ts
│   │   ├── useFriends.ts
│   │   ├── useTheme.ts
│   │   ├── useWidget.ts           ← writes shared MMKV for widgets
│   │   └── useStreaks.ts          ← streak calc worklet
│   ├── store/
│   │   ├── habitsSlice.ts
│   │   ├── completionsSlice.ts
│   │   ├── friendsSlice.ts
│   │   ├── uiSlice.ts             ← theme, modals, loading flags
│   │   └── index.ts               ← combine all slices
│   ├── services/
│   │   ├── firebase.ts            ← init + Firestore helpers
│   │   ├── clerk.ts               ← Clerk → Firebase token exchange
│   │   ├── notifications.ts       ← @notifee setup + scheduling
│   │   ├── fcm.ts                 ← FCM listener + handler
│   │   └── widgets.ts             ← shared storage bridge
│   ├── utils/
│   │   ├── streakCalc.ts          ← pure functions, worklet-safe
│   │   ├── dateHelpers.ts
│   │   ├── habitDefaults.ts       ← baked-in library definitions
│   │   └── formatters.ts
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── shadows.ts
│   ├── types/
│   │   ├── habit.ts
│   │   ├── user.ts
│   │   ├── completion.ts
│   │   └── challenge.ts
│   └── config/
│       ├── clerk.ts               ← reads CLERK_PUBLISHABLE_KEY from env
│       ├── firebase.ts            ← reads Firebase config from env
│       └── notifee.ts             ← channel + ringtone definitions
│
├── android/
│   ├── app/src/main/res/raw/      ← bundled ringtone .mp3 files
│   └── widget/                    ← AppWidget provider + XML layouts
│
├── ios/
│   ├── HabitForgeWidget/          ← WidgetKit Swift extension
│   └── HabitForge/Sounds/         ← bundled ringtone .mp3 files
│
├── firestore.rules                ← Firestore security rules
├── .env.example                   ← all required env vars listed
├── metro.config.js                ← tree shaking + path aliases
├── babel.config.js                ← reanimated plugin FIRST
├── PROMPT.md                      ← this file
└── agents.md                      ← agent workflow guide
```

---

## ENV VARS

> All accessed via react-native-config as Config.KEY_NAME

```
# Clerk
CLERK_PUBLISHABLE_KEY=

# Firebase
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
FIREBASE_MEASUREMENT_ID=

# FCM
FCM_SENDER_ID=

# Cloud Functions
CLOUD_FUNCTIONS_BASE_URL=
```

---

## PRE-BUILD CHECKLIST

> Verify before running the first iOS or Android build.

```
[ ] babel.config.js — reanimated plugin is listed FIRST before all others
[ ] metro.config.js — Hermes enabled, path aliases configured
[ ] Proguard rules added for Android release
[ ] All native modules listed in ios/Podfile
[ ] Info.plist has entries for:
      NSUserNotificationsUsageDescription
      NSCameraUsageDescription
      NSPhotoLibraryUsageDescription
[ ] AndroidManifest.xml has:
      RECEIVE_BOOT_COMPLETED (for scheduled notifications on reboot)
      POST_NOTIFICATIONS (Android 13+)
      CAMERA permission
[ ] iOS app group entitlement added for MMKV widget bridge
[ ] Android widget receiver registered in AndroidManifest.xml
[ ] .env file present with all required keys (copy from .env.example)
[ ] Clerk publishable key set correctly for environment (dev/prod)
[ ] Firebase google-services.json in /android/app/
[ ] Firebase GoogleService-Info.plist in /ios/HabitForge/
```

---

## DELIVERABLE ORDER

> Build strictly in this order. Each step must compile before proceeding.
> See agents.md for continuation prompts and recovery strategies.

```
Step 1  — Project scaffold + Metro + Babel config
Step 2  — Theme system + navigation skeleton
Step 3  — Clerk auth flow (onboarding + sign in/up screens)
Step 4  — Firebase init + Firestore schema + security rules
Step 5  — Zustand store slices + MMKV persistence layer
Step 6  — Home screen (activity rings, habit list, FAB)
Step 7  — Create Habit + Quit Habit flow
Step 8  — Habit detail screen + completion memo
Step 9  — Calendar view + heatmap
Step 10 — Notifications (@notifee local + FCM remote)
Step 11 — Friends, leaderboard, and challenges
Step 12 — Widgets (iOS WidgetKit + Android AppWidget)
Step 13 — Settings screen
Step 14 — Performance audit pass (run checklist against every screen)
```

---

> Start with Step 1.
> Confirm completion of each step and wait for approval before proceeding.
> All code must compile. No placeholder TODOs in final output.
