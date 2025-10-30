# Baccarat Predictor — Full Version

Local client-side web app for manual recording and heuristic analysis of Baccarat rounds.
Features:
- Manual input: PLAYER / BANKER / TIE buttons
- Undo / Reset / Sample fill
- Import (paste CSV or list like `P,B,B,P,T`) and Export CSV / JSON
- Mini beadroad visualization
- Pattern detection: streaks, ping-pong, double-pattern, majority in last 5
- LocalStorage persistence (keeps up to 1000 rounds)
- Language toggle AR/EN and simple audio toggle
- Expose `window.addRoundFromLive(value)` for integration with live feeds (value = 'P'|'B'|'T')

Open index.html in your browser to use.
