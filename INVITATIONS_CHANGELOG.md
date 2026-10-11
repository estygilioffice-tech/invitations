# Invitations changelog

## 2026-10-11 · first version
Created:
- `editor.html`, `engine.js`, `templates.js`, `index.html`, `README.md`, `CLAUDE.md`, `.nojekyll`
- `bg/chateau.jpg`, `bg/como.jpg`, `bg/jerusalem.jpg`, `bg/tuscany.jpg` (540×960 previews)
- `brand/logo.png`

Catalog: 4 event types (wedding, barbat, birthday, brit), 8 styles (4 live, 4 waiting for backgrounds).
Checks: 40/40 pass (10 style × background pairs, 4 states each).
Modified: none (new repository). Shopix: nothing saved yet.
To undo: delete the repository or revert this commit.

## 2026-10-11 · opening verse and בס״ד
Modified:
- `templates.js`: every event type gets an "opening verse or line" field with ready verses (wedding: עוד ישמע, אני לדודי, שימני כחותם, מצאתי את שאהבה נפשי; bar/bat and brit: זה היום עשה ה׳ and more) plus free text, and a בס״ד option for Hebrew. Opening line may take 3 lines. Jerusalem text zone 54%→56% wide, bottom 53%→56%.
- `engine.js`: draws בס״ד above the text; the whole block may shrink to 60% (was 70%) before asking the customer to shorten.
- `editor.html`: verse picker (chips + own text) and a בס״ד checkbox.
Checks: 40/40 pass. To undo: revert this commit.
