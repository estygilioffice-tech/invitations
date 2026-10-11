# invitations

The live invitation editor for **Esti & Gili** (אסתי וגילי · עיצוב והפקת אירועים).

Each Shopix product embeds one editor in its description:

```html
<iframe src="https://estygilioffice-tech.github.io/invitations/editor.html#wed-watercolor"
        width="100%" height="2400" style="border:0" allow="clipboard-write" title="עורך ההזמנה"></iframe>
```

| File | What it is |
|---|---|
| `templates.js` | The catalog: event types, styles, backgrounds, fields and wording. Add a style here. |
| `engine.js` | Draws an invitation, fits the text and runs the checks. Shared by every style. |
| `editor.html` | The editor customers use. The style id comes after `#`. |
| `index.html` | Internal list of every editor. |
| `bg/` | Small 540×960 preview backgrounds only. Full-size MASTER files never go in this repository. |
| `CLAUDE.md` | Working rules for this project. |

All fonts are Google Fonts under the SIL Open Font License.
