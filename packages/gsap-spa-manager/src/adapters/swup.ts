import type Swup from 'swup';
import type { SPAAdapter } from '../AnimationManager.js';

/**
 * Adapter per integrare AnimationManager con Swup
 *
 * @example
 * import Swup from 'swup';
 * import { AM, createSwupAdapter } from 'gsap-spa-manager';
 *
 * const swup = new Swup();
 * AM.init({ adapter: createSwupAdapter(swup) });
 *
 * // Per disconnettere l'adapter:
 * AM.destroy();
 */
export function swupAdapter(swup: Swup): SPAAdapter {
	// Flag per tracciare se l'adapter è stato distrutto
	let isDestroyed = false;

	// Wrapper che controlla il flag prima di eseguire il callback
	const createGuardedCallback = (callback: () => void) => {
		return () => {
			if (!isDestroyed) {
				callback();
			}
		};
	};

	let guardedBeforeSwap: (() => void) | null = null;
	let guardedAfterSwap: (() => void) | null = null;

	return {
		name: 'Swup',

		onBeforeSwap(callback: () => void): void {
			guardedBeforeSwap = createGuardedCallback(callback);
			swup.hooks.before('content:replace', guardedBeforeSwap);
		},

		onAfterSwap(callback: () => void): void {
			guardedAfterSwap = createGuardedCallback(callback);
			swup.hooks.on('content:replace', guardedAfterSwap);
		},

		destroy(): void {
			// Imposta il flag per disabilitare i callback
			isDestroyed = true;

			// Nota: Swup non fornisce un modo type-safe per rimuovere hook singoli
			// con handler specifici. Usiamo il flag isDestroyed come guardia.
			// Per una pulizia completa, distruggere l'istanza Swup con swup.destroy()

			guardedBeforeSwap = null;
			guardedAfterSwap = null;
		},
	};
}
