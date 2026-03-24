# Times Tables Quest - Agent Guidelines

## Project Overview

**Times Tables Quest** is a browser-based educational game for training multiplication and division tables. It is designed for 8-11 year olds and runs on iPad in fullscreen mode.

### Key Features
- Two-player competitive mode (screen rotates 180° between turns)
- Single-player practice mode
- Configurable times tables (2-10)
- Multiplication and division modes
- Easy mode (multiple choice) and Hard mode (number pad input)
- Adventure quest theme with avatars
- Gamification with speed bonuses (hard mode only)
- Synthesized sound effects using Web Audio API
- Internationalization (i18n) with automatic language detection

## Technical Stack

| Technology | Purpose |
|------------|---------|
| Vite | Build tool, dev server |
| TypeScript | Type safety |
| HTML5/CSS3 | UI (no frameworks) |
| Web Audio API | Sound effects |
| GitHub Pages | Deployment |

### Dependencies Policy
- **ZERO runtime dependencies** - all features use vanilla TypeScript and browser APIs
- Dev dependencies limited to: `vite`, `typescript`
- No CDNs or external scripts

## Architecture

### File Structure
```
times-tables/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.ts
│   ├── game/           # Core game logic
│   ├── ui/             # UI components and screens
│   ├── audio/          # Web Audio synthesis
│   ├── i18n/           # Internationalization
│   └── styles/         # CSS files
└── public/             # Static assets
```

### Design Patterns
- **State Machine**: Game flow controlled by state transitions
- **Component Pattern**: UI elements as reusable TypeScript classes
- **Event-Driven**: User input handled via event listeners

## Code Standards

### TypeScript
- Strict mode enabled
- Explicit types for function parameters and returns
- Use interfaces for data structures
- Prefer `const` over `let`

### CSS
- CSS custom properties for theming
- BEM-style naming for classes
- Mobile-first, touch-optimized
- Minimum touch target: 44x44px

### Git Workflow
- Small, focused PRs for each phase
- Descriptive commit messages
- Branch naming: `feature/<phase-name>` or `fix/<issue>`

## Game Configuration

### Avatars (12 total - diverse selection)
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

### Rounds
Configurable: 5, 10, or 15 rounds per game

## Security Considerations
- No external runtime dependencies
- Fully offline capable
- No user data collection
- No network requests
- CSP compatible

## Testing Guidelines
- Test on iPad Safari (primary target)
- Verify touch interactions
- Test fullscreen mode
- Check 180° rotation transitions
- Validate all times tables combinations
