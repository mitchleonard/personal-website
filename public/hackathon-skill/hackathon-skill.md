---
name: hackathon
description: Run a micro hackathon end-to-end — kickoff, build, ship, publish — while capturing every prompt, tool call, MCP/connector, screenshot, elapsed timestamp, and decision into a portable project folder that doubles as a mitchleonard.com-ready project page and a Git-committed evidence trail. Use whenever Mitch says "start a hackathon project", "kickoff a hackathon", "new micro hackathon", "start a hackathon — here's what I want to do", or any close variant. Also use when a project is mid-flight and Mitch says "milestone", "log this", "ship the hackathon", "wrap it up", or "publish hackathon NNN".
---

# Hackathon — micro-project documentation system

> The point: build something fast, prove it, and leave a public-quality artifact behind. Each run produces a Git-committed local folder plus a finished project page sized for **mitchleonard.com/projects**. Pace + evidence > one-off demos.

## When this skill fires

Four triggers, four different actions:

| Trigger phrase (close variants OK) | Phase | What runs |
|---|---|---|
| "start a hackathon project", "kickoff a hackathon" | **Kickoff** | Section A below |
| "milestone", "log this", "screenshot the build" | **Build** | Section B below |
| "ship it", "wrap the hackathon", "close the project" | **Ship** | Section C below |
| "preview hackathon NNN", "let me see the page" | **Preview** | Section D below (step D2) |
| "publish hackathon NNN", "publish to the site", "push to portfolio" | **Publish** | Section D below (step D3) |

If the phase is ambiguous, ASK before doing anything destructive. Never overwrite an existing `LOG.md` without confirming.

---

## Environment detection — adapt without asking

Before running, identify which surface Claude is on and pick the matching mode:

- **Claude Code (CLI):** Full filesystem + git. Use Bash freely. Run helper scripts in `bin/`.
- **Cowork (desktop):** File tools + `mcp__workspace__bash` sandbox + `mcp__computer-use__*` for screenshots. Use the workspace folder for the hackathon directory. Take screenshots automatically at milestones.
- **claude.ai chat (web/mobile):** No filesystem. Generate every artifact as a downloadable file, give the user copy-paste commands for git, and explicitly tell them to take screenshots themselves at each milestone callout.

In all environments, the **deliverables are the same**: a complete hackathon folder + a project-page draft ready to drop into the portfolio.

---

## A. Kickoff phase

### A1. Capture the brief — use AskUserQuestion (Cowork/chat) or sequential prompts (Code)

Ask for exactly these six fields in one batch. Do not start work until all six are answered:

1. **Project name** (free text — used for folder slug)
2. **One-sentence pitch** (the hook — under 15 words; this becomes the homepage card subtitle)
3. **Problem being solved** (2–4 sentences — becomes the "Context" section)
4. **Definition of done** (the minimum thing that ships — becomes the "Execution" success criterion)
5. **Time budget** (minutes; "open-ended" allowed but discouraged — pick a number even if it's a guess)
6. **Tech tags** (up to 3 — e.g., "React", "Claude API", "PWA")

Echo the answers back as a kickoff card before creating files. Confirm.

### A2. Compute the slug and folder

- Slug: `kebab-case` of the project name, lowercased, no special chars.
- Number: read existing `~/hackathons/` (or `/Users/mitchellleonard/Desktop/Claude/hackathons/` in Cowork). Next available `NNN` (zero-padded).
- Date suffix: `YYYYMMDD` from today.
- Folder name: `NNN-{slug}-YYYYMMDD/`

In Cowork, write to `/Users/mitchellleonard/Desktop/Claude/hackathons/{folder}/`.
In Claude Code, write to `~/hackathons/{folder}/`.
In claude.ai chat, generate as a zip the user downloads.

### A3. Scaffold the folder

Create this structure (copy from `templates/` in this skill):

```
NNN-{slug}-YYYYMMDD/
├── README.md           # project meta + final summary (templates/project-README.md.tmpl)
├── LOG.md              # timestamped running log (templates/LOG.md.tmpl)
├── INVENTORY.md        # MCPs/connectors/APIs/skills touched (templates/INVENTORY.md.tmpl)
├── transcript.md       # full prompt + decision trail (templates/transcript.md.tmpl)
├── .hackathon-state    # JSON: {start_iso, time_budget_min, slug, number}
├── assets/
│   ├── screenshots/    # milestone PNGs
│   └── recordings/     # optional MP4
├── src/                # the actual build artifacts go here
└── project-page/
    ├── content.md      # mitchleonard.com-style page (templates/project-page.md.tmpl)
    ├── preview.png     # visual card thumbnail (generated at ship time)
    └── card.json       # index card meta (templates/card.json.tmpl)
```

Fill the templates with the brief from A1.

### A4. Initialize Git

```bash
cd <folder>
git init -q
git add .
git commit -q -m "Hackathon #NNN kickoff — {slug}"
```

In claude.ai chat, output the commands for the user to paste.

### A5. Kickoff screenshot

- **Cowork:** Use `mcp__computer-use__screenshot` to capture the current desktop state. Save to `assets/screenshots/00-kickoff.png`. If `request_access` hasn't been granted for the relevant apps, request it for whatever the user has open.
- **Claude Code:** Skip (no screen access). Instead, ask the user to attach a screenshot of their starting state; save it as `00-kickoff.png` when provided.
- **claude.ai chat:** Tell the user explicitly: "Take a screenshot of your starting state and save it to `assets/screenshots/00-kickoff.png` in the folder."

### A6. Print the kickoff card

End kickoff with a compact summary card in chat:

```
🟢 HACKATHON #NNN — {Project Name}
Pitch:       {one-sentence pitch}
Done when:   {definition of done}
Budget:      {N} min
Tags:        #tag1 #tag2 #tag3
Folder:      {absolute path}
Started:     {HH:MM local}
```

Then say: *"Send me what you want to build first — or say 'milestone' when you hit something worth capturing."*

---

## B. Build phase — passive instructions during the work

While the hackathon is running, Claude should silently maintain the log. Do NOT ask permission for these — they happen automatically.

### B1. After every meaningful Claude action, append a LOG.md entry

Format:

```
[+MM:SS] {one-line description}
  why: {one-line rationale or what the user asked}
  did: {what Claude actually did — file edits, tool calls, decisions}
  next: {what's next}
```

Compute `+MM:SS` from `start_iso` in `.hackathon-state`.

Append, don't overwrite. Keep entries terse — these compose the eventual "Execution" section bullets.

### B2. First touch of any MCP / connector / API / skill → INVENTORY.md entry

When Claude calls a tool from a new namespace (e.g., first time hitting `mcp__d5a38daf-*` aka Gmail, first `WebSearch`, first `mcp__cowork__create_artifact`, etc.), append to INVENTORY.md:

```
- **{Tool / Connector name}** — {what it did in this build} — {tool ID or namespace}
```

Skills count too. So does the OpenAI/Anthropic API if used directly.

### B3. Milestone triggers — when to take a screenshot + commit

Take a screenshot AND make a Git commit at any of these moments:

- First working anything (even broken UI)
- Major pivot or rewrite
- A demo-worthy state (something looks right)
- User says "milestone" / "screenshot" / "log this"
- Every ~15 min if none of the above fired
- Final state

Filename convention: `assets/screenshots/{NN}-{slug-of-moment}.png` where NN is sequential starting at 01 (kickoff is 00).

Commit message: `[+MM:SS] {what just happened}`

### B4. Pivots and dead-ends — capture explicitly

If Claude or the user abandons an approach, record it in LOG.md with a `× pivot:` prefix and a one-line reason. Iteration evidence > smooth-looking work. The whole point of the portfolio is to show the *path*.

### B5. transcript.md — append the user's prompts verbatim

Every time the user types a new instruction, append:

```
---
[+MM:SS] User:
{exact prompt}

Claude:
{one-paragraph summary of what Claude did in response}
```

Don't dump full tool-call JSON. Summarize. The transcript is for storytelling, not debugging.

---

## C. Ship phase

Triggered by "ship it", "wrap the hackathon", "close the project", or when the time budget hits zero and the user confirms.

### C1. Final capture

- Take the final screenshot → `assets/screenshots/99-final.png`
- If a live URL exists (Vercel deploy, etc.), record it in `.hackathon-state`

### C2. Compute results

- `elapsed_min` = now − `start_iso`
- `commits` = `git log --oneline | wc -l`
- `mcps_used` = count of INVENTORY.md entries
- `screenshots` = count in `assets/screenshots/`

### C2.5. Generate the preview image

Every project page needs a visual thumbnail — it's what shows up on mitchleonard.com cards and in social shares. Generate it before writing the project page so the file path is ready for `card.json`.

Use `mcp__visualize__show_widget` to render an SVG preview card (aim for ~600×400) containing:
- Project title — large, prominent
- One-sentence pitch — medium weight, below the title
- Tech tags as pill/chip elements
- Key stat: "Built in {elapsed_min} min"
- Dark or neutral background that reads well as a small card thumbnail

Then use `mcp__computer-use__screenshot` + zoom to capture the rendered widget and save it to `project-page/preview.png`.

If computer-use isn't available (Claude Code), write the SVG directly to `project-page/preview.svg` instead — the user can screenshot or export it.

The preview image is a required deliverable. Don't skip it.

### C3. Generate the project page

Open `project-page/content.md` and **replace every placeholder** with real content drawn from LOG.md and the original brief. Check before saving: no bare `{TOKEN}` strings should remain in the final file.

Follow the mitchleonard.com structure:

```
# {Project Name}
{One-sentence pitch — the homepage card subtitle}

[Visit live →]({live_url}) [optional, only if deployed]

Quick read

## Context
{2–4 sentences — see voice guidance below}

## Challenge
{1 paragraph — see voice guidance below}

## Execution
{3–6 bullets — see voice guidance below}
- Built in {elapsed_min} minutes across {commits} commits.
- Tools: {comma-separated INVENTORY.md entries}.

## Work
{Screenshot embeds with captions — one per milestone PNG, captioned from the LOG.md entry that matches}

---

Built {date} · {elapsed_min} min · {commits} commits · {mcps_used} tools
[GitHub →]({repo_url}) [optional]
```

---

#### Voice guidance — Context

Open with the **specific situation** — a real person, place, or pain point. Not a problem statement, not a product brief. Write it like you're explaining it to a colleague.

**Strong:**
> "My wife is a Caitlin Clark and Indiana Fever superfan. Keeping up with every game means jumping between ESPN, Yahoo Sports, the team site, and her own calendar — and none of those apps are built for one team or one fan. She isn't techy. She just wants the right info to land in front of her at the right time."

**Weak:**
> "The challenge was managing sports schedules across multiple platforms for dedicated fans who need timely information."

The weak version could describe a hundred products. The strong version is only ever true of this one.

---

#### Voice guidance — Challenge

One paragraph, one real constraint. Ask: *what made this non-trivial?* What would have killed the whole thing if you'd gotten it wrong? That's the Challenge. Don't restate the goal, don't list features, don't describe the tech stack.

**Strong:**
> "Build something that updates itself, lives inside the tools she already opens every day, and never asks her to install anything. Auto-update was the real constraint — the WNBA schedule shifts mid-season (channel swaps, postponements, playoff seeding), so a one-time data dump wouldn't survive a week."

**Weak:**
> "The project required integrating multiple data sources and handling real-time schedule changes while maintaining a simple user experience across different platforms."

---

#### Voice guidance — Execution bullets

Past-tense action verbs. Each bullet = one shipped thing + what it does or proved. Not "Used X" — built/wrote/wired/deployed/extracted something specific.

**Strong:**
> - Wrote a pure-Python ICS generator with stable per-game UIDs and a 12-hour refresh trigger so Google Calendar auto-updates on schedule changes.
> - Deployed to Vercel with a `text/calendar` content-type header and CORS allow-* so the feed subscribes directly from any calendar app.
> - × Pivot: abandoned a Cowork dashboard mid-build — it required a paid Claude account on her side. Switched to a static Vercel deploy that works with any free tool she already has.

**Weak:**
> - Used Python to create an ICS file for calendar integration.
> - Set up Vercel deployment for hosting the file.
> - Changed approach due to technical constraints with the original plan.

Pull bullets directly from `LOG.md` entries, especially pivots. 3–6 bullets covering the major build decisions and the final outcome.

---

#### General voice rules — all sections

- Plain, declarative, no buzzwords
- Banned phrases: "leveraged", "utilized", "harnessed", "drove engagement", "not just X, but Y", "what made this work", "the opportunity was"
- Em-dashes are fine
- Bullets in Execution can be short fragments; Context and Challenge are prose

### C3a. Generate `project-page/site-entry.js` (Phase D fuel)

If `~/.hackathon-config.json` exists AND its `site_type` is `nextjs-data-file`, also write `project-page/site-entry.js` — a JS object literal in the exact schema of the configured `content_array_name`. This is the file the Publish phase splices into the site's data file.

Look at one existing entry in the site's content file to learn the schema (you have read access via the site repo path in the config). Match it exactly — same field order, same null-vs-empty conventions, same string-quoting style. The skill is environment-aware; it does NOT guess. If you can't read the site file, ASK before writing a wrong shape.

For mitchleonard.com today (Next.js `data/caseStudies.js`), the schema is:

```js
{
  slug: '{slug}',
  title: '{Project Name}',
  subtitle: '{One-sentence pitch}',
  description: '{Card description — one or two short sentences}',
  company: null,
  client: null,
  tags: ['tag1', 'tag2', 'tag3'],
  url: '',
  results: [
    { value: '{N} min', label: 'Start to ship' },
    { value: '{commits}', label: 'Commits' },
    { value: '{mcps_used}', label: 'Tools used' },
  ],
  context: `{Context prose — same as content.md}`,
  challenge: `{Challenge prose}`,
  insight: null,
  role: null,
  execution: [
    '{bullet 1}',
    '{bullet 2}',
  ],
  impact: null,
  visuals: [
    { type: 'image', src: '/{slug}/00-kickoff.png', caption: '{caption}', featured: true },
    { type: 'image', src: '/{slug}/01-...png', description: '{caption}', annotated: true },
  ],
  next: '{slug_of_next_personal_project}',
},
```

### C4. Fill `card.json`

```json
{
  "type": "Project",
  "org": "Hackathon",
  "title": "{Project Name}",
  "tagline": "{One-sentence pitch}",
  "tags": ["tag1", "tag2", "tag3"],
  "slug": "{slug}",
  "elapsed_min": {N},
  "date_iso": "YYYY-MM-DD",
  "preview_image": "preview.png",
  "live_url": "{optional}",
  "repo_url": "{optional}"
}
```

### C5. Update README.md with the final summary

Replace the placeholder "Status: in flight" block with a "Status: shipped" block including elapsed time, commits, tools used, and a one-paragraph reflection drawn from the LOG.md pivots.

### C6. Repo push instructions

Output the exact `gh` CLI commands for the user to push to GitHub. Default repo name: `hackathon-NNN-{slug}`. Default visibility: public.

```bash
gh repo create hackathon-NNN-{slug} --public --source=. --remote=origin --push
```

If `gh` isn't installed, fall back to plain `git remote add` + `git push` instructions.

### C7. Final files presented

In Cowork, call `mcp__cowork__present_files` for:

1. `project-page/content.md` — drop into mitchleonard.com
2. `project-page/preview.png` — thumbnail for the project card
3. `project-page/card.json` — for the projects index
4. `README.md` — the public-facing project README
5. The whole folder as a `.zip` for easy archive

Print a closeout card:

```
🏁 HACKATHON #NNN — SHIPPED
Elapsed:   {N} min ({HH}h {MM}m)
Commits:   {N}
Tools:     {N} ({comma-separated})
Pivots:    {N}
Page:      {path to content.md}
Preview:   {path to preview.png}
Repo:      gh repo create hackathon-NNN-{slug} --public --source=. --remote=origin --push
```

### C8. Suggest the next move

Always end with one forward-looking suggestion. If `~/.hackathon-config.json` exists, the strongest suggestion is:

- *"Want me to publish this to mitchleonard.com now? Just say 'publish hackathon #NNN.'"*

Other options:
- "Want me to draft the LinkedIn post announcing this?"
- "Should I queue the next hackathon idea?"
- "Want this rendered as an artifact for live-preview before you publish?"

---

## D. Publish phase — Stage → Preview → Publish

Three steps. Never skip from D1 to D3 without doing D2.

### D1. Stage

Write the new entry into the site repo, but DO NOT commit yet.

Preconditions:
- `~/.hackathon-config.json` must exist. If it doesn't, copy the template from `templates/hackathon-config.json.tmpl`, fill in the user's site repo path, and ASK for confirmation before proceeding. Never write to a site repo Claude has not been told about.
- The hackathon folder must be in `shipped` state (Phase C done) — `project-page/site-entry.js` and the screenshots must exist.
- The site repo at `site_repo_path` must have a clean working tree on `default_branch` (ignoring `.claude/*` and `.DS_Store` noise). If not, ASK before continuing.

Then:
1. Dry-run the publish helper to show the plan:

   ```bash
   cd <hackathon-folder>
   bash <skill-path>/bin/hackathon-publish.sh --dry-run
   ```

2. If the user approves the plan, run the helper WITHOUT `--auto_push`. The helper writes the files and creates a commit but does NOT push. Modify the config temporarily to `auto_push: false` if needed, or use a `--no-push` flag (TODO: future helper enhancement).

   For now: edit `bin/hackathon-publish.sh` skipping the `git push` line, OR run the file edits manually:
   - Copy screenshots into `{site_repo}/{assets_dir_pattern}`
   - Splice `site-entry.js` into the configured content file
   - Add slug to the index var
   - `git add` + `git commit` (but NOT push)

### D2. Preview — REQUIRED, never skipped

Before pushing, the user must see the actual rendered page.

The exact preview mechanism depends on the user's site:

- **Next.js / Astro / similar with a local dev server (mitchleonard.com):**
  1. If the dev server isn't running, tell the user to double-click `~/Desktop/Claude/hackathon-skill/start-dev.command` (or run `npm run dev` in the site repo). Wait for confirmation.
  2. Print the two URLs the user should visit:
     - `http://localhost:3000{live_url_pattern_path}` — e.g., `/work/hackathon-skill`
     - `http://localhost:3000/projects` — confirms the new card landed correctly
  3. Ask the user to look at both pages and confirm. Offer to iterate on any feedback (typo, screenshot order, results numbers, tag wording, etc.) by editing the staged files directly in the site repo. After each edit, the dev server hot-reloads — the user just refreshes.
  4. **If Chrome MCP is available AND the user has approved localhost** — also navigate via `mcp__Claude_in_Chrome__navigate` and capture screenshots inline. This is a bonus, not the spine. If it errors, fall back to verbal preview.

- **Static-export sites or hosted CMS:**
  Push to a preview branch instead of main. Wait for the preview deploy URL. Send that to the user.

The Preview step is iterative. Loop on "looks off, fix X" → edit → reload → re-confirm. Do NOT push until the user explicitly says some variant of "publish", "push it", "ship it live."

### D3. Publish

Only after the user explicitly approves the preview. Push to main:

```bash
cd {site_repo}
git push origin main
```

If Phase D1 already committed, this just pushes. If not (because the user wanted to fully manual-review first), now is when the helper runs end-to-end:

```bash
bash <skill-path>/bin/hackathon-publish.sh
```

The helper:
1. Copies `assets/screenshots/*.png` into `{site_repo}/{assets_dir_pattern}` (e.g., `public/{slug}/`)
2. Splices `project-page/site-entry.js` into the configured content file (`data/caseStudies.js` for mitchleonard.com), inserting before `insert_before_slug` if specified
3. Adds the slug to the index array (e.g., `PERSONAL_SLUGS` in `app/projects/page.tsx`) at the configured position (`front` puts it first on the projects page)
4. Runs `node --check` on the content file to verify it parses
5. `git add` + `git commit` with the templated message (default: `Add Hackathon #{number} — {slug}`)
6. If `auto_push: true`, `git push` to the configured branch
7. Prints the expected live URL once Vercel/Netlify deploys

### D4. Post-publish

- Update `.hackathon-state` with `published_at` timestamp and the live URL
- Append a final `[+XX:YY] Published to mitchleonard.com` line to LOG.md
- Commit that update in the hackathon's own Git repo (NOT the site repo)
- Suggest the LinkedIn post or X post draft as the next move

### D5. Failure modes — handle gracefully

- **Dirty site repo:** abort, tell the user to stash or commit first
- **Slug already exists in the content array:** ASK whether to update (rare — only if the user re-publishes)
- **Parse failure after splice:** revert the change, report the bug
- **Push rejected:** report and let the user resolve auth/conflict manually
- **No config:** copy template, explain, do NOT proceed

### D6. Cross-environment notes

- **Cowork:** runs end-to-end if the user has granted access to the site repo folder. Use `mcp__cowork__request_cowork_directory` to get access on first publish.
- **Claude Code:** runs end-to-end natively in the site repo.
- **claude.ai chat:** Phase D is degraded — chat has no filesystem. The skill instead outputs the `site-entry.js` content and explicit commands the user runs locally.

---

## Conventions Claude must hold to

1. **Time stamps are real.** Never fake an elapsed time. Read it from `.hackathon-state` and compute against `date -u +%s` (or equivalent).
2. **Pivots are features.** Always log a pivot. The portfolio's job is to prove iteration speed, not to make Claude look smart.
3. **No buzzwords in the project page.** Re-read Section C3 voice rules before generating.
4. **One screenshot per logical milestone.** Don't spam.
5. **Git commits are the receipt.** Every milestone screenshot has a paired commit with the same `[+MM:SS]` prefix.
6. **Skill stays in the background.** During build phase, do not narrate every log append. The user is building, not watching Claude file paperwork.
7. **Ask before destructive ops.** Never `rm`, never overwrite a non-template file, never force-push.
8. **No bare placeholders in shipped files.** Every `{TOKEN}` in `content.md` and `card.json` must be replaced before presenting. Scan both files before calling `present_files`.
