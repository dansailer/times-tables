# Times Tables Quest

A two-player competitive math training game with an adventure quest theme, designed for 8-11 year olds. Practice multiplication and division tables on iPad in fullscreen mode.

## Features

- Two-player competitive mode (screen rotates 180° between turns)
- Single-player practice mode
- Configurable times tables (2-10)
- Multiplication and division modes
- Easy mode (multiple choice) and Hard mode (number pad input)
- Adventure quest theme with 12 avatars
- Speed bonuses in hard mode
- Synthesized sound effects

## Tech Stack

- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **HTML5/CSS3** - No frameworks, pure vanilla
- **Web Audio API** - Synthesized sound effects
- **GitHub Pages** - Deployment

**Zero runtime dependencies** - fully offline capable.

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
times-tables/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.ts           # Entry point
│   ├── game/             # Core game logic
│   ├── ui/               # UI components and screens
│   ├── audio/            # Web Audio synthesis
│   └── styles/           # CSS files
└── public/               # Static assets
```

## Documentation

- [AGENTS.md](./AGENTS.md) - Project guidelines for developers
- [PLAN.md](./PLAN.md) - Implementation roadmap

## License

MIT
