# Baccarat Predictor (Simple, Bilingual)

A super-simple, no-backend web app (HTML/CSS/JS) that gives a light suggestion for the next Baccarat outcome (Player / Banker / Tie) based on:
- A blend of **last 5 rounds** (Laplace-smoothed frequency)
- And **overall totals** since you started logging

> ⚠️ This is **not** gambling or financial advice. It’s just a basic, pattern-based helper.

## Features
- Arabic / English toggle
- Add results quickly with buttons
- Live probabilities + clear bars
- Totals, ties, and **prediction accuracy**
- Undo & Reset
- Data saved locally (LocalStorage)

## How to use
1. Open `index.html` in your browser.
2. Choose language (العربية / English).
3. After each round, click the correct outcome (Player / Banker / Tie).
4. The app shows a **suggested next outcome** and updates stats.
5. You can **Undo** the last entry or **Reset** all.

## Notes
- The suggestion before each added round is counted against accuracy.
- Accuracy counts a Tie only if the app suggested a Tie.
- Last 5 rounds are shown as chips.
