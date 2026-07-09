# Sammtech Kanban

A feature-rich, drag-and-drop Kanban board built with Next.js, TypeScript, and Tailwind. This was my take-home for the Sammtech frontend assessment — built solo, no starter template beyond boilerplate I generated myself (more on that below).

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd sammtech-kanban
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open the app**:
   Visit [http://localhost:3000](http://localhost:3000).

## Features

- **Drag and Drop**: Reorder tasks within a column, move them across columns, and reorder columns themselves.
- **State Persistence & Cross-Tab Sync**: Board state saves to LocalStorage and syncs live across open tabs via `BroadcastChannel`.
- **Undo / Redo**: Full history stack for board actions.
- **Filtering**: Search, plus filters by assignee, priority, labels, and due date.
- **Dark / Light Mode**: Full theme support.
- **Keyboard Shortcuts**: Fast navigation without touching the mouse.
- **Guided Onboarding Tour**: For first-time users, via React Joyride.
- **Horizontal Deadline Calendar**: A sliding calendar view showing tasks against their due dates — built this to add something beyond the base spec.
- **GitHub-style Activity Heatmap**: Mock contribution-style heatmap for task activity.
- **Custom Labels**: User-created tags beyond the seeded defaults.
- **Progress Indicators**: Visual completion tracking per board/column.
- **Micro-animations**: Framer Motion for modal morphing and idle-state transitions.
- **Mobile Browser Support**: Responsive layout that works across mobile browsers — functional today, with more polish planned (see improvements below).

## Technical Decisions

- **Next.js 16 (App Router) & React 19** — modern architecture, fast tooling, and leaves room to bolt on a real API layer later without a rewrite.
- **Tailwind CSS v4** — fast iteration on the dark/light theme without dragging in a component library that fights my design choices.
- **@hello-pangea/dnd** — the actively maintained fork of `react-beautiful-dnd`, works cleanly with React strict mode.
- **Framer Motion** — for the modal morph and idle-state transitions. (I'll be honest about my relationship with this library below.)
- **Context API + LocalStorage** — no Redux here. A board this size doesn't need it, and Context + `BroadcastChannel` gets me persistence and cross-tab sync without spinning up a backend for a frontend assessment.

## Design Choices

There was no design spec attached to this task, so I had free rein. I went with a minimalist, Vercel/Linear-style black-and-white aesthetic  clean surfaces, restrained color, no unnecessary chrome. Minimal is just what I gravitate toward, and it also forces discipline: with no color to hide behind, spacing and hierarchy have to actually be right.

## Challenges Faced and Solutions

### 1. Framer Motion vs. Drag-and-Drop

This was the hardest and most time-consuming problem in the project. Framer Motion's `layout`/`layoutId` animation and `@hello-pangea/dnd`'s own drag transforms were both trying to control the same card's position during a drop, which produced a jagged, jittery snap instead of a clean settle. The fix was to give each engine its own lane: disable Framer Motion's layout animation while a card is actively being dragged (`layout={!snapshot.isDragging}`), switch from full `layout` to `layout="position"` so it only animates x/y instead of also recalculating size, and use a critically damped spring so it settles instead of overshooting. Once DND owned the drag and Framer Motion only handled the idle/settle state, the conflict disappeared.

Side note: I don't fully get along with Framer Motion in general. Plenty of animations I tried just didn't behave the way I wanted, and past a certain point I'd back off to a simple fade-in/fade-out rather than keep fighting it. This DND conflict was the one case where I had to actually solve it properly, since there was no simpler fallback that still looked acceptable.

### 2. Tailwind discipline on a growing component tree

Utility-class spaghetti is real on a UI this size  cards, modals, sidebars, buttons, inputs, badges. I set myself (and the AI tools I used) a hard rule: no raw utility strings on cards/buttons/inputs, everything shared goes through `/components/ui/`, layout-specific classes at the call site via `cn()`, and no inventing one-off colors or spacing outside the existing Tailwind config tokens. Kept the styling consistent instead of drifting into duplicated one-off classes everywhere.

### 3. Undo/Redo with cross-tab sync, without infinite loops

Keeping a full undo history while also broadcasting state across tabs risked a loop —a tab receiving a synced update could push that same update back into its own history stack. Fixed by only broadcasting the resolved `present` state, and having receiving tabs update their view without re-entering it into their own undo history.

## What I Learned

I'd never built a drag-and-drop Kanban board before this, so a good chunk of the project was just learning the mechanics of DND from scratch how draggable/droppable contexts work, how placeholders and reordering logic actually behave, all of it new going in.

The Framer Motion fight taught me something more specific: when two animation systems both try to own the same transform, the fix isn't to fight harder with better animation values, it's to figure out who should own what and split the responsibility cleanly. I also learned my own limits with it — I know now that when an animation isn't cooperating, spending another hour tweaking spring values usually isn't worth it, and falling back to something simpler is often the right call rather than a compromise.

Sticking to a strict Tailwind component discipline from day one, even when it felt like overhead early on, was worth it. It's the difference between a UI that stays manageable as it grows and one that turns into copy-pasted utility strings everywhere.

## How I Actually Used AI Here

No point pretending otherwise  I don't hand-write every bit of boilerplate anymore, and I'd rather be upfront about the process than have it look like it appeared from nowhere:

1. **Ideation**: Browsed Pinterest for Kanban board layout ideas to get a feel for what's out there.
2. **Scaffolding**: Used Google Stitch AI with a `design.md` file I'd already put together defining my own design language, to generate the raw JSX/boilerplate for components.
3. **Build**: From there I did the actual implementation work — wiring up state, drag-and-drop, persistence, the calendar view, the heatmap, all the logic — following the Tailwind component rules above, with AI as a coding assistant rather than the author.
4. **Debugging pass**: Once the feature set was complete, I ran an AI-assisted review — prompting it to act as a senior frontend reviewer and audit the entire codebase for issues. That review surfaced real problems (an XSS hole in the markdown renderer, `Date.now()`-based IDs that could collide, a God-context anti-pattern holding all board and UI state together, missing `'use client'` directives, `window.confirm()`/`alert()` calls instead of using the modal system already in the app, and more). I went through the list and fixed what mattered for a task of this scope.


## What I'd Improve With More Time

1. **Mobile**: Functional right now, but not up to my own bar. Needs real touch-target and gesture work, not just responsive breakpoints.
2. **A vertical time slider** alongside the horizontal calendar — the idea is the two together would map the whole Kanban grid across a full day, not just across dates.
3. **Virtualization** for large boards (`@tanstack/react-virtual` is already a dependency but currently unused — was planning for this).
4. **UI polish** — nicer, more considered animations now that the DND/Framer Motion conflict is actually solved.
5. **Test coverage** — no unit or e2e tests currently. Ran out of time; would add Jest/RTL for logic and Playwright for the drag-and-drop and undo/redo flows specifically, since those are the highest-risk areas.
6. Backend integration (Postgres + Prisma), real auth, and real-time multi-user collaboration — all deliberately out of scope for a frontend-only assessment, but the natural next steps.
