# GSAP SPA Manager

A framework-agnostic GSAP animation manager for Single Page Applications with automatic cleanup, persistence, and ScrollTrigger support.

## Features

- **Framework Agnostic** - Works with Swup, Barba.js, Astro View Transitions, or standalone
- **Automatic Cleanup** - Animations are automatically killed on page transitions
- **Persistence Support** - Mark animations as persistent to survive page transitions
- **ScrollTrigger Management** - Centralized ScrollTrigger registration and cleanup
- **Context Management** - Uses `gsap.context()` for proper cleanup of side-effects
- **Multiple Formats** - ESM, CJS, and UMD builds available
- **Debug Mode** - Comprehensive logging for development

## Installation

```bash
npm install gsap-spa-manager gsap
# or
pnpm add gsap-spa-manager gsap
# or
yarn add gsap-spa-manager gsap
```

## Quick Start

### Standalone Usage (No SPA Router)

```typescript
import { AM } from 'gsap-spa-manager';
import { gsap } from 'gsap';

// Initialize (optional, enables debug mode)
AM.init({ debug: true });

// Create a simple animation
AM.animate('hero', gsap.from('.hero', { opacity: 0, y: 50 }));

// Create a timeline
const tl = AM.timeline('intro');
tl.from('.title', { opacity: 0 })
  .from('.subtitle', { opacity: 0 }, '-=0.3');

// Use setup for complex animations with cleanup
AM.setup('mySection', (ctx) => {
  gsap.to('.box', { rotation: 360, repeat: -1 });

  // Register side-effects with automatic cleanup
  const onClick = () => console.log('clicked');
  document.addEventListener('click', onClick);
  ctx?.add(() => () => document.removeEventListener('click', onClick));
});

// Cleanup when done
AM.cleanup('hero');
```

### With Swup

```typescript
import Swup from 'swup';
import { AM, swupAdapter } from 'gsap-spa-manager';

const swup = new Swup();
AM.init({
  debug: true,
  adapter: swupAdapter(swup)
});

// Animations will now automatically cleanup on page transitions
AM.setup('pageAnimations', () => {
  gsap.from('.content', { opacity: 0 });
});
```

### With Barba.js

```typescript
import barba from '@barba/core';
import { AM, barbaAdapter } from 'gsap-spa-manager';

barba.init();
AM.init({
  debug: true,
  adapter: barbaAdapter(barba)
});
```

### With Astro View Transitions

```typescript
import { AM, astroAdapter } from 'gsap-spa-manager';

// Astro adapter uses native DOM events, no router instance needed
AM.init({
  debug: true,
  adapter: astroAdapter()
});

// Optional: add delay before ScrollTrigger refresh
AM.init({
  adapter: astroAdapter({ refreshDelay: 100 })
});
```

### UMD (Browser Global)

```html
<script src="https://cdn.jsdelivr.net/npm/gsap"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap/ScrollTrigger"></script>
<script src="https://unpkg.com/gsap-spa-manager/dist/index.umd.js"></script>
<script>
  const { AM } = AnimationManager;
  AM.init({ debug: true });
  AM.animate('box', gsap.to('.box', { x: 100 }));
</script>
```

## API Reference

### `AM.init(options)`

Initialize the Animation Manager.

```typescript
AM.init({
  debug: boolean,      // Enable debug logging (default: false)
  adapter: SPAAdapter  // Optional SPA adapter for automatic cleanup
});
```

### `AM.destroy()`

Disconnect the adapter and force cleanup all animations.

```typescript
AM.destroy();
```

### `AM.animate(key, animation, options?)`

Register a GSAP animation (Tween or Timeline).

```typescript
// Single animation
AM.animate('myAnimation', gsap.to('.el', { x: 100 }));

// Multiple animations under one key
AM.animate('myAnimations', [
  gsap.to('.el1', { x: 100 }),
  gsap.to('.el2', { y: 50 })
]);

// With persistence (survives page transitions)
AM.animate('persistent', gsap.to('.el', { x: 100 }), { persist: true });
```

### `AM.timeline(key, vars?, options?)`

Create and register a GSAP Timeline.

```typescript
const tl = AM.timeline('myTimeline', { paused: true });
tl.to('.el', { x: 100 })
  .to('.el', { y: 50 });

// Persistent timeline
const persistentTl = AM.timeline('navbar', { paused: true }, { persist: true });
```

### `AM.setup(key, setupFn, options?)`

Execute a setup function within a `gsap.context()` for proper cleanup.

```typescript
AM.setup('mySetup', (ctx) => {
  // All GSAP animations here are tracked
  gsap.to('.el', { x: 100 });
  gsap.from('.other', { opacity: 0 });

  // Register non-GSAP side-effects for automatic cleanup
  ctx?.add(() => {
    const handler = () => {};
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  });
}, {
  persist: true,           // Survive cleanup
  scope: document.body     // Scope for GSAP selectors
});
```

### `AM.scroll(key, vars, options?)`

Create and register a ScrollTrigger.

```typescript
AM.scroll('myTrigger', {
  trigger: '.section',
  start: 'top center',
  end: 'bottom center',
  scrub: true,
  animation: gsap.to('.el', { x: 100 })
});

// Persistent ScrollTrigger
AM.scroll('navTrigger', {
  trigger: '.header',
  start: 'top top',
  pin: true
}, { persist: true });
```

### `AM.register(key, animation, options?)`

Register an externally created animation. Useful when you need more control over animation creation.

```typescript
const myTween = gsap.to('.el', { x: 100, paused: true });
AM.register('myTween', myTween);

// Register multiple animations
AM.register('batch', [tween1, tween2, timeline1]);
```

### `AM.registerScrollTriggers(key, triggers, options?)`

Register externally created ScrollTriggers.

```typescript
const st1 = ScrollTrigger.create({ trigger: '.a', ... });
const st2 = ScrollTrigger.create({ trigger: '.b', ... });
AM.registerScrollTriggers('myTriggers', [st1, st2]);
```

### `AM.cleanup(key, force?)`

Cleanup a specific animation by key.

```typescript
AM.cleanup('myAnimation');
AM.cleanup('persistentAnim', true); // Force cleanup even if persistent
```

### `AM.cleanupAll()`

Cleanup all non-persistent animations.

```typescript
AM.cleanupAll();
```

### `AM.forceCleanupAll()`

Cleanup everything, including persistent animations.

```typescript
AM.forceCleanupAll();
```

### `AM.refresh(keys?)`

Refresh ScrollTriggers.

```typescript
AM.refresh();              // Refresh all
AM.refresh('myTrigger');   // Refresh specific
AM.refresh(['a', 'b']);    // Refresh multiple
```

### `AM.removePersistence(key)`

Remove persistence from an animation, making it eligible for cleanup.

```typescript
AM.removePersistence('myAnimation');
```

### `AM.getStatus()`

Get current manager status.

```typescript
const status = AM.getStatus();
// {
//   animations: 5,
//   scrollTriggers: 3,
//   persistent: 2,
//   keys: ['hero', 'intro', ...],
//   persistentKeys: ['navbar', 'footer']
// }
```

### `AM.isActive(key)`

Check if an animation/setup is active.

```typescript
if (AM.isActive('hero')) {
  // Animation exists
}
```

### `AM.isPersistent(key)`

Check if an animation is marked as persistent.

```typescript
if (AM.isPersistent('navbar')) {
  // Won't be cleaned up on page transitions
}
```

### `AM.debug()`

Show detailed debug information in the console (only works if debug mode is enabled).

```typescript
AM.debug();
```

## Creating Custom Adapters

You can create adapters for any SPA router:

```typescript
import type { SPAAdapter } from 'gsap-spa-manager';

const myAdapter: SPAAdapter = {
  name: 'MyRouter',

  onBeforeSwap(callback) {
    // Called before page content is replaced
    myRouter.on('before:navigate', callback);
  },

  onAfterSwap(callback) {
    // Called after page content is replaced
    myRouter.on('after:navigate', callback);
  },

  destroy() {
    // Optional: cleanup when AM.destroy() is called
    myRouter.off('before:navigate');
    myRouter.off('after:navigate');
  }
};

AM.init({ adapter: myAdapter });
```

## Best Practices

1. **Use `setup()` for complex animations** - It provides automatic cleanup via `gsap.context()` and is ideal when you have multiple related animations and side-effects.

2. **Register all ScrollTriggers** - Use `AM.scroll()` instead of `ScrollTrigger.create()` directly to ensure proper cleanup on page transitions.

3. **Use persistence sparingly** - Only for animations that truly need to survive page transitions (e.g., navbar, persistent UI elements).

4. **Clean up manually when needed** - Call `AM.cleanup(key)` when removing elements dynamically, not just on page transitions.

5. **Use debug mode during development** - It helps track animation lifecycle and identify cleanup issues.

6. **Use unique keys** - Keys are used to track and cleanup animations. Reusing keys will skip registration (useful for preventing duplicates).

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type {
  SPAAdapter,
  AnimationManagerOptions,
  AnimationOptions,
  SetupOptions,
  AstroAdapterOptions
} from 'gsap-spa-manager';
```

## Browser Support

The UMD build exposes `AnimationManager` globally. The singleton instance `AM` is also available on `window.AM` for debugging in browser DevTools.

## License

MIT
