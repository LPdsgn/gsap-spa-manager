import { defineConfig } from 'tsup';

export default defineConfig((options) => {
	const dev = !!options.watch;

	return [
		// ESM build (modern)
		{
			entry: ["src/index.ts"],
			format: ["esm"],
			outExtension: ({ format }) => ({ js: `.${format}.js` }),
			target: "es2020",
			bundle: true,
			dts: true,
			sourcemap: true,
			clean: true,
			splitting: false,
			minify: !dev,
			external: ["gsap", "gsap/ScrollTrigger", "swup", "@barba/core"],
			outDir: "dist",
			esbuildOptions(options) {
				options.banner = {
					js: '"use client";',
				};
			},
		},
		// UMD build (browser global)
		{
			entry: ["src/index.ts"],
			format: ["iife"],
			target: "es2020",
			bundle: true,
			sourcemap: true,
			minify: !dev,
			globalName: "AnimationManager",
			outDir: "dist",
			outExtension: () => ({ js: ".umd.js" }),
			external: ["gsap", "gsap/ScrollTrigger"],
			esbuildOptions(options) {
				options.globalName = "AnimationManager";
				// Map external modules to globals
				options.banner = {
					js: `
(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('gsap'), require('gsap/ScrollTrigger')) :
  typeof define === 'function' && define.amd ? define(['exports', 'gsap', 'gsap/ScrollTrigger'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.AnimationManager = {}, global.gsap, global.ScrollTrigger));
})(this, (function(exports, gsap, ScrollTrigger) {
`,
				};
				options.footer = {
					js: `
Object.assign(exports, AnimationManager);
}));
`,
				};
			},
		},
		// CJS build (Node.js legacy)
		{
			entry: ["src/index.ts"],
			format: ["cjs"],
			target: "node18",
			bundle: true,
			dts: false,
			sourcemap: true,
			minify: !dev,
			external: ["gsap", "gsap/ScrollTrigger", "swup", "@barba/core"],
			outDir: "dist",
		},
	];
});
