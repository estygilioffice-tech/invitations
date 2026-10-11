# CLAUDE.md — Esti & Gili Digital Invitations

Read this file fully before every task in this folder. These rules apply to every session, every file and every template.

## 1. Who we are

- **Brand:** אסתי וגילי · עיצוב והפקת אירועים · "מהרעיון ועד הרגע" (Esti & Gili)
- **Audience:** Israeli families and couples. Hebrew first, English second.
- **Store:** an existing **Shopix** site (app.shopix.global, not Shopify). We are adding **customizable digital invitations** to it. We are not building a new site.
- **Customer flow:** choose an event type → style → background → fill in details in the live editor → copy details into the product's "פרטי ההזמנה" field → Shopix checkout → receive a final high-resolution PNG.
- **Work split:** Gili designs the backgrounds (MASTER files, no text). Claude lays out the text on top: zones, fonts, sizes, colors, rules, and the template spec.

## 2. Hard rules — never break these

### Licensing
- **Fonts:** use only fonts from the approved list in section 4. Never add any other font, including ones that are "free for personal use", fonts found on random sites, or system fonts like Arial or David as design fonts. They may appear only as technical fallbacks.
- If a task needs a font that is not on the list, stop and ask. Suggest an OFL alternative from Google Fonts and wait for approval before adding it to the list.
- Never sell, share or expose font files as a product. Self-hosted font files stay inside the theme or server for rendering only.
- **Images and graphics:** use only Gili's backgrounds, assets we created, or assets with a license we can document. Never use characters or brands (Disney, Marvel, Pixar, Sanrio, Paw Patrol, sports teams and so on), logos of other companies, celebrity images, or images copied from Pinterest, Google or Instagram.
- Never copy another studio's invitation design. Inspiration is fine, reproduction is not.

### Security and payments
- Never collect, store, log or display credit-card numbers or CVV. Never build a payment form. Checkout stays inside Shopix.
- Never treat a frontend value (for example `paid=true`) as proof of payment. Final files are produced only after Gili sees the paid order in Shopix admin (phase 1: manual).
- Never put secrets in the editor, HTML, Shopix descriptions or any public repo: Shopix passwords, Paperless credentials, API keys. Never type the Shopix password; Gili signs in herself.
- Treat every customer-entered value as untrusted. Render it as text only (`textContent`, Liquid `escape`), never as HTML. Enforce max length on client and server.
- Never expose the clean MASTER or a predictable public URL to it before payment. The preview uses a low-resolution image with a watermark.
- Final downloads use non-guessable links, time-limited where possible.

### Working on the store
- Every Shopix product or category Claude saves appears on the live site at once. Ask Gili before saving anything in Shopix admin, and delete test items right after checking.
- Before writing code, list the files you will create and the files you will modify. Do not touch unrelated features.
- Do not install apps, packages or third-party scripts without explaining why and getting approval.
- Every change must be reversible and documented in `INVITATIONS_CHANGELOG.md`.
- No invoice generation. Invoices come from Shopix's digital-invoice feature or Paperless.

## 3. Design quality — every template must pass

### Layout
- Canvas: 9:16. MASTER at **2160×3840**, final output at **1080×1920** PNG.
- Safe margin: keep all text at least **6%** from every edge (about 65px at 1080 wide). Nothing important in the top or bottom 8%, where WhatsApp and Stories crop or overlay UI.
- Text sits on the calm areas of the background. Never place text over busy illustration, faces or high-contrast detail. If there is no calm area, say so and suggest a change to the background instead of forcing the text.
- One clear hierarchy per invitation: **1 hero line** (names), **1 supporting line** (what is celebrated), **details** (date, time, venue, address), **small print** (RSVP). Never more than 4 visual levels.
- Center alignment is the default for invitations. Right alignment only when the design clearly calls for it. Never left alignment for Hebrew.
- Group related details. Date and time on one line. Venue directly above address.
- Generous spacing. When in doubt, remove text or reduce size, never crowd.

### Typography
- Maximum **2 font families** per template, plus at most 1 accent font used for a single word or line.
- Hero size roughly 2.5 to 4 times the detail size. Details never smaller than **30px** at 1080 wide. Small print never smaller than **26px**.
- Script or handwritten fonts (Amatic SC, Karantina, Playpen Sans Hebrew) only for one short line, never for addresses, dates or long text.
- Line height 1.1 to 1.25 for headings, 1.3 to 1.5 for text.
- Numbers and dates: `16.05.2027 · 16:30`. Never mix formats in one template.
- Every field defines a safe font-size range (max → min). Auto-shrink only inside that range, then wrap to max lines, then show the customer a "please shorten" message. Text must never overflow, overlap or be cut.

### Color
- Use at most 3 text colors per template: primary, accent, secondary. Take them from the background itself.
- Contrast: text must be clearly readable on its exact spot. Aim for a contrast ratio of at least 4.5:1 for details and 3:1 for large headings. If the background is busy, use a subtle soft shadow or a quiet panel that matches the design, never a harsh box.
- Customers never pick arbitrary colors. Only variations we designed.

### Hebrew and RTL
- Full RTL. Test Hebrew only, English only, Hebrew with numbers, Hebrew with English words, phone numbers, addresses and dates. No reversed numbers, no punctuation at the wrong end.
- Gendered Hebrew: for a single celebrant, offer בן / בת and switch the wording (חוגג / חוגגת, מוזמנים לבר / בת המצווה).
- Every template ships with demo text in Hebrew and English.

### Optional fields
- If an optional field is empty, the layout closes the gap. No empty holes in the design.

## 4. Approved fonts

All are Google Fonts families with Hebrew and Latin support, licensed under the SIL Open Font License (OFL), which allows commercial use, embedding in images and PDFs, and printing. Before launch, confirm each license on its Google Fonts page and keep a copy of `OFL.txt` with the font files in `/fonts`.

| Font | Style | Best for |
|---|---|---|
| Frank Ruhl Libre | Serif | Elegant headings, weddings |
| David Libre | Serif | Classic text, verses |
| Bellefair | Serif | Luxury, ivory and gold designs |
| Noto Serif Hebrew | Serif | Body text, addresses |
| Rubik | Sans | Details, dates, kids |
| Heebo | Sans | Clean and modern |
| Assistant | Sans | Light, very readable |
| Varela Round | Rounded sans | Soft, baby and brit |
| Suez One | Display | Strong headings, bar and bat mitzvah |
| Secular One | Display | Happy headings, parties |
| Amatic SC | Handwritten | One accent word or line only |
| Karantina | Condensed hand | One tall heading line only |
| Playpen Sans Hebrew | Handwritten | Playful kids headings |
| Bona Nova | Serif (Hebrew + Latin) | Traditional verses, italic accents |

### Latin-only fonts (English versions only, never for Hebrew text)

Checked in the Google Fonts repository on 09.10.2026: all OFL.

| Font | Style | Best for |
|---|---|---|
| Cormorant Garamond | Serif | English names and text, weddings |
| Cinzel | Spaced capitals | Formal English headings |
| Italiana | Thin display | Modern English names |
| Bodoni Moda | High-contrast serif | Romantic English names |
| Allura | Script | One accent word or "&" |
| Parisienne | Script | One accent word or "&" |
| Pinyon Script | Script | One accent word or "&" (also allowed as the "&" in Hebrew templates) |

Fallback stacks only: `Georgia, serif` for serif fonts, `Arial, sans-serif` for sans fonts, `cursive` for handwritten fonts.

## 5. When Gili sends a new background

1. Check the file: 9:16, at least 2160 wide, PNG, no text, no watermark. Report any problem before doing layout.
2. Look at the background and describe briefly where the calm areas are.
3. Propose the text zones (A, B, C…) with what goes in each, alignment and max lines.
4. Pick fonts only from section 4, sizes and 3 colors taken from the background.
5. Write the template spec (format in section 6) and add it to the editor.
6. Render a preview with Hebrew demo text, English demo text, a very long name, and all optional fields empty. Show all four to Gili.
7. Fix anything that fails section 3 before calling it done.

## 6. Template spec format

One spec per template, stored in the templates data file, never with secrets.

```text
template_id: KIDS_001_CIRCUS
shopix_product: הזמנה לחתונה · צבעי מים
category: kids | wedding | bar-bat-mitzvah | baby | celebration
master: KIDS_001_MASTER.png (private, never public)
preview_bg: KIDS_001_PREVIEW_BG.jpg (low-res, watermarked in UI)
output: PNG 1080x1920
fonts: { display: Frank Ruhl Libre, text: Rubik }
colors: { primary: #F6F1E9, accent: #E3B04B, secondary: #C9D6E8 }
fields:
  - zone: A
    key: name
    required: true
    max_chars: 18
    x: 50%   y: 25%   max_width: 82%   max_lines: 1
    font: display   size: 190 → 110px   color: accent   align: center
  - zone: C
    key: message
    required: false
    collapse_if_empty: 7%
    ...
demo_text: { he: {...}, en: {...} }
```

## 7. Catalog structure

Three layers, all defined in `templates.js`:

| Layer | Ours | In Shopix |
|---|---|---|
| Event type | category: `wedding`, `barbat`, `birthday`, `brit` | a category in the catalog (shown in the menu) |
| Style | style id, e.g. `wed-watercolor` | one product, with price and images |
| Background | background key, e.g. `chateau` | a "בחירה" option with an image |
| Details | the editor's summary line | a required "הודעה" option: "פרטי ההזמנה" |
| Live editor | `editor.html#<style-id>` | an iframe in the product description |

- Fields, demo text and wording rules live on the category. Typography and colors live on the style. The text zone lives on the background.
- Style status: `ready` (backgrounds painted for this event type), `demo` (temporarily uses wedding paintings), `soon` (empty slot).
- `engine.js` renders, measures and checks. Every background must pass the 4 checks (Hebrew, English, long names, empty optional fields) before it goes live.

## 8. Folder and file names

```text
INVITATIONS/
  01_WEDDING/  02_BAR_BAT_MITZVAH/  03_BIRTHDAY/  04_BRIT/
    KIDS_001_CIRCUS/
      KIDS_001_MASTER.png
      KIDS_001_ZONES.png
      KIDS_001_PREVIEW_HE.png
      KIDS_001_PREVIEW_EN.png
      KIDS_001_MOCKUP_01.jpg
      KIDS_001_MOCKUP_02.jpg
      KIDS_001_THUMBNAIL.jpg
      KIDS_001_SPEC
```

## 9. MVP scope

Build only: 4 invitation categories, one product per style, editor with live preview, RTL, details saved on the order through the "פרטי ההזמנה" field, Shopix checkout, final PNG sent by Gili (phase 1), later automatic delivery.

Do not build yet: customer accounts, AI features, drag-and-drop editing, customer image or font uploads, PDF editor, a separate admin app, subscriptions, a mobile app.

## 10. Before anything goes live

Test on mobile and desktop, Hebrew RTL, very long text, empty optional fields, checkout, failed payment, back and refresh buttons, duplicate checkout, and that the clean file cannot be downloaded before payment. Then a short security review.

## 11. How to work with Gili

- Answer in Hebrew unless asked otherwise. Keep explanations short and practical.
- Show a visual result whenever possible, not just a description.
- Ask before any change that is hard to undo or that affects the live store.
- If something here conflicts with a request, say which rule it is and suggest the closest allowed option.
