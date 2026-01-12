import type { SPAAdapter } from '../AnimationManager.js';

// Tipo minimo per Barba.js per evitare dipendenze hard
interface BarbaCore {
	hooks: {
		before(hook: string, callback: () => void): void;
		after(hook: string, callback: () => void): void;
		// Barba.js non ha un metodo off() nativo per i hooks
	};
}

/**
 * Adapter per integrare AnimationManager con Barba.js
 *
 * @example
 * import barba from '@barba/core';
 * import { AM, createBarbaAdapter } from 'gsap-spa-manager';
 *
 * barba.init();
 * AM.init({ adapter: createBarbaAdapter(barba) });
 *
 * @note Barba.js non supporta la rimozione dinamica degli hooks,
 * quindi destroy() non rimuove i listener ma previene l'esecuzione
 */
export function barbaAdapter(barba: BarbaCore): SPAAdapter {
	// Flag per disabilitare i callback dopo destroy
	let isDestroyed = false;

	return {
		name: 'Barba.js',

		onBeforeSwap(callback: () => void): void {
			barba.hooks.before('leave', () => {
				if (!isDestroyed) callback();
			});
		},

		onAfterSwap(callback: () => void): void {
			barba.hooks.after('enter', () => {
				if (!isDestroyed) callback();
			});
		},

		destroy(): void {
			// Barba.js non permette di rimuovere hooks,
			// quindi usiamo un flag per disabilitare i callback
			isDestroyed = true;
		},
	};
}
