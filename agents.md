# HabitForge — AI Agent Workflow Guide

A reference for working with AI coding agents (Cursor, Windsurf, Claude, GPT-4o)
to build the HabitForge React Native app efficiently.

---

## RECOMMENDED TOOLS

| Tool | Best For |
|---|---|
| **Cursor** (Agent mode) | Full project generation, multi-file edits |
| **Windsurf** (Cascade) | Large codebase awareness, step-by-step builds |
| **Claude** | Architecture decisions, complex logic, debugging |
| **GPT-4o** | Boilerplate generation, repetitive screen scaffolding |

---

## DELIVERABLE ORDER

Always build in this sequence. Each step must compile before moving to the next.

```
1.  Project scaffold + Metro + Babel config
2.  Theme system + navigation skeleton
3.  Clerk auth flow (onboarding + sign in/up)
4.  Firebase init + Firestore schema + security rules
5.  Zustand store + MMKV persistence layer
6.  Home screen (rings, habit list, FAB)
7.  Create/Quit habit flow
8.  Habit detail + completion memo
9.  Calendar + heatmap
10. Notifications (@notifee + FCM)
11. Friends + leaderboard + challenges
12. Widgets (iOS + Android)
13. Settings screen
14. Performance audit pass
```

---

## GENERAL TIPS

- Use **Agent mode** in Cursor or Windsurf — not chat mode — for full project generation
- Keep the main prompt in a `PROMPT.md` at root so the agent always has context
- After pasting the prompt, say:
  > "Start with step 1. Confirm when done and wait for me before proceeding to step 2."
- This prevents the agent from rushing and skipping steps or hallucinating files

---

## STEP CONTINUATION

If the agent stops or truncates mid-step, use:

```
"Continue with step N — [step name]"
```

Examples:
```
"Continue with step 6 — Home screen"
"Continue building the FAB radial menu from where you left off"
"You stopped mid-function in useHabits.ts — complete it"
```

---

## NATIVE MODULE TIPS

Native code (Swift / Kotlin / XML) often gets skipped or placeholder'd.
Prompt these separately after the main JS/TS build:

```
"Now write the full iOS WidgetKit Swift extension for HabitForge.
 Small widget: next due habit + streak.
 Medium widget: today's 3 rings + top 3 habits.
 Include the shared MMKV app group bridge."
```

```
"Now write the Android AppWidget — XML layouts (small + medium),
 AppWidgetProvider Kotlin class, and the shared preferences bridge
 that reads from MMKV on the RN side."
```

```
"Now write the @notifee channel setup, ringtone config, and all
 scheduled trigger logic for HabitForge notifications."
```

---

## PERFORMANCE AUDIT

After each screen is built, paste this and say **"audit this screen"**:

```
Performance Checklist:
[ ] No FlatList — FlashList everywhere
[ ] No setState inside gesture handlers — use shared values
[ ] No useEffect with missing deps
[ ] No inline object/array props in JSX
[ ] Firestore listeners unsubscribed in cleanup
[ ] MMKV writes are synchronous and minimal (no large JSON blobs)
[ ] All screens lazy loaded
[ ] Images use FastImage with cache
[ ] No console.log in production (stripped by babel plugin)
[ ] Hermes-compatible code (no unsupported syntax)
[ ] All animations on UI thread (no JS-thread Animated API usage)
[ ] React.memo on all pure components
[ ] useCallback/useMemo on all callbacks and derived values
```

---

## ANIMATION DRIFT FIX

If the agent starts writing `Animated.spring()` or JS-thread animations, stop it:

```
"Stop — all animations must use react-native-reanimated v3 on the UI thread.
 Rewrite using useSharedValue, useAnimatedStyle, withSpring, and withTiming only.
 No Animated API. No setState in animation callbacks."
```

Spring configs to enforce (paste if needed):
```ts
// springConfigs.ts
export const springs = {
  gentle:  { damping: 20, stiffness: 90,  mass: 1   },
  bouncy:  { damping: 10, stiffness: 120, mass: 0.8 },
  snappy:  { damping: 15, stiffness: 200, mass: 1   },
  slow:    { damping: 30, stiffness: 60,  mass: 1   },
}
```

---

## CLERK AUTH DRIFT FIX

If the agent tries to use Firebase Auth instead of Clerk:

```
"Auth must use Clerk only — not Firebase Auth.
 Use ClerkProvider in index.tsx, useUser() and useAuth() hooks.
 Firebase is for Firestore data storage only.
 Clerk JWT → Firebase custom token exchange happens in /services/clerk.ts
 via a Cloud Function. Do not mix auth providers."
```

---

## FIRESTORE RULES REMINDER

If the agent skips security rules, prompt:

```
"Write the complete firestore.rules file for HabitForge.
 Rules: users read/write own docs only, challenge participants
 can read shared challenge docs, no public reads anywhere."
```

---

## ZUSTAND SLICE DRIFT FIX

If the agent creates a single large store:

```
"Split the Zustand store into feature slices:
 habitsSlice, completionsSlice, friendsSlice, uiSlice.
 Each screen subscribes only to what it renders — no god-store.
 Combine in store/index.ts."
```

---

## WHEN THE AGENT GETS STUCK

Try these recovery prompts in order:

1. **File not found:**
   ```
   "List all files you've created so far, then continue."
   ```

2. **Type errors:**
   ```
   "Fix all TypeScript errors in the files you just wrote.
    Do not change logic — only fix types."
   ```

3. **Compile error after native module link:**
   ```
   "Show me the exact pod install / gradle sync command needed
    after adding [module name], and any manual linking steps
    required for React Native CLI (no Expo)."
   ```

4. **Agent loses context:**
   ```
   "Here is the full project structure so far: [paste tree output]
    Continue from step N."
   ```

5. **Complete reset on a screen:**
   ```
   "Delete everything in screens/[ScreenName] and rebuild it
    from scratch following the original spec. Confirm before writing."
   ```

---

## ENV VARS SETUP

Ask the agent to generate this at the start:

```
"Create a .env.example listing every required environment variable
 for HabitForge: Clerk publishable key, Firebase config keys,
 FCM sender ID, and any Cloud Function URLs."
```

Then for actual values:
```
"Read all env vars from .env using react-native-config.
 Never hardcode keys. Access as Config.CLERK_PUBLISHABLE_KEY etc."
```

---

## FINAL CHECKLIST BEFORE FIRST BUILD

Ask the agent to verify:

```
"Before I run the first build, confirm:
 1. babel.config.js has reanimated plugin listed FIRST
 2. Metro config has Hermes enabled and aliases set
 3. Proguard rules added for Android release
 4. All native modules are listed in ios/Podfile
 5. Info.plist has notification + camera permissions
 6. AndroidManifest has RECEIVE_BOOT_COMPLETED for scheduled notifs
 7. App group entitlement added for iOS widget MMKV bridge"
```

---

## QUICK REFERENCE — KEY LIBRARIES

| Purpose | Library |
|---|---|
| Auth | `@clerk/clerk-expo` (RN compatible) |
| Database | Firebase Firestore |
| Push (remote) | Firebase Cloud Messaging |
| Push (local) | `@notifee/react-native` |
| Animations | `react-native-reanimated` v3 |
| Gestures | `react-native-gesture-handler` v2 |
| Lists | `@shopify/flash-list` |
| Local storage | `react-native-mmkv` |
| Global state | `zustand` |
| SVG | `react-native-svg` |
| Images | `react-native-fast-image` |
| Bottom sheet | `@gorhom/bottom-sheet` v5 |
| Navigation | `@react-navigation/native` v6 + native-stack |
| Date logic | `date-fns` |
| Widgets (iOS) | `react-native-widget-extension` |
| QR | `react-native-camera` + custom QR gen |
| Skeleton | `react-native-skeleton-placeholder` |
| Toast | `react-native-flash-message` |
