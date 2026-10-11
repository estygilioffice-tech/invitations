/* =====================================================================
   Esti & Gili — invitation render engine
   EGEngine.render(container, styleId, bgKey, data, lang, opts)
   draws one invitation into a 9:16 container and reports what did not fit.
   All customer text goes in through textContent only.
   ===================================================================== */
window.EGEngine = (function(EG){
  const clean = s => String(s||"").replace(/[\u0000-\u001F\u007F<>]/g,"").replace(/\s+/g," ").trim();
  const fmtDate = iso => { if(!iso) return ""; const [y,m,d] = String(iso).split("-"); return (y&&m&&d) ? `${d}.${m}.${y}` : ""; };
  const LET = {1:"א",2:"ב",3:"ג",4:"ד",5:"ה",6:"ו",7:"ז",8:"ח",9:"ט",10:"י",20:"כ",30:"ל",40:"מ",50:"נ",60:"ס",70:"ע",80:"פ",90:"צ",100:"ק",200:"ר",300:"ש",400:"ת"};
  function gem(n){
    let out = ""; for (const v of [400,300,200,100]) while (n >= v){ out += LET[v]; n -= v; }
    if (n === 15) out += "טו"; else if (n === 16) out += "טז";
    else { const t = Math.floor(n/10)*10, u = n%10; if (t) out += LET[t]; if (u) out += LET[u]; }
    return out.length === 1 ? out + "׳" : out.slice(0,-1) + "״" + out.slice(-1);
  }
  function hebrewDate(iso){
    if (!iso) return "";
    try{
      const parts = new Intl.DateTimeFormat("he-u-ca-hebrew",{day:"numeric",month:"long",year:"numeric"}).formatToParts(new Date(iso+"T12:00:00"));
      const g = t => (parts.find(p=>p.type===t)||{}).value;
      const day = parseInt(g("day"),10), month = g("month"), year = parseInt(g("year"),10);
      if (!day || !month || !year) return "";
      return `${gem(day)} ב${month} ${gem(year % 1000)}`;
    }catch(e){ return ""; }
  }
  function weekday(iso, lang){
    if (!iso) return "";
    try{ return new Intl.DateTimeFormat(lang==="he"?"he":"en",{weekday:"long"}).format(new Date(iso+"T12:00:00")); }catch(e){ return ""; }
  }

  // helpers handed to each category's compose()
  const H = {
    fmtDate, weekday,
    when(out, d, lang, times, timeKey, single){
      const dt = [weekday(d.date, lang), fmtDate(d.date)].filter(Boolean);
      if (single && times[0] && clean(times[0][1])) dt.push(clean(times[0][1]));
      const heb = lang==="he" ? clean(d.hebdate) : "";
      out.push({ s:"date", text: dt.join("  ·  "), ltr:true, gap: heb ? "xs" : (single ? "l" : "m"), key:"date" });
      if (heb) out.push({ s:"hebdate", text:heb, gap: single ? "l" : "m", key:"hebdate" });
      if (!single){
        const t = times.filter(x=>clean(x[1])).map(x=>`${x[0]} ${clean(x[1])}`).join("  ·  ");
        if (t) out.push({ s:"times", text:t, gap:"l", key:timeKey });
      }
    },
    where(out, d, gapAfter){
      if (clean(d.venue)) out.push({ s:"venue", text:clean(d.venue), gap:"xs", key:"venue" });
      if (clean(d.address)) out.push({ s:"address", text:clean(d.address), gap:gapAfter, key:"address" });
    }
  };

  function styleOf(id){ return EG.styles[id]; }
  function stackOf(name){ return EG.fontStacks[name] || "Georgia, serif"; }

  function applyLine(el, roleName, st, style, lang, scale, size){
    const F = style.fonts[lang], W = style.weights[lang];
    const role = (style.lineFont && style.lineFont[roleName]) || st.font;
    const isHero = role === "hero";
    el.style.fontFamily = stackOf(isHero ? F.hero : F.text);
    el.style.fontWeight = st.bold ? 500 : (isHero ? W.hero : W.text);
    el.style.fontStyle = st.italicEn && lang==="en" ? "italic" : "normal";
    el.style.letterSpacing = st.trackEn && lang==="en" ? st.trackEn+"em" : (lang==="he" ? "0" : "0.01em");
    el.style.lineHeight = st.lh;
    el.style.color = style.colors[st.color];
    el.style.fontSize = (Math.max(st.size[1], size)*scale)+"px";
  }

  function fit(cells, st, scale, fac){
    let size = Math.max(st.size[1], Math.round(st.size[0]*fac));
    const ok = () => cells.every(c => c.scrollHeight <= Math.ceil(size*scale*st.lh*st.max + 1) && c.scrollWidth <= c.clientWidth + 1);
    while (!ok() && size > st.size[1]){ size -= 2; cells.forEach(c=>c.style.fontSize = (size*scale)+"px"); }
    return ok();
  }

  function renderOnce(box, styleId, bgKey, d, lang, opts, fac){
    const style = styleOf(styleId), cat = EG.categories[style.category], bg = EG.backgrounds[bgKey], Z = bg.zone;
    box.innerHTML = "";
    const img = document.createElement("img"); img.className = "eg-bg"; img.alt = ""; img.src = (opts.base||"") + bg.file; img.crossOrigin = "anonymous";
    img.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover";
    box.appendChild(img);
    const W = box.clientWidth, Hh = box.clientHeight, scale = W/1080;
    if (bg.veil){
      const v = document.createElement("div");
      v.style.cssText = `position:absolute;left:${Z.axis-Z.width/2-12}%;width:${Z.width+24}%;top:${Z.top-6}%;height:${Z.bottom-Z.top+12}%;`+
        "background:radial-gradient(closest-side, rgba(247,240,228,.86) 55%, rgba(247,240,228,.55) 78%, rgba(247,240,228,0) 100%);pointer-events:none";
      box.appendChild(v);
    }
    const block = document.createElement("div");
    block.dir = lang==="he" ? "rtl" : "ltr";
    block.style.cssText = `position:absolute;left:${Z.axis}%;width:${Z.width}%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;text-align:center`;
    box.appendChild(block);
    const problems = {}, lineEls = [];
    const items = cat.compose(d, lang, H);
    if (lang==="he" && d.bsd === true) items.unshift({ s:"bsd", text:"בס״ד", gap:"m" });
    for (const it of items){
      const st = EG.lines[it.s];
      let el;
      if (it.parts){
        el = document.createElement("div"); el.dataset.s = it.s; el.style.width = "100%"; el.style.overflow = "hidden"; el.style.fontVariantNumeric = "lining-nums";
        const spans = it.parts.map(t=>{ const s = document.createElement("span"); s.textContent = t || " "; return s; });
        let amp = null;
        if (spans.length === 2){
          amp = document.createElement("span"); amp.textContent = "&";
          amp.style.cssText = `font-family:${stackOf(style.fonts.amp || "Pinyon Script")};color:${style.colors.accent};font-weight:400;font-size:0.78em;padding:0 0.16em;vertical-align:0.05em;font-style:normal`;
          el.append(spans[0], amp, spans[1]);
        } else el.append(spans[0]);
        block.appendChild(el);
        applyLine(el, it.s, st, style, lang, scale, st.size[0]*fac);
        el.style.whiteSpace = "nowrap";
        let size = Math.max(st.size[1], st.size[0]*fac);
        while (el.scrollWidth > el.clientWidth + 1 && size > st.size[1]){ size -= 2; el.style.fontSize = (size*scale)+"px"; }
        if (el.scrollWidth > el.clientWidth + 1 && amp){
          el.style.whiteSpace = "normal"; el.insertBefore(document.createElement("br"), amp);
          size = Math.min(st.size[0]*fac, 112); el.style.fontSize = (size*scale)+"px";
          while (el.scrollWidth > el.clientWidth + 1 && size > st.size[1]){ size -= 2; el.style.fontSize = (size*scale)+"px"; }
        }
        if (el.scrollWidth > el.clientWidth + 1) (it.keys||[]).forEach(k=>problems[k]=true);
      } else if (it.row){
        if (it.rule) block.appendChild(rule(style, scale, W));
        el = document.createElement("div"); el.dataset.s = it.s;
        el.style.cssText = `display:flex;width:100%;justify-content:center;gap:${EG.gap.l*W/100}px`;
        const cells = it.row.map(t=>{ const c = document.createElement("div"); c.textContent = t; c.style.cssText = "flex:1;min-width:0;overflow:hidden;text-wrap:balance"; applyLine(c, it.s, st, style, lang, scale, st.size[0]*fac); el.appendChild(c); return c; });
        block.appendChild(el);
        if (!fit(cells, st, scale, fac)) (it.keys||[]).forEach(k=>problems[k]=true);
      } else {
        if (it.rule) block.appendChild(rule(style, scale, W));
        el = document.createElement("div"); el.dataset.s = it.s;
        el.style.cssText = "width:100%;overflow:hidden;text-wrap:balance;font-variant-numeric:lining-nums";
        if (it.ltr && lang==="he"){
          // Hebrew weekday, then numbers isolated left-to-right
          const parts = it.text.split("  ·  ");
          parts.forEach((p,i)=>{
            if (i){ const sep = document.createElement("span"); sep.textContent = "  ·  "; sep.style.whiteSpace = "pre"; el.appendChild(sep); }
            const isNum = /\d/.test(p);
            const n = document.createElement(isNum ? "bdi" : "span"); if (isNum) n.dir = "ltr"; n.textContent = p; el.appendChild(n);
          });
        } else el.textContent = it.text;
        block.appendChild(el);
        applyLine(el, it.s, st, style, lang, scale, st.size[0]*fac);
        if (!fit([el], st, scale, fac) && it.key) problems[it.key] = true;
      }
      if (it.gap) el.style.marginBottom = (EG.gap[it.gap]*W/100*Math.max(fac,0.7))+"px";
      lineEls.push(el);
    }
    const zoneTop = Z.top/100*Hh, zoneH = (Z.bottom - Z.top)/100*Hh, bh = block.offsetHeight;
    block.style.top = (zoneTop + Math.max(0, (zoneH - bh)/2))+"px";
    if (opts.watermark !== false){
      const wm = document.createElement("div");
      wm.style.cssText = "position:absolute;inset:0;display:grid;place-items:center;pointer-events:none";
      const s = document.createElement("span"); s.textContent = "ESTI & GILI PREVIEW";
      s.style.cssText = `transform:rotate(-28deg);font:600 ${W*0.046}px Arial,sans-serif;letter-spacing:.3em;color:rgba(80,70,55,.16);white-space:nowrap;direction:ltr`;
      wm.appendChild(s); box.appendChild(wm);
    }
    return { problems, lineEls, block, overflow: bh > zoneH + 1 };
  }
  function rule(style, scale, W){
    const r = document.createElement("div");
    r.style.cssText = `width:${Math.round(110*scale)}px;height:1px;background:${style.colors.secondary};opacity:.45;margin-bottom:${EG.gap.s*W/100}px`;
    return r;
  }

  function render(box, styleId, bgKey, d, lang, opts={}){
    box.style.position = box.style.position || "relative";
    let res;
    for (let f = 1; f >= 0.6; f -= 0.03){ res = renderOnce(box, styleId, bgKey, d, lang, opts, f); if (!res.overflow) break; }
    return res;
  }

  // demo data for a style + language, with the Hebrew date filled in
  function demo(styleId, lang){
    const cat = EG.categories[styleOf(styleId).category];
    const d = Object.assign({}, cat.demo[lang]);
    if (lang==="he" && cat.fields.some(f=>f.auto==="hebdate")) d.hebdate = hebrewDate(d.date);
    return d;
  }

  // the line the customer pastes into Shopix "פרטי ההזמנה"
  function summary(styleId, bgKey, d, lang){
    const style = styleOf(styleId), cat = EG.categories[style.category], he = lang==="he";
    const rows = [[he?"סגנון":"Style", style.he], [he?"רקע":"Background", EG.backgrounds[bgKey].he], [he?"שפה":"Language", he?"עברית":"English"]];
    for (const f of cat.fields){
      if (f.heOnly && !he) continue;
      let v = d[f.k];
      if (f.type==="gender") v = f.options[v] ? f.options[v][he?"he":"en"] : "";
      if (f.type==="toggle") v = v === true ? (he ? "כן" : "yes") : "";
      if (f.type==="date") v = fmtDate(v);
      v = clean(v);
      if (v) rows.push([f[he?"he":"en"], v]);
    }
    return styleId.toUpperCase() + " | " + rows.map(r=>r[0]+": "+r[1]).join(" | ");
  }

  // ---------------- QA: measured on the painting ----------------
  const bgCache = {};
  function bgPixels(bgKey, base){
    if (bgCache[bgKey]) return bgCache[bgKey];
    bgCache[bgKey] = new Promise(res=>{
      const img = new Image(); img.crossOrigin = "anonymous";
      img.onload = ()=>{ try{
        const cv = document.createElement("canvas"); cv.width = img.naturalWidth; cv.height = img.naturalHeight;
        const x = cv.getContext("2d", { willReadFrequently:true }); x.drawImage(img,0,0);
        res({ w:cv.width, h:cv.height, px:x.getImageData(0,0,cv.width,cv.height).data });
      }catch(e){ res(null); } };
      img.onerror = ()=>res(null);
      img.src = (base||"") + EG.backgrounds[bgKey].file;
    });
    return bgCache[bgKey];
  }
  const lum = (r,g,b) => { const f = v => { v/=255; return v<=0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4); }; return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b); };
  const hexLum = h => lum(parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16));
  const ratio = (a,b) => (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
  async function measure(box, res, styleId, bgKey, base){
    const style = styleOf(styleId), bg = EG.backgrounds[bgKey];
    const out = { contrast:null, busy:0, centered:true, edges:true, overflow:res.overflow, cut:Object.keys(res.problems).length>0 };
    const ir = box.getBoundingClientRect(), br = res.block.getBoundingClientRect();
    const axisPx = ir.left + bg.zone.axis/100*ir.width;
    const ink = el => { const rg = document.createRange(); rg.selectNodeContents(el); return rg.getBoundingClientRect(); };
    for (const el of res.lineEls){ const r = ink(el); if (Math.abs((r.left+r.right)/2 - axisPx) > ir.width*0.006) out.centered = false; }
    if (br.left-ir.left < ir.width*0.06-1 || ir.right-br.right < ir.width*0.06-1 || br.top-ir.top < ir.height*0.08-1 || ir.bottom-br.bottom < ir.height*0.08-1) out.edges = false;
    const data = await bgPixels(bgKey, base); if (!data) return out;
    let worst = 99, busy = 0; const a = bg.veil ? 0.75 : 0, vc = [247,240,228];
    for (const el of res.lineEls){
      const tl = hexLum(style.colors[EG.lines[el.dataset.s].color]), r = ink(el);
      const x0 = Math.max(0, Math.floor((r.left-ir.left)/ir.width*data.w)), x1 = Math.min(data.w, Math.ceil((r.right-ir.left)/ir.width*data.w));
      const y0 = Math.max(0, Math.floor((r.top-ir.top)/ir.height*data.h)), y1 = Math.min(data.h, Math.ceil((r.bottom-ir.top)/ir.height*data.h));
      const ls = [];
      for (let y=y0; y<y1; y+=2) for (let x=x0; x<x1; x+=2){ const i=(y*data.w+x)*4; ls.push(lum(data.px[i]*(1-a)+vc[0]*a, data.px[i+1]*(1-a)+vc[1]*a, data.px[i+2]*(1-a)+vc[2]*a)); }
      if (!ls.length) continue;
      ls.sort((p,q)=>p-q);
      worst = Math.min(worst, ratio(tl, ls[Math.floor(ls.length*0.1)]));
      const mean = ls.reduce((p,q)=>p+q,0)/ls.length;
      busy = Math.max(busy, Math.sqrt(ls.reduce((p,q)=>p+(q-mean)*(q-mean),0)/ls.length));
    }
    out.contrast = worst; out.busy = busy;
    out.pass = !out.overflow && !out.cut && out.centered && out.edges && worst >= 4.5 && busy < 0.06;
    return out;
  }

  function qaStates(styleId){
    const cat = EG.categories[styleOf(styleId).category];
    const he = demo(styleId, "he"), en = demo(styleId, "en");
    const long = Object.assign({}, he, cat.longNames);
    const empty = Object.assign({}, he); cat.optional.forEach(k=>empty[k] = "");
    return [ ["עברית", he, "he"], ["English", en, "en"], ["שמות ארוכים", long, "he"], ["שדות רשות ריקים", empty, "he"] ];
  }

  return { render, demo, summary, measure, qaStates, hebrewDate, clean, fmtDate };
})(window.EG);
