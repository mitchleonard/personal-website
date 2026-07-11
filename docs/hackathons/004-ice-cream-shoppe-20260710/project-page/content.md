# Ice Cream Shoppe

My ratings, recommendations, and homemade pints—all served from one digital shoppe.

## Quick read

In the first ten minutes, GPT‑5.6 turned a private six-year ice cream archive into a responsive, deployment-ready collection experience—with persistent Ice Cream Mode, sortable ratings, a map-ready location view, a homemade-pint lab, and a validated update workflow. The final data migration and live results will be added after the Apple exports arrive.

## Context

Since 2020, I’ve kept a running list of ice cream ratings from around the country and close to home. The ratings lived in Apple Notes, while the photos—and the useful dates and locations attached to them—stayed in a pair of iPhone albums.

## Challenge

Turn a private, loosely structured archive into a public collection without making future updates feel like maintaining a database. The experience also had to feel like a memorable discovery inside my portfolio—not another project link in an increasingly long menu—and location metadata needed a privacy review before publication.

## Execution

- Made Ice Cream Mode a persistent global preference instead of a one-page visual gag. Turning it on changes the site atmosphere and reveals an invitation into the Shoppe across navigation.
- Reconnected the physical side of the original Ice Cream Mode: a full-screen sprinkle field responds continuously to phone orientation, tap bursts add a tactile little payoff, and the browser tab turns into a cone while the mode is on.
- Built an editorial `/ice-cream` experience with a dramatic storefront entrance, sortable rating case, geographic preview, and a distinct Made by Mitch pint lab.
- Kept the collection out of the Projects grid. The existing About and footer references become natural entrances, while the Shoppe remains directly shareable.
- Designed a typed archive schema for public ratings and homemade pints, with representative records clearly labeled as preview data until the private archive is reviewed.
- Added a spreadsheet-friendly CSV inbox plus validation and import commands, so a new rating can be published without editing application code.
- Browser-tested desktop and mobile behavior, including sorting and cross-route persistence. The test surfaced and fixed an unrelated hydration mismatch caused by random navigation colors.
- Produced a clean Next.js production build with `/ice-cream` statically generated.

## Work

![The first working Ice Cream Shoppe](../assets/screenshots/01-first-working-shoppe.png)

The first working state established the full narrative in one long-form page: storefront, collection case, map, and pint lab.

![The responsive Shoppe](../assets/screenshots/01-first-working-shoppe-mobile.png)

The same experience condenses into a narrow, touch-friendly layout without turning into an app dashboard.

## GPT‑5.6 experiment — interim read

- **Speed:** kickoff to production-ready first working build in roughly ten minutes of tracked execution time.
- **Autonomy:** translated a broad experience brief into product directions, chose a recommendation, and carried it through architecture, implementation, ingestion design, and verification.
- **Design judgment:** preserved the portfolio’s focus by treating Ice Cream Mode as the entrance rather than adding another main-navigation project item.
- **Implementation quality:** type-check, production build, desktop/mobile browser rendering, sorting, persistence, and console checks passed.
- **Correction required:** the first milestone screenshot appeared before styles had settled and was replaced after inspecting computed CSS. Browser QA also exposed an existing hydration warning, which GPT‑5.6 traced to nondeterministic nav colors and corrected.
- **Still unproven:** real-world data matching quality, EXIF extraction, and handling of ambiguous Apple Note/photo pairs cannot be evaluated until the source exports are available.

## Remaining ship gates

- Import and manually review the real Apple Notes ratings.
- Match and optimize real rating and homemade-pint photos.
- Review GPS metadata and remove private coordinates.
- Replace preview content and verify the full collection at roughly 150 records.
- Deploy and record the production URL and final milestone.
