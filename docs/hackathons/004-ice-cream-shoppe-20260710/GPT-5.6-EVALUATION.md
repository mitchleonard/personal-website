# GPT‑5.6 evaluation

## Purpose

Evaluate GPT‑5.6 on a real 90-minute portfolio hackathon rather than an isolated coding prompt. Evidence is drawn from the Git history, browser checks, build output, screenshots, and correction log.

## Interim scorecard

| Dimension | Evidence | Interim assessment |
| --- | --- | --- |
| Speed | Working global mode, responsive Shoppe, sorting, map-ready presentation, pint lab, and importer completed by the +10:46 log entry | Strong |
| Autonomy | Progressed from ambiguous concept through product options, architecture, implementation, documentation, and verification | Strong |
| Product judgment | Recommended the hidden Shoppe model and avoided adding another permanent Projects-grid item | Strong |
| Visual judgment | Created a distinctive editorial storefront while retaining the site’s existing typography and palette relationships | Strong |
| Code quality | `npx tsc --noEmit`, production build, and browser interaction checks passed | Strong |
| Debugging | Diagnosed missing local-browser runtime, sandbox launch restriction, apparent unstyled capture, and nondeterministic hydration warning | Strong, with environment overhead |
| Data reasoning | Defined confidence-based matching and privacy gates before exposing EXIF coordinates | Promising; unproven on real exports |
| Instruction adherence | Followed the repository documentation rule and Hackathon Skill evidence trail; preserved unrelated `AGENTS.md` | Strong |

## Corrections and friction

1. The first tag recommendation (`Full Stack`, `TypeScript`) described implementation rather than the project’s story. Mitch rejected it; searching the existing taxonomy led to stronger new tags: `Data Visualization` and `Digital Archive`.
2. The first full-page screenshot appeared unstyled. Computed-style inspection showed CSS was available on the subsequent render, so the milestone was recaptured instead of treating the screenshot as sufficient evidence.
3. Cross-route QA surfaced a server/client style mismatch in existing randomized navigation colors. The implementation replaced randomness with a deterministic label hash.
4. The browser verification tool expected a downloaded Chromium binary. GPT‑5.6 adapted to the locally installed Chrome after explicit sandbox approval.

## Final evaluation gates

- Measure accuracy and manual correction rate when matching note entries to photos.
- Record how many ratings import cleanly versus require review.
- Verify page performance and usability with the full archive rather than four preview cards.
- Record deployment success, elapsed time, final commit count, and any production-only defects.
