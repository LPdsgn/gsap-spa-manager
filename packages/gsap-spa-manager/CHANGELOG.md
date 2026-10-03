# @lpdsgn/gsap-spa-manager

## 0.1.1

### Patch Changes

- [`35fa1ce`](https://github.com/LPdsgn/gsap-spa-manager/commit/35fa1ce0bcf5500f8681570b20082bf3e72f495c) Thanks [@LPdsgn](https://github.com/LPdsgn)! - `window.AM` is now exposed only when `AM.init({ debug: true })` is called, instead of on import. Fixed adapter names and package name in JSDoc and README examples.

- [`3dda8a4`](https://github.com/LPdsgn/gsap-spa-manager/commit/3dda8a454c394e5f78b38d8626e69a5e388e056f) Thanks [@LPdsgn](https://github.com/LPdsgn)! - `setup()` callback now receives `ctx: gsap.Context` (no longer optional), so callbacks typed `(ctx: gsap.Context) => …` are accepted.
