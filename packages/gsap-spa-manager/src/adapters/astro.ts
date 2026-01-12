import type { SPAAdapter } from '../AnimationManager.js';

/**
 * Adapter per integrare AnimationManager con Astro View Transitions
 *
 * Astro View Transitions usa eventi DOM nativi invece di un'istanza router,
 * quindi questo adapter non richiede parametri.
 *
 * @example
 * import { AM, createAstroAdapter } from 'gsap-spa-manager';
 *
 * // In un <script> tag o client-side script
 * AM.init({ adapter: createAstroAdapter() });
 *
 * @example
 * // Con opzioni
 * AM.init({
 *   debug: true,
 *   adapter: createAstroAdapter({ refreshDelay: 100 })
 * });
 *
 * @see https://docs.astro.build/en/guides/view-transitions/
 */
export interface AstroAdapterOptions {
	/**
	 * Ritardo in ms prima del refresh degli ScrollTrigger dopo lo swap.
	 * Utile se il nuovo contenuto ha bisogno di tempo per il rendering.
	 * @default 0
	 */
	refreshDelay?: number;
}

export function astroAdapter(options: AstroAdapterOptions = {}): SPAAdapter {
	const { refreshDelay = 0 } = options;

	// Store dei listener per poterli rimuovere in destroy()
	let beforeSwapHandler: (() => void) | null = null;
	let afterSwapHandler: (() => void) | null = null;

	return {
		name: 'Astro View Transitions',

		onBeforeSwap(callback: () => void): void {
			beforeSwapHandler = callback;
			document.addEventListener('astro:before-swap', beforeSwapHandler);
		},

		onAfterSwap(callback: () => void): void {
			afterSwapHandler = () => {
				if (refreshDelay > 0) {
					setTimeout(callback, refreshDelay);
				} else {
					callback();
				}
			};
			document.addEventListener('astro:after-swap', afterSwapHandler);
		},

		destroy(): void {
			if (beforeSwapHandler) {
				document.removeEventListener('astro:before-swap', beforeSwapHandler);
				beforeSwapHandler = null;
			}
			if (afterSwapHandler) {
				document.removeEventListener('astro:after-swap', afterSwapHandler);
				afterSwapHandler = null;
			}
		},
	};
}
