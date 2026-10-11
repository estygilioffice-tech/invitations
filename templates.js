/* =====================================================================
   Esti & Gili — invitation catalog
   One file holds the whole structure:
     categories  → fields, demo text and wording for each event type
     styles      → typography and colors, which backgrounds belong to it
     backgrounds → the painting and its calm text zone
   Adding a design = add a background, then list it in a style.
   ===================================================================== */
window.EG = (function(){

  // ---------------- BACKGROUNDS (Gili's paintings) ----------------
  // zone: % of the 9:16 canvas. axis = horizontal centre of the text block.
  const backgrounds = {
    chateau:   { he:"האחוזה",   en:"The Château",   file:"bg/chateau.jpg",   zone:{ axis:50, width:74, top:9,  bottom:53 } },
    como:      { he:"אגם ווילה", en:"Lakeside Villa", file:"bg/como.jpg",      zone:{ axis:57, width:62, top:10, bottom:54 } },
    jerusalem: { he:"ירושלים",   en:"Jerusalem",     file:"bg/jerusalem.jpg", zone:{ axis:46, width:56, top:10, bottom:56 } },
    tuscany:   { he:"כרם",       en:"Vineyard",      file:"bg/tuscany.jpg",   zone:{ axis:60, width:58, top:13, bottom:57 }, veil:true }
  };

  // ---------------- shared helpers for wording ----------------
  const c = s => String(s||"").replace(/[\u0000-\u001F\u007F<>]/g,"").replace(/\s+/g," ").trim();
  const dateRow = (d, lang, h) => [h.weekday(d.date, lang), h.fmtDate(d.date)].filter(Boolean).join("  ·  ");

  // ---------------- opening lines: verses and sentences to pick from ----------------
  // Each list is offered in the editor; "אחר" lets the customer type her own line.
  const OPEN = {
    wedding:{
      he:[
        "עוד ישמע בערי יהודה ובחוצות ירושלים, קול ששון וקול שמחה, קול חתן וקול כלה",
        "אני לדודי ודודי לי",
        "שימני כחותם על ליבך",
        "מצאתי את שאהבה נפשי",
        "בשמחה רבה ובהודיה לה׳"
      ],
      en:[ "Together with their families", "I am my beloved's and my beloved is mine", "Set me as a seal upon your heart", "With joy and gratitude" ]
    },
    barbat:{
      he:[ "זה היום עשה ה׳, נגילה ונשמחה בו", "ה׳ עוז לעמו ייתן, ה׳ יברך את עמו בשלום", "בשמחה ובהודיה לה׳" ],
      en:[ "This is the day the Lord has made, let us rejoice in it", "With joy and gratitude" ]
    },
    birthday:{
      he:[ "יש לנו סיבה טובה לחגוג", "שנה טובה, חברים טובים, ערב אחד שמח", "מזל טוב!" ],
      en:[ "We have a good reason to celebrate", "Good friends, a good year, one happy evening" ]
    },
    brit:{
      he:[ "זה היום עשה ה׳, נגילה ונשמחה בו", "אל הנער הזה התפללתי", "בשמחה ובהודיה לה׳" ],
      en:[ "This is the day the Lord has made, let us rejoice in it", "With joy and gratitude" ]
    }
  };
  const opening = (cat, label) => ({ k: cat==="birthday" ? "message" : "opening", type:"preset", presets:OPEN[cat], req:false, max:90,
    he: label ? label.he : "פסוק או משפט פתיחה", en: label ? label.en : "Opening verse or line", group:"words", wide:true });
  const bsd = { k:"bsd", type:"toggle", req:false, heOnly:true, he:"בס״ד בראש ההזמנה", en:"בס״ד", group:"words", wide:true };

  // ---------------- CATEGORIES ----------------
  // field types: text (default), date, time, number, gender
  // compose(d, lang, h) returns the lines of the invitation, top to bottom.
  const categories = {

    wedding: {
      he:"חתונה", en:"Wedding", shopix:"הזמנות לחתונה",
      groups:{ couple:{he:"הזוג",en:"The couple"}, words:{he:"נוסח",en:"Wording"}, when:{he:"מתי",en:"When"}, where:{he:"איפה",en:"Where"} },
      fields:[
        { k:"bride",   req:true,  max:16, he:"שם הכלה", en:"Bride's name", group:"couple" },
        { k:"groom",   req:true,  max:16, he:"שם החתן", en:"Groom's name", group:"couple" },
        bsd, opening("wedding"),
        { k:"pBride",  req:false, max:28, he:"הורי הכלה", en:"Bride's parents", group:"words" },
        { k:"pGroom",  req:false, max:28, he:"הורי החתן", en:"Groom's parents", group:"words" },
        { k:"date",    req:true,  type:"date", he:"תאריך", en:"Date", group:"when" },
        { k:"hebdate", req:false, max:24, he:"תאריך עברי", en:"Hebrew date", group:"when", heOnly:true, auto:"hebdate" },
        { k:"reception", req:true, type:"time", he:"קבלת פנים", en:"Reception", group:"when" },
        { k:"ceremony",  req:true, type:"time", he:"חופה וקידושין", en:"Ceremony", group:"when" },
        { k:"venue",   req:true,  max:30, he:"מקום", en:"Venue", group:"where" },
        { k:"address", req:true,  max:50, he:"כתובת", en:"Address", group:"where", wide:true },
        { k:"closing", req:false, max:50, he:"שורת סיום", en:"Closing line", group:"where", wide:true }
      ],
      demo:{
        he:{ bsd:true, bride:"תמר", groom:"איתי", opening:"עוד ישמע בערי יהודה ובחוצות ירושלים, קול ששון וקול שמחה, קול חתן וקול כלה", pBride:"שרה ודוד כהן", pGroom:"רחל ומשה לוי",
             date:"2027-07-08", reception:"19:30", ceremony:"20:30", venue:"אחוזת השקמים", address:"דרך הכרמים 4, זכרון יעקב", closing:"נשמח לחגוג איתכם" },
        en:{ bride:"Tamar", groom:"Itay", opening:"Together with their families", pBride:"Sarah & David Cohen", pGroom:"Rachel & Moshe Levi",
             date:"2027-07-08", reception:"19:30", ceremony:"20:30", venue:"The Sycamore Estate", address:"4 Derech HaKramim, Zikhron Ya'akov", closing:"Dinner and dancing to follow" }
      },
      longNames:{ bride:"אלכסנדרה-מרים", groom:"בנימין-יהונתן", pBride:"שושנה ואברהם בן-שמעון", pGroom:"מרגלית ויעקב רוזנבלום" },
      optional:["bsd","opening","pBride","pGroom","hebdate","closing"],
      compose(d, lang, h){
        const he = lang==="he", out = [];
        const parents = [c(d.pBride), c(d.pGroom)].filter(Boolean);
        if (c(d.opening)) out.push({ s:"opening", text:c(d.opening), gap:"l", key:"opening" });
        out.push({ s:"invite", gap:"l", text: parents.length
          ? (he ? "מתכבדים להזמינכם לחגוג עמנו את נישואי ילדינו" : "request the pleasure of your company at the marriage of their children")
          : (he ? "שמחים להזמינכם לחגוג איתנו את חתונתנו" : "invite you to celebrate their wedding") });
        out.push({ s:"hero", parts:[c(d.bride), c(d.groom)], gap:"l", keys:["bride","groom"] });
        h.when(out, d, lang, [[he?"קבלת פנים":"Reception", d.reception], [he?"חופה וקידושין":"Ceremony", d.ceremony]], "reception");
        h.where(out, d, parents.length ? "m" : "l");
        if (parents.length) out.push({ s:"parents", row:parents, gap:"m", rule:true, keys:["pBride","pGroom"] });
        if (c(d.closing)) out.push({ s:"closing", text:c(d.closing), key:"closing" });
        return out;
      }
    },

    barbat: {
      he:"בר ובת מצווה", en:"Bar / Bat Mitzvah", shopix:"הזמנות לבר ובת מצווה",
      groups:{ who:{he:"החוגג או החוגגת",en:"Celebrant"}, words:{he:"נוסח",en:"Wording"}, when:{he:"מתי",en:"When"}, where:{he:"איפה",en:"Where"} },
      fields:[
        { k:"gender",  type:"gender", req:true, he:"סוג האירוע", en:"Event", group:"who", options:{ m:{he:"בר מצווה",en:"Bar Mitzvah"}, f:{he:"בת מצווה",en:"Bat Mitzvah"} } },
        { k:"child",   req:true,  max:16, he:"שם", en:"Name", group:"who" },
        bsd, opening("barbat"),
        { k:"parents", req:true,  max:34, he:"שמות ההורים", en:"Parents", group:"words", wide:true },
        { k:"date",    req:true,  type:"date", he:"תאריך", en:"Date", group:"when" },
        { k:"hebdate", req:false, max:24, he:"תאריך עברי", en:"Hebrew date", group:"when", heOnly:true, auto:"hebdate" },
        { k:"time",    req:true,  type:"time", he:"שעה", en:"Time", group:"when" },
        { k:"venue",   req:true,  max:30, he:"מקום", en:"Venue", group:"where" },
        { k:"address", req:true,  max:50, he:"כתובת", en:"Address", group:"where", wide:true },
        { k:"closing", req:false, max:50, he:"שורת סיום", en:"Closing line", group:"where", wide:true }
      ],
      demo:{
        he:{ bsd:true, gender:"f", child:"נועה", opening:"זה היום עשה ה׳, נגילה ונשמחה בו", parents:"מיכל ויואב אברהם", date:"2027-11-18", time:"19:00",
             venue:"מלון המלך דוד", address:"המלך דוד 23, ירושלים", closing:"נשמח לראותכם" },
        en:{ gender:"f", child:"Noa", opening:"This is the day the Lord has made, let us rejoice in it", parents:"Michal & Yoav Avraham", date:"2027-11-18", time:"19:00",
             venue:"The King David Hotel", address:"23 King David St, Jerusalem", closing:"We look forward to celebrating with you" }
      },
      longNames:{ child:"אלכסנדרה-מרים", parents:"שושנה ואברהם בן-שמעון-רוזנבלום" },
      optional:["bsd","opening","hebdate","closing"],
      compose(d, lang, h){
        const he = lang==="he", f = d.gender==="f", out = [];
        if (c(d.opening)) out.push({ s:"opening", text:c(d.opening), gap:"l", key:"opening" });
        out.push({ s:"invite", gap:"l", text: he
          ? (f ? "נשמח לראותכם בשמחת בת המצווה של בתנו" : "נשמח לראותכם בשמחת בר המצווה של בננו")
          : (f ? "invite you to celebrate the Bat Mitzvah of their daughter" : "invite you to celebrate the Bar Mitzvah of their son") });
        out.push({ s:"hero", parts:[c(d.child)], gap:"xs", keys:["child"] });
        out.push({ s:"sub", text: he ? (f ? "בת מצווה" : "בר מצווה") : (f ? "Bat Mitzvah" : "Bar Mitzvah"), gap:"l" });
        h.when(out, d, lang, [[he?"בשעה":"at", d.time]], "time", true);
        h.where(out, d, "m");
        out.push({ s:"parents", text:c(d.parents), gap:"m", rule:true, key:"parents" });
        if (c(d.closing)) out.push({ s:"closing", text:c(d.closing), key:"closing" });
        return out;
      }
    },

    birthday: {
      he:"יום הולדת", en:"Birthday", shopix:"הזמנות ליום הולדת",
      groups:{ who:{he:"החוגג או החוגגת",en:"Celebrant"}, words:{he:"נוסח",en:"Wording"}, when:{he:"מתי",en:"When"}, where:{he:"איפה",en:"Where"} },
      fields:[
        { k:"gender",  type:"gender", req:true, he:"מי חוגג", en:"Celebrating", group:"who", options:{ m:{he:"חוגג",en:"He"}, f:{he:"חוגגת",en:"She"} } },
        { k:"child",   req:true,  max:16, he:"שם", en:"Name", group:"who" },
        { k:"age",     req:true,  type:"number", min:1, max2:120, he:"גיל", en:"Age", group:"who" },
        opening("birthday", { he:"משפט פתיחה", en:"Opening line" }),
        { k:"date",    req:true,  type:"date", he:"תאריך", en:"Date", group:"when" },
        { k:"time",    req:true,  type:"time", he:"שעה", en:"Time", group:"when" },
        { k:"venue",   req:true,  max:30, he:"מקום", en:"Venue", group:"where" },
        { k:"address", req:true,  max:50, he:"כתובת", en:"Address", group:"where", wide:true },
        { k:"rsvp",    req:false, max:40, he:"אישור הגעה", en:"RSVP", group:"where", wide:true }
      ],
      demo:{
        he:{ gender:"f", child:"מאיה", age:"40", message:"יש לנו סיבה טובה לחגוג", date:"2027-06-10", time:"20:00",
             venue:"הכרם של גבעות", address:"דרך היין 7, מושב גבעות", rsvp:"אישור הגעה: 050-1234567" },
        en:{ gender:"f", child:"Maya", age:"40", message:"We have a good reason to celebrate", date:"2027-06-10", time:"20:00",
             venue:"Givot Vineyard", address:"7 Derech HaYayin, Givot", rsvp:"RSVP: 050-1234567" }
      },
      longNames:{ child:"אלכסנדרה-מרים", message:"שנה טובה, חברים טובים, ערב אחד שמח" },
      optional:["message","rsvp"],
      compose(d, lang, h){
        const he = lang==="he", f = d.gender==="f", out = [];
        const age = c(d.age).replace(/\D/g,"").slice(0,3);
        if (c(d.message)) out.push({ s:"opening", text:c(d.message), gap:"l", key:"message" });
        out.push({ s:"invite", gap:"l", text: he ? (f ? "בואו לחגוג איתה" : "בואו לחגוג איתו") : (f ? "Join us to celebrate her birthday" : "Join us to celebrate his birthday") });
        out.push({ s:"hero", parts:[c(d.child)], gap:"xs", keys:["child"] });
        if (age) out.push({ s:"sub", text: he ? `${f?"חוגגת":"חוגג"} ${age}` : `turns ${age}`, gap:"l", key:"age" });
        h.when(out, d, lang, [[he?"בשעה":"at", d.time]], "time", true);
        h.where(out, d, c(d.rsvp) ? "m" : null);
        if (c(d.rsvp)) out.push({ s:"closing", text:c(d.rsvp), key:"rsvp" });
        return out;
      }
    },

    brit: {
      he:"ברית ובריתה", en:"Brit / Simchat Bat", shopix:"הזמנות לברית ובריתה",
      groups:{ who:{he:"התינוק או התינוקת",en:"The baby"}, words:{he:"נוסח",en:"Wording"}, when:{he:"מתי",en:"When"}, where:{he:"איפה",en:"Where"} },
      fields:[
        { k:"gender",  type:"gender", req:true, he:"סוג האירוע", en:"Event", group:"who", options:{ m:{he:"ברית מילה",en:"Brit Milah"}, f:{he:"בריתה",en:"Simchat Bat"} } },
        { k:"baby",    req:false, max:16, he:"שם התינוק או התינוקת", en:"Baby's name", group:"who", help:{he:"אפשר להשאיר ריק אם השם יוכרז באירוע",en:"Leave empty if the name will be announced at the event"} },
        bsd, opening("brit"),
        { k:"parents", req:true,  max:34, he:"שמות ההורים", en:"Parents", group:"words", wide:true },
        { k:"grand",   req:false, max:60, he:"הסבים והסבתות", en:"Grandparents", group:"words", wide:true },
        { k:"date",    req:true,  type:"date", he:"תאריך", en:"Date", group:"when" },
        { k:"hebdate", req:false, max:24, he:"תאריך עברי", en:"Hebrew date", group:"when", heOnly:true, auto:"hebdate" },
        { k:"time",    req:true,  type:"time", he:"שעה", en:"Time", group:"when" },
        { k:"venue",   req:true,  max:30, he:"מקום", en:"Venue", group:"where" },
        { k:"address", req:true,  max:50, he:"כתובת", en:"Address", group:"where", wide:true }
      ],
      demo:{
        he:{ bsd:true, gender:"m", baby:"", opening:"זה היום עשה ה׳, נגילה ונשמחה בו", parents:"הדס ועידו שרון", grand:"הסבים: רינה ויוסף שרון · אורית ודני גל",
             date:"2027-03-09", time:"10:30", venue:"בית הכנסת אוהל משה", address:"הרצל 12, רעננה" },
        en:{ gender:"m", baby:"", opening:"With joy and gratitude", parents:"Hadas & Ido Sharon", grand:"Grandparents: Rina & Yosef Sharon · Orit & Dani Gal",
             date:"2027-03-09", time:"10:30", venue:"Ohel Moshe Synagogue", address:"12 Herzl St, Ra'anana" }
      },
      longNames:{ baby:"אביגיל-שושנה", parents:"שושנה ואברהם בן-שמעון-רוזנבלום" },
      optional:["bsd","baby","opening","grand","hebdate"],
      compose(d, lang, h){
        const he = lang==="he", f = d.gender==="f", out = [];
        if (c(d.opening)) out.push({ s:"opening", text:c(d.opening), gap:"l", key:"opening" });
        out.push({ s:"invite", gap:"l", text: he
          ? (f ? "נתכבד להזמינכם לשמחת הבריתה של בתנו" : "נתכבד להזמינכם לשמחת ברית המילה של בננו")
          : (f ? "invite you to celebrate the birth of their daughter" : "invite you to the Brit Milah of their son") });
        const kind = he ? (f ? "בריתה" : "ברית מילה") : (f ? "Simchat Bat" : "Brit Milah");
        if (c(d.baby)){
          out.push({ s:"hero", parts:[c(d.baby)], gap:"xs", keys:["baby"] });
          out.push({ s:"sub", text:kind, gap:"l" });
        } else {
          out.push({ s:"hero", parts:[kind], gap:"l" });
        }
        h.when(out, d, lang, [[he?"בשעה":"at", d.time]], "time", true);
        h.where(out, d, "m");
        out.push({ s:"parents", text:c(d.parents), gap: c(d.grand) ? "xs" : null, rule:true, key:"parents" });
        if (c(d.grand)) out.push({ s:"closing", text:c(d.grand), key:"grand" });
        return out;
      }
    }
  };

  // ---------------- STYLES ----------------
  // status: ready = backgrounds made for this event type
  //         demo  = uses wedding paintings until Gili paints its own
  //         soon  = empty slot waiting for backgrounds
  const watercolorColors = { primary:"#3B362D", accent:"#8A5649", secondary:"#4C5A45" };
  const styles = {
    "wed-watercolor": {
      category:"wedding", he:"צבעי מים", en:"Watercolor", status:"ready",
      blurb:"נופים בצבעי מים, אחוזות ואגמים, וטקסט עדין בשמיים",
      backgrounds:["chateau","como","jerusalem","tuscany"],
      fonts:{ he:{ hero:"Bellefair", text:"Frank Ruhl Libre" }, en:{ hero:"Cormorant Garamond", text:"Cormorant Garamond" }, amp:"Pinyon Script" },
      weights:{ he:{ hero:400, text:400 }, en:{ hero:300, text:400 } },
      colors: watercolorColors
    },
    "wed-minimal": {
      category:"wedding", he:"מינימליסטי", en:"Minimal", status:"soon",
      blurb:"נייר נקי, קו דק וטיפוגרפיה גדולה", backgrounds:[]
    },
    "bm-jerusalem": {
      category:"barbat", he:"ירושלים של זהב", en:"Golden Jerusalem", status:"demo",
      blurb:"ירושלים בצבעי מים, בנוסח מסורתי וחגיגי",
      backgrounds:["jerusalem","chateau"],
      fonts:{ he:{ hero:"Bona Nova", text:"Frank Ruhl Libre" }, en:{ hero:"Cinzel", text:"Cormorant Garamond" } },
      weights:{ he:{ hero:700, text:400 }, en:{ hero:500, text:400 } },
      colors: watercolorColors
    },
    "bm-modern": {
      category:"barbat", he:"מודרני", en:"Modern", status:"soon",
      blurb:"צבעים עזים וכותרת חזקה", backgrounds:[]
    },
    "bd-sunset": {
      category:"birthday", he:"שקיעה בכרם", en:"Vineyard Sunset", status:"demo",
      blurb:"ערב חגיגי בצבעי שקיעה, לימי הולדת של מבוגרים",
      backgrounds:["tuscany","como"],
      fonts:{ he:{ hero:"Bellefair", text:"Assistant" }, en:{ hero:"Italiana", text:"Cormorant Garamond" } },
      weights:{ he:{ hero:400, text:400 }, en:{ hero:400, text:500 } },
      lineFont:{ sub:"text" },          // Italiana draws "40" like "ıo", so the age line uses the text font
      colors: watercolorColors
    },
    "bd-kids": {
      category:"birthday", he:"לילדים", en:"Kids", status:"soon",
      blurb:"צבעוני ושמח, לימי הולדת של ילדים", backgrounds:[]
    },
    "br-soft": {
      category:"brit", he:"רך ועדין", en:"Soft", status:"demo",
      blurb:"מים שקטים ואור רך, לברית ולבריתה",
      backgrounds:["como","tuscany"],
      fonts:{ he:{ hero:"Varela Round", text:"Assistant" }, en:{ hero:"Cormorant Garamond", text:"Cormorant Garamond" } },
      weights:{ he:{ hero:400, text:400 }, en:{ hero:400, text:400 } },
      colors: watercolorColors
    },
    "br-pastel": {
      category:"brit", he:"פסטל", en:"Pastel", status:"soon",
      blurb:"תכלת או ורוד עדין", backgrounds:[]
    }
  };

  // ---------------- default line styles (px at 1080 wide) ----------------
  // font: hero or text. size: max → min. All sizes keep the CLAUDE.md minimums.
  const lines = {
    bsd:     { font:"text", size:[28,26], lh:1.3,  max:1, color:"secondary" },
    opening: { font:"text", size:[38,30], lh:1.3,  max:3, color:"secondary", italicEn:true },
    invite:  { font:"text", size:[38,32], lh:1.35, max:2, color:"primary", light:true },
    hero:    { font:"hero", size:[150,84], lh:1.08, max:1, color:"primary" },
    sub:     { font:"hero", size:[56,44], lh:1.2,  max:1, color:"accent" },
    date:    { font:"text", size:[46,38], lh:1.25, max:1, color:"primary", bold:true, trackEn:0.04 },
    hebdate: { font:"text", size:[34,30], lh:1.3,  max:1, color:"secondary" },
    times:   { font:"text", size:[36,30], lh:1.35, max:2, color:"primary" },
    venue:   { font:"hero", size:[50,38], lh:1.2,  max:2, color:"secondary" },
    address: { font:"text", size:[34,30], lh:1.35, max:2, color:"primary" },
    parents: { font:"text", size:[34,28], lh:1.35, max:2, color:"primary" },
    closing: { font:"text", size:[32,28], lh:1.35, max:2, color:"secondary", italicEn:true }
  };
  const gap = { xs:0.8, s:1.4, m:2.2, l:3.2, xl:4.6 };

  const fontStacks = {
    "Bellefair":"'Bellefair', 'Frank Ruhl Libre', Georgia, serif",
    "Frank Ruhl Libre":"'Frank Ruhl Libre', Georgia, serif",
    "Bona Nova":"'Bona Nova', 'Frank Ruhl Libre', Georgia, serif",
    "Assistant":"'Assistant', Arial, sans-serif",
    "Varela Round":"'Varela Round', 'Assistant', Arial, sans-serif",
    "Cormorant Garamond":"'Cormorant Garamond', Georgia, serif",
    "Cinzel":"'Cinzel', Georgia, serif",
    "Italiana":"'Italiana', Georgia, serif",
    "Pinyon Script":"'Pinyon Script', cursive"
  };
  const googleFonts = [
    "Bellefair", "Frank+Ruhl+Libre:wght@300;400;500;700", "Bona+Nova:ital,wght@0,400;0,700;1,400",
    "Assistant:wght@400;500;600;700", "Varela+Round", "Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400",
    "Cinzel:wght@400;500", "Italiana", "Pinyon+Script"
  ];

  return { backgrounds, categories, styles, lines, gap, fontStacks, googleFonts, version:"2026-10-11" };
})();
