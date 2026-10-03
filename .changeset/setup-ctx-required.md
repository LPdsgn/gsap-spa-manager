---
"@lpdsgn/gsap-spa-manager": patch
---

`setup()` callback now receives `ctx: gsap.Context` (no longer optional), so callbacks typed `(ctx: gsap.Context) => …` are accepted.
