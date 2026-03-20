---
"@custardcream/msw-devtools": minor
---

feat: UI redesign, Storybook, code refactoring, and React 19 migration

### UI Redesign
- Redesign panel UI with a cleaner, professional look (Chrome DevTools style)
- All changes are className-only — no logic modifications

### Storybook
- Add Storybook 8.6 dev environment with Tailwind CSS / i18n / path alias support
- Add 14 component stories (7 basic UI + 7 tab/page)
- Add Playwright-based screenshot capture script

### Code Refactoring
- Fix `useFormDefaults` `||` operator bug — falsy values (0, false) now preserved
- Fix MockListTab key prop collision (url → url-method)
- Add `createStorageContext` factory — reduce 4 context files by 51%
- Consolidate mock-list.tsx with `toggleMockProperty` (249 → 150 lines)
- Separate `EditStateProvider` for single source of truth
- Extract shared components: `SidebarButton`, `ResponseIndexBadge`
- Move Pill color mappings to respective Pill components
- Separate types to `types/form.ts`
- Replace "FIXABLE" magic string with `VALIDATION_RESULT` constant

### React 19 Migration
- Upgrade react/react-dom to ^19.0.0
- Remove `forwardRef` — ref as regular prop (Toggle, CodeEditor)
- Replace `Context.Provider` with `Context` (React 19 syntax)
- Upgrade docs app to Next.js 15

### README
- Update all screenshots (EN/KO 8 images + prompt-mode.gif)
