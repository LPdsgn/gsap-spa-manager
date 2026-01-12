// Core exports
export {
	AM,
	AnimationManager,
	type SPAAdapter,
	type AnimationManagerOptions,
	type AnimationOptions,
	type SetupOptions,
} from './AnimationManager.js';

// Adapter exports
export { swupAdapter } from './adapters/swup.js';
export { barbaAdapter } from './adapters/barba.js';
export { astroAdapter, type AstroAdapterOptions } from './adapters/astro.js';