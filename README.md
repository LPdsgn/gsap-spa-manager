# GSAP SPA Manager

A framework-agnostic GSAP animation manager for Single Page Applications with automatic cleanup, persistence, and ScrollTrigger support.

## Features

- **Framework Agnostic** - Works with Swup, Barba.js, Astro, or standalone
- **Automatic Cleanup** - Animations are killed on page transitions
- **Persistence Support** - Mark animations to survive transitions
- **ScrollTrigger Management** - Centralized registration and cleanup
- **Multiple Formats** - ESM, CJS, and UMD builds

## Quick Start

```bash
npm install gsap-spa-manager gsap
```

```typescript
import { AM } from 'gsap-spa-manager';
import { gsap } from 'gsap';

AM.init({ debug: true });
AM.animate('hero', gsap.from('.hero', { opacity: 0, y: 50 }));
```

For full documentation and API reference, see the [package README](./packages/gsap-spa-manager/README.md).

## License

[MIT Licensed](./LICENSE). Made by [LPdsgn](https://github.com/LPdsgn).
