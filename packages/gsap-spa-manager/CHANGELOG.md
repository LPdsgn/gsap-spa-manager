# @lpdsgn/gsap-spa-manager

## 1.0.0

### Major Changes

- [`eade479`](https://github.com/LPdsgn/gsap-spa-manager/commit/eade4798b3fee1b748836e2e3097c5ab1835bc76) Thanks [@LPdsgn](https://github.com/LPdsgn)! - First stable release. Fix package entry points: the build emitted `index.esm.js`/`index.cjs.js` while `exports` pointed to `index.js`/`index.cjs`, so the package could not be imported from Node, esbuild or Vite. CommonJS consumers now also get `index.d.cts` types.

## 0.1.1

### Patch Changes

- [`35fa1ce`](https://github.com/LPdsgn/gsap-spa-manager/commit/35fa1ce0bcf5500f8681570b20082bf3e72f495c) Thanks [@LPdsgn](https://github.com/LPdsgn)! - `window.AM` is now exposed only when `AM.init({ debug: true })` is called, instead of on import. Fixed adapter names and package name in JSDoc and README examples.

- [`3dda8a4`](https://github.com/LPdsgn/gsap-spa-manager/commit/3dda8a454c394e5f78b38d8626e69a5e388e056f) Thanks [@LPdsgn](https://github.com/LPdsgn)! - `setup()` callback now receives `ctx: gsap.Context` (no longer optional), so callbacks typed `(ctx: gsap.Context) => …` are accepted.
