---
"@custardcream/msw-devtools": patch
"@custardcream/msw-devtools-server": patch
---

fix: update rollup and vite to patch security vulnerabilities

- Update rollup from 4.24.3 to ^4.59.0 (high: arbitrary file write via path traversal)
- Update vite from 5.4.10 to ^5.4.21 (medium: server.fs.deny bypass on Windows)
