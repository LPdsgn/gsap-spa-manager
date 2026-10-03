---
"@lpdsgn/gsap-spa-manager": major
---

First stable release. Fix package entry points: the build emitted `index.esm.js`/`index.cjs.js` while `exports` pointed to `index.js`/`index.cjs`, so the package could not be imported from Node, esbuild or Vite. CommonJS consumers now also get `index.d.cts` types.
