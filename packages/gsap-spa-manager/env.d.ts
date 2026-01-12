/// <reference types="gsap" />

declare global {
	interface Window {
		AM?: import('./AnimationManager.js').AnimationManager;
	}
}

export {};
