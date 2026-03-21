---
"@custardcream/msw-devtools": minor
---

feat: add Request Log tab for real-time request/response monitoring

- Add 4th "Log" tab with real-time request/response logging
- Capture matched and unmatched MSW requests via worker events
- Show timestamp, method, status, URL, and response duration per entry
- Expandable accordion for request/response body inspection
- "Add Mock for this URL" shortcut on unmatched requests
- Recording toggle, clear button, and All/Matched/Unmatched filter
- Unread badge on Log tab when new requests arrive on other tabs
- Early buffer captures requests before React tree mounts
- Filter out static assets (.js, .css, etc.) and dev server requests
- FIFO cap at 200 entries, memory only (no localStorage)
- Full i18n support (EN/KO)
