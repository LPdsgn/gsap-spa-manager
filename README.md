<p align="center">
  <img alt="GSAP SPA Manager" src="https://shieldcn.dev/header/graph.svg?title=GSAP+SPA+Manager&subtitle=A+framework-agnostic+GSAP+animation+manager+for+Single+Page+Applications+with+automatic+cleanup%2C+persistence%2C+and+ScrollTrigger+support.&logo=gsap&size=wide&mode=dark">
</p>
<p align="center">
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://www.shieldcn.dev/github/ci/LPdsgn/gsap-spa-manager.svg?variant=secondary&amp;size=sm&amp;mode=dark"><img alt="CI" src="https://www.shieldcn.dev/github/ci/LPdsgn/gsap-spa-manager.svg?variant=secondary&amp;size=sm&amp;mode=light"></picture>
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/github/vercel/next.js/license.svg?variant=outline&amp;logo=lu%3AScale&amp;mode=dark"><img alt="badge" src="https://shieldcn.dev/github/vercel/next.js/license.svg?variant=outline&amp;logo=lu%3AScale&amp;mode=light"></picture>
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://www.shieldcn.dev/badge/Package_mgr-pnpm-F69220.svg?logo=pnpm&amp;variant=branded&amp;size=sm&amp;mode=dark"><img alt="Package mgr · pnpm" src="https://www.shieldcn.dev/badge/Package_mgr-pnpm-F69220.svg?logo=pnpm&amp;variant=branded&amp;size=sm&amp;mode=light"></picture>
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://www.shieldcn.dev/badge/Lint-Biome-60A5FA.svg?logo=biome&amp;variant=branded&amp;size=sm&amp;mode=dark"><img alt="Lint · Biome" src="https://www.shieldcn.dev/badge/Lint-Biome-60A5FA.svg?logo=biome&amp;variant=branded&amp;size=sm&amp;mode=light"></picture>
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://www.shieldcn.dev/badge/Releases-Changesets-5846F5.svg?logo=changesets&amp;variant=branded&amp;size=sm&amp;mode=dark"><img alt="Releases · Changesets" src="https://www.shieldcn.dev/badge/Releases-Changesets-5846F5.svg?logo=changesets&amp;variant=branded&amp;size=sm&amp;mode=light"></picture>
</p>

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
import { AM } from '@lpdsgn/gsap-spa-manager';
import { gsap } from 'gsap';

AM.init({ debug: true });
AM.animate('hero', gsap.from('.hero', { opacity: 0, y: 50 }));
```

For full documentation and API reference, see the [package README](./packages/gsap-spa-manager/README.md).

## License

[MIT Licensed](./LICENSE). Made by [LPdsgn](https://github.com/LPdsgn).
