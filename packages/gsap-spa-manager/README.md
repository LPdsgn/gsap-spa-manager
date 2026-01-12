# GSAP SPA Manager

A framework-agnostic GSAP animation manager for Single Page Applications with automatic cleanup, persistence, and ScrollTrigger support.

## Features

- 🎯 **Framework Agnostic** - Works with any SPA framework (Swup, Barba.js, custom routers, or standalone)
- 🧹 **Automatic Cleanup** - Animations are automatically killed on page transitions
- 💾 **Persistence Support** - Mark animations as persistent to survive page transitions
- 📜 **ScrollTrigger Management** - Centralized ScrollTrigger registration and cleanup
- 🔧 **Context Management** - Uses `gsap.context()` for proper cleanup of side-effects
- 📦 **Multiple Formats** - ESM, CJS, and UMD builds available
- 🔍 **Debug Mode** - Comprehensive logging for development

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
import { AM, createSwupAdapter } from 'gsap-spa-manager';

const swup = new Swup();
AM.init({ 
  debug: true,
  adapter: createSwupAdapter(swup) 
});

// Animations will now automatically cleanup on page transitions!
AM.setup('pageAnimations', () => {
  gsap.from('.content', { opacity: 0 });
});
```

### With Barba.js

```typescript
import barba from '@barba/core';
import { AM, createBarbaAdapter } from 'gsap-spa-manager';

barba.init();
AM.init({ 
  debug: true,
  adapter: createBarbaAdapter(barba) 
});
```

### UMD (Browser Global)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.0/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.0/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/gsap-spa-manager/dist/index.umd.js"></script>
<script>
  const { AM } = GSAPSPAManager;
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

### `AM.animate(key, animation, options?)`

Register a GSAP animation (Tween or Timeline).

```typescript
AM.animate('myAnimation', gsap.to('.el', { x: 100 }));
AM.animate('myAnimation', gsap.timeline().to('.el', { x: 100 }));

// With persistence
AM.animate('persistent', gsap.to('.el', { x: 100 }), { persist: true });
```

### `AM.timeline(key, vars?, options?)`

Create and register a GSAP Timeline.

```typescript
const tl = AM.timeline('myTimeline', { paused: true });
tl.to('.el', { x: 100 });
```

### `AM.setup(key, setupFn, options?)`

Execute a setup function within a `gsap.context()` for proper cleanup.

```typescript
AM.setup('mySetup', (ctx) => {
  // All GSAP animations here are tracked
  gsap.to('.el', { x: 100 });
  
  // Register non-GSAP side-effects
  ctx?.add(() => {
    const handler = () => {};
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  });
}, { 
  persist: true,           // Survive cleanup
  scope: document.body     // Scope for selectors
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
```

### `AM.cleanup(key, force?)`

Cleanup a specific animation by key.

```typescript
AM.cleanup('myAnimation');
AM.cleanup('persistentAnim', true); // Force cleanup even if persistent
```

### `AM.cleanupAll()`

Cleanup all non-persistent animations.

### `AM.forceCleanupAll()`

Cleanup everything, including persistent animations.

### `AM.refresh(keys?)`

Refresh ScrollTriggers.

```typescript
AM.refresh();           // Refresh all
AM.refresh('myTrigger'); // Refresh specific
AM.refresh(['a', 'b']); // Refresh multiple
```

### `AM.getStatus()`

Get current manager status.

```typescript
const status = AM.getStatus();
// { animations: 5, scrollTriggers: 3, persistent: 2, keys: [...], persistentKeys: [...] }
```

### `AM.isActive(key)`

Check if an animation/setup is active.

### `AM.isPersistent(key)`

Check if an animation is marked as persistent.

## Creating Custom Adapters

You can create adapters for any SPA router:

```typescript
import type { SPAAdapter } from 'gsap-spa-manager';

const myAdapter: SPAAdapter = {
  name: 'MyRouter',
  onBeforeSwap(callback) {
    myRouter.on('before:navigate', callback);
  },
  onAfterSwap(callback) {
    myRouter.on('after:navigate', callback);
  }
};

AM.init({ adapter: myAdapter });
```

## Best Practices

1. **Use `setup()` for complex animations** - It provides automatic cleanup via `gsap.context()`

2. **Register all ScrollTriggers** - Use `AM.scroll()` instead of `ScrollTrigger.create()` directly

3. **Use persistence sparingly** - Only for animations that truly need to survive page transitions

4. **Clean up manually when needed** - Call `AM.cleanup(key)` when removing elements dynamically

5. **Use debug mode during development** - It helps track animation lifecycle

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type { 
  SPAAdapter, 
  AnimationManagerOptions,
  AnimationOptions,
  SetupOptions 
} from 'gsap-spa-manager';
```

## License

MIT
