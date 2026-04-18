# Bands4U — Expense & Savings Goal Tracker

A mobile web prototype for tracking expenses and staying on pace with savings goals, designed specifically for college students and young professionals.

## Team — Group 8

- Ranjiv Jithendran
- Aliza Khan
- Sana Yasini
- Akash Goyal
- Vansh Singh

## About

Bands4U helps users build consistent financial habits by combining frictionless expense logging with motivational, goal-driven feedback. Instead of treating budgeting as a chore, the app connects everyday spending to meaningful goals — a laptop, tuition, an emergency fund — and shows users in real time how their choices affect their timeline.

This is a UI-focused prototype built for **CSC 642/842: Human-Computer Interaction (Spring 2026)** at San Francisco State University. It applies course principles including Laws of Simplicity, visual hierarchy, feedback, and error prevention.

## Key Features

- **Quick Add Expense** — one-screen expense entry with categories, notes, and smart defaults
- **Income Tracking** — log income from multiple sources to see net monthly balance
- **Savings Goals** — set goals with target amount and deadline, track progress visually
- **Weekly Pace Guidance** — the app calculates exactly how much to save daily/weekly
- **Goal Impact Mode** (innovative feature) — visualizes how spending changes affect goal timelines in real time
- **Spending Dashboard** — donut chart breakdown, category analytics, monthly trends
- **Smart Alerts** — non-judgmental notifications for overspending or falling behind pace
- **Recurring Expenses** — track subscriptions and bills in one place

## Tech Stack

- HTML5, CSS3, vanilla JavaScript
- Mobile-first design (390×844 viewport)
- No frameworks, no build step — open `index.html` to run

## Getting Started

```bash
git clone https://github.com/Ranj04/bands4u.git
cd bands4u
open index.html          # macOS
start index.html         # Windows
```

No build step, no install, no server required. Just open `index.html` in any modern browser.

**For demos:** Chrome DevTools → Device Toolbar (⌘⇧M / Ctrl+Shift+M) → iPhone 14 Pro. On a desktop the phone frame is centered with a soft backdrop so it looks like a device mockup. Press `R` to jump back to the Splash screen.

## Screens (15 total)

| # | Screen | Reached from |
|---|---|---|
| 1 | Splash / Welcome | App launch |
| 2 | Sign Up | Splash → *Sign Up* |
| 3 | Log In | Splash → *Log In* |
| 4 | Profile Setup | Sign Up → *Create Account* |
| 5 | Dashboard | Log In / Profile Setup |
| 6 | Quick Add Expense | Dashboard → *Expense* quick-action |
| 7 | Add Income | Dashboard → *Income* quick-action |
| 8 | Goals list | Bottom tab *Goals* |
| 9 | Create Goal | Dashboard *New Goal* / Goals *+* FAB |
| 10 | Goal Progress Detail | Any goal card or preview |
| 11 | Goal Impact | Goal Detail → *View Goal Impact* |
| 12 | Alerts | Dashboard bell icon |
| 13 | Monthly Summary (Insights) | Bottom tab *Insights* |
| 14 | Recurring Expenses | Insights → *View Recurring* |
| 15 | Profile / Settings | Bottom tab *Profile* |

## Navigation

- **Bottom tabs** (Home, Goals, Insights, Profile) on the four main screens.
- **Back arrows** on every sub-screen return to the previous screen.
- **Save** buttons on Add Expense/Income return to Dashboard; Create Goal returns to Goals list.
- **Alerts** link into the relevant Goal Detail, Insights, or Recurring.
- **Log Out** on Profile returns to Splash.

## Notable interactions

- **Dashboard donut chart** — hand-rolled SVG using `stroke-dasharray` on concentric circles; no chart library.
- **Expense/Income keypad** — tap numbers to build the amount, backspace deletes, decimals supported.
- **Goal Impact sliders** — dragging any of the three category sliders updates the projected finish-line marker on the timeline AND rewrites the dynamic message ("Cutting Dining by $20/week = reach goal 12 days earlier"). All three combine.
- **Goal Progress Detail** — ring and stats populate based on which goal you tapped.

## File structure

```
Band4U/
├── index.html    # all 15 screens as <div class="screen">
├── styles.css    # design system + per-screen styles
├── app.js        # navigation + interactive pieces
└── README.md
```

## Course

CSC 642/842 — Human-Computer Interaction, Spring 2026

