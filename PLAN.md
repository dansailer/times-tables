# Times Tables Quest - Implementation Plan

## Project Summary

A two-player competitive math training game with adventure quest theme for 8-11 year olds. Runs on iPad in fullscreen mode with 180° rotation between player turns.

## Implementation Phases

Each phase results in a separate PR for easy review.

---

## Phase 1: Project Setup
**Branch**: `feature/project-setup`
**PR**: #2

### Tasks
- [x] Initialize Vite + TypeScript project with pnpm
- [x] Configure tsconfig.json with strict mode
- [x] Set up vite.config.ts for GitHub Pages
- [x] Create base HTML structure
- [x] Set up CSS with theme variables
- [x] Create placeholder main.ts

### Files Created
```
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.ts
│   └── styles/
│       └── main.css
```

### Acceptance Criteria
- `pnpm dev` starts development server
- `pnpm build` creates production build
- Basic page loads with adventure theme styling

---

## Phase 2: Core Game Logic
**Branch**: `feature/game-logic`
**PR**: #3

### Tasks
- [x] Create TypeScript interfaces (types.ts)
- [x] Implement i18n system with browser language detection
- [x] Add English and German translations
- [x] Implement Question generator
- [x] Build Timer class with callbacks
- [x] Create Scoring module with speed bonus
- [x] Build Game state machine

### Files Created
```
src/game/
├── types.ts
├── Game.ts
├── Question.ts
├── Timer.ts
└── Scoring.ts
src/i18n/
├── index.ts
├── translations/
│   ├── en.ts
│   └── de.ts
```

### Acceptance Criteria
- Question generator produces valid math problems
- Timer counts down and triggers callbacks
- Scoring calculates correctly with speed bonus
- Game state transitions work properly
- Language auto-detected from browser
- All UI text uses translation system

---

## Phase 3: UI Components
**Branch**: `feature/ui-components`
**PR**: #4

### Tasks
- [x] Build TimerBar component
- [x] Create NumberPad for hard mode
- [x] Create MultipleChoice for easy mode
- [x] Build AvatarPicker with 12 avatars
- [x] Implement 180° rotation system

### Files Created
```
src/ui/
├── index.ts
├── components/
│   ├── Component.ts
│   ├── TimerBar.ts
│   ├── NumberPad.ts
│   ├── MultipleChoice.ts
│   └── AvatarPicker.ts
├── rotation.ts
src/styles/
└── components.css
```

### Acceptance Criteria
- All components render correctly
- Touch targets are 44x44px minimum
- NumberPad returns entered values
- Avatar selection works for both players
- Rotation animates smoothly

---

## Phase 4: Game Screens
**Branch**: `feature/screens`
**PR**: #5

### Tasks
- [ ] Build StartScreen (mode selection)
- [ ] Build SetupScreen (configuration)
- [ ] Build GameScreen (gameplay)
- [ ] Build ResultsScreen (winner/stats)
- [ ] Wire up screen navigation

### Files Created
```
src/ui/screens/
├── StartScreen.ts
├── SetupScreen.ts
├── GameScreen.ts
└── ResultsScreen.ts
```

### Acceptance Criteria
- All screens render properly
- Navigation between screens works
- Game configuration persists through screens
- Full game loop is playable

---

## Phase 5: Audio & Animations
**Branch**: `feature/audio-animations`
**PR**: #7

### Tasks
- [x] Implement Web Audio synthesizer
- [x] Create sound effects (correct, wrong, tick, fanfare)
- [x] Add CSS animations (confetti, shake, pulse)
- [x] Implement celebration sequences
- [x] Add visual feedback for answers

### Files Created
```
src/audio/
└── SoundEngine.ts
src/styles/
└── animations.css
src/ui/
└── animations.ts
```

### Acceptance Criteria
- Sound effects play on correct/wrong answers
- Timer ticks audibly in final seconds
- Victory fanfare plays at game end
- Confetti animation works
- All animations are smooth (60fps)

---

## Phase 6: Polish & Testing
**Branch**: `feature/polish`
**PR**: #8

### Tasks
- [x] Remove console.log statements
- [x] Fix double event firing on touch devices
- [x] Add aria-live to question display for accessibility
- [x] Add error handling to SoundEngine async operations
- [x] Fix race condition in GameScreen timeout handling
- [x] Clean up sound init event listeners properly
- [x] Remove unused game singleton export
- [ ] Test on iPad Safari
- [ ] Test on iPhone Safari (responsive design)
- [ ] Verify fullscreen mode (Add to Home Screen)
- [ ] Test all times tables combinations
- [ ] Verify touch interactions
- [ ] Performance optimization
- [ ] Accessibility review (contrast, touch targets)

### Acceptance Criteria
- No console errors
- Smooth performance on iPad and iPhone
- All game modes work correctly
- Touch targets are accessible
- Fullscreen mode works via Add to Home Screen
- PWA prompt shown on first visit

---

## Phase 7: GitHub Pages Deployment
**Branch**: `feature/deployment`
**PR**: #8

### Tasks
- [ ] Configure Vite base path for GitHub Pages
- [ ] Set up GitHub Actions workflow
- [ ] Deploy to GitHub Pages
- [ ] Test deployed version
- [ ] Update README with live link

### Files Created
```
.github/workflows/
└── deploy.yml
```

### Acceptance Criteria
- Site deploys automatically on push to main
- Live site is accessible
- All features work in deployed version

---

## Progress Tracking

| Phase | Status | PR | Branch |
|-------|--------|------|--------|
| 1. Project Setup | Complete | #2 | `feature/project-setup` |
| 2. Core Game Logic | Complete | #3 | `feature/game-logic` |
| 3. UI Components | Complete | #4 | `feature/ui-components` |
| 4. Game Screens | Complete | #6 | `feature/screens` |
| 5. Audio & Animations | Complete | #7 | `feature/audio-animations` |
| 6. Polish & Testing | In Progress | #8 | `feature/polish` |
| 7. Deployment | Complete | - | Hardened workflow deployed |

---

## Game Configuration Reference

### Avatars (12 total)
| Avatar | Emoji | Style |
|--------|-------|-------|
| Wizard | 🧙 | Classic |
| Knight | ⚔️ | Classic |
| Dragon | 🐉 | Creature |
| Elf | 🧝 | Fantasy |
| Archer | 🏹 | Classic |
| Pirate | 🏴‍☠️ | Adventure |
| Princess | 👸 | Feminine |
| Fairy | 🧚 | Feminine |
| Mermaid | 🧜‍♀️ | Feminine |
| Unicorn | 🦄 | Feminine |
| Ninja | 🥷 | Action |
| Explorer | 🧭 | Adventure |

### Difficulty Settings
| Level | Time | Speed Bonus |
|-------|------|-------------|
| Easy | 15s | No |
| Medium | 10s | No |
| Hard | 5s | Yes |

### Round Options
- 5 rounds (quick)
- 10 rounds (standard)
- 15 rounds (extended)
