/*
 * Prüft den Prototyp im Browser: Die dreizehn Testfälle aus Anhang C werden über die
 * Oberfläche eingegeben und das angezeigte Ergebnis wird mit testfaelle.json
 * verglichen. Zusätzlich werden Fragenführung, Pflichtfelder, ausschließende
 * Optionen, widersprüchliche Angaben, die Einordnung „Shadow AI nicht ausgeschlossen“, Fortschrittsanzeige, Hilfetexte, die Auswahl des KI-Dienstes, die Nachfrage vor
 * dem Verlassen der Seite, Netzwerkzugriffe und Browserspeicher geprüft.
 *
 * Benötigt Node.js und Playwright (npm install playwright) sowie die Browser
 * (npx playwright install chromium firefox webkit).
 * Aufruf im Projektordner:  node test/browser.test.js [chromium|firefox|webkit]
 * Ohne Angabe läuft der Test in Chromium. WebKit ist die Browser-Engine von Safari.
 */
const playwright = require("playwright");
const ENGINES = ["chromium", "firefox", "webkit"];
const ENGINE = process.argv[2] || "chromium";
if (!ENGINES.includes(ENGINE)) {
  console.error("Unbekannter Browser: " + ENGINE + ". Zulässig: " + ENGINES.join(", "));
  process.exit(2);
}
const path = require("path");
const ROOT = path.join(__dirname, "..");
const faelle = require(ROOT + "/test/testfaelle.json");
const I = require(ROOT + "/js/inhalte.js");
const SHOTS = process.env.BILDER || "";   // Ordner für Bildschirmfotos, leer = keine
const URL = require("url").pathToFileURL(path.join(ROOT, "SA-Tool.html")).href;
const BLOECKE = { 1: [1,2,3,4,5], 2: [6,7,8,9,10,11], 3: [12,13,14,15,16,17], 4: [18,19,20,21,22,23,24], 5: [25,26,27,28,29,30] };
let fehler = 0; const ok = (b, t) => { if (!b) { fehler++; console.log("  FEHLER: " + t); } };

async function antworte(page, f, wert) {
  const werte = Array.isArray(wert) ? wert : [wert];
  for (const w of werte) await page.locator(`#frage-${f} input[value="${w}"]`).check();
}
async function beginne(page) {
  await page.selectOption("#ki-dienst", "ChatGPT");
  await page.fill("#aufgabe", "Kundenmails zusammenfassen");
  await page.getByRole("button", { name: "Assessment beginnen" }).click();
}
async function durchlauf(page, a) {
  await page.goto(URL);
  await beginne(page);
  for (const b of Object.keys(BLOECKE)) {
    for (const n of BLOECKE[b]) {
      const f = "F" + n;
      const sichtbar = await page.locator("#frage-" + f).isVisible();
      ok(sichtbar === (a[f] !== undefined), `${f} sichtbar=${sichtbar}, erwartet ${a[f] !== undefined}`);
      if (sichtbar && a[f] !== undefined) await antworte(page, f, a[f]);
    }
    // Hinweis auf entfallende Fragen erscheint genau dann, wenn die abhängigen Fragen ausgeblendet sind
    const entfaellt = { F7: a.F7 === "Keine", F12: a.F12 === "Nein", F13: a.F13 !== undefined && a.F13 !== "Ja" };
    for (const [k, soll] of Object.entries(entfaellt)) {
      if (!BLOECKE[b].includes(Number(k.slice(1)))) continue;
      const ist = await page.locator("#entfaellt-" + k).isVisible();
      ok(ist === soll, `Hinweis entfallende Fragen nach ${k}: ${ist}, erwartet ${soll}`);
    }
    await page.locator("#weiter").click();
    if (a.F2 === "Nein") return;
  }
}
async function lies(page) {
  return await page.evaluate(() => {
    const t = (s) => [...document.querySelectorAll(s)].map((e) => e.textContent.trim());
    // Bereiche in der Reihenfolge R, D, S, unabhängig von ihrer Anordnung auf der Seite
    const bereiche = ["R", "D", "S"].map((k) => document.querySelector(`section.pfad[data-pfad="${k}"]`));
    const pfad = bereiche.map((s) => s.querySelector(".pfad-kopf .stufe-zahl").textContent);
    return {
      gesamt: document.querySelector(".gesamt-stufe").textContent,
      herkunft: (document.querySelector(".gesamt-regel") || {}).textContent,
      pfade: pfad, felder: t(".pfad-s .felder .stufe-zahl"),
      einordnung: document.querySelector(".einordnung-titel").textContent,
      zusatz: !!document.querySelector(".einordnung .zusatz-freigabe"),
      shadowZusatz: !!document.querySelector(".einordnung .zusatz-shadow"),
      regeln: bereiche.flatMap((b) => [...b.querySelectorAll(".regel")]).map((r) => r.dataset.kennung + "|" + r.querySelector(".stufe-zahl").textContent + "|" + r.querySelectorAll(".regel-text").length),
      luecken: [...document.querySelectorAll(".luecken-liste .frage-nr")].map((e) => e.textContent),
      wider: [...document.querySelectorAll(".widerspruch")].map((e) => e.dataset.kennung),
      emp: [...document.querySelectorAll(".empfehlung")].map((e) => e.dataset.kennung + "|" + (e.querySelector(".zustand") ? "Maßnahme " + e.querySelector(".zustand").dataset.zustand : "-") + "|" + e.querySelectorAll(".empfehlung-zusatz").length),
      kopf: document.querySelector(".vorbehalt").textContent,
    };
  });
}
const EIN = { "keine Shadow AI": "Keine Shadow AI laut Angaben", "keine Shadow AI, Freigabe steht aus": "Freigabe in Prüfung", "Shadow AI": "Shadow AI laut Angaben", "unklar": "Shadow AI nicht ausgeschlossen" };

(async () => {
  const browser = await playwright[ENGINE].launch();
  console.log("Browser: " + ENGINE + " " + browser.version());
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const anfragen = [], konsole = [];
  page.on("request", (r) => anfragen.push(r.url()));
  page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") konsole.push(m.text()); });
  page.on("pageerror", (e) => konsole.push("pageerror: " + e.message));

  console.log("== Testfälle im Browser ==");
  for (const [name, f] of Object.entries(faelle)) {
    const vorher = fehler;
    await durchlauf(page, f.antworten);
    const e = f.erwartet;
    if (e.gesamt === "Abschluss nach der Vorpruefung") {
      const txt = await page.locator("main").textContent();
      ok(txt.includes("Abschluss nach der Vorprüfung") && txt.includes("ausschließlich privat"), name + " Abschluss");
      ok(txt.includes(I.DEFINITION_SHADOW_AI), name + " Definition von Shadow AI auf der Abschlussseite");
      const art2 = await page.evaluate(() => (document.querySelector(".abschluss-grund a.norm-link") || {}).hash);
      ok(art2 === "#art_2", name + " Verweis Art. 2 Abs. 10 KI-VO: " + art2);
    } else {
      const r = await lies(page);
      ok(r.gesamt.startsWith("Stufe " + e.gesamt + " von 4"), name + " gesamt " + r.gesamt);
      if (e.gesamt === 1) ok(r.herkunft === undefined, name + " kein Satz zur Herkunft bei Stufe 1");
      ok((await page.locator("section.empfehlungen").count()) === (e.empfehlungen.length ? 1 : 0), name + " Maßnahmen nur, wenn es welche gibt");
      ok(JSON.stringify(r.pfade) === JSON.stringify([e.R, e.D, e.S].map(String)), name + " pfade " + r.pfade);
      ok(JSON.stringify(r.felder) === JSON.stringify(e.felder.map(String)), name + " felder " + r.felder);
      ok(r.einordnung === EIN[e.einordnung], name + " einordnung " + r.einordnung);
      ok(r.zusatz === e.freigabezusatz, name + " freigabezusatz");
      if (e.einordnung === "keine Shadow AI") ok((await page.locator(".einordnung .einordnung-hinweis").count()) === (e.freigabezusatz ? 1 : 0), name + " Hinweis zur Freigabe nur mit Freigabezusatz");
      // Der Zusatz zur Reaktionsstufe wird nicht mehr angezeigt (Entscheidung vom 11.10.2026).
      ok(!r.shadowZusatz, name + " kein Zusatz zur Reaktionsstufe");
      // Regeln: Kennungen ohne Zusätze, Reihenfolge wie erwartet
      const basis = []; const texte = {};
      e.regeln.forEach((x) => { const k = x.split(" ")[0]; if (!basis.includes(k)) basis.push(k); texte[k] = (texte[k] || 0) + 1; });
      ok(JSON.stringify(r.regeln.map((x) => x.split("|")[0])) === JSON.stringify(basis), name + " regeln " + r.regeln);
      r.regeln.forEach((x) => { const [k, st, n] = x.split("|"); ok(Number(n) === texte[k], name + " Hinweistexte " + k + " " + n + "/" + texte[k]);
        const soll = e.regeln.find((y) => y.startsWith(k + " (")) ; if (soll) ok((soll.includes("Eskalation") ? "4" : "3") === st, name + " Stufe " + k); });
      ok(JSON.stringify(r.luecken) === JSON.stringify(e.luecken), name + " luecken " + r.luecken);
      ok((await page.locator("section.luecken:not(.widersprueche)").count()) === (e.luecken.length ? 1 : 0), name + " Wissenslücken nur, wenn es welche gibt");
      ok(JSON.stringify(r.wider) === JSON.stringify(e.widersprueche), name + " widersprueche " + r.wider);
      const empSoll = []; e.empfehlungen.forEach(([n, z]) => { if (n.includes("Zusatz")) { const l = empSoll[empSoll.length - 1].split("|"); l[2] = "1"; empSoll[empSoll.length - 1] = l.join("|"); } else empSoll.push(n + "|" + (z === "-" ? "-" : "Maßnahme " + z) + "|0"); });
      ok(JSON.stringify(r.emp) === JSON.stringify(empSoll), name + " empfehlungen " + r.emp + " soll " + empSoll);
      const e6 = page.locator('.empfehlung[data-kennung="E6"]');
      if (await e6.count()) ok((await e6.locator(".empfehlung-erklaerung").count()) === (e.empfehlungen.some(([k, z]) => k === "E6" && z === "vorhanden") ? 1 : 0), name + " Erklärung der Alternative nur, wenn eine vorhanden ist");
      ok(r.kopf.includes("Prüfhinweis") && r.kopf.includes("keine Aussage über die Rechtskonformität"), name + " Kopftext");
      if (name === "T5" && SHOTS) await page.screenshot({ path: path.join(SHOTS, "ergebnis_T5.png"), fullPage: true });
      if (name === "T8" && SHOTS) await page.screenshot({ path: path.join(SHOTS, "ergebnis_T8.png"), fullPage: true });
      if (name === "T2" && SHOTS) await page.screenshot({ path: path.join(SHOTS, "ergebnis_T2.png"), fullPage: true });
    }
    console.log("  " + name + ": " + (fehler === vorher ? "stimmt" : "ABWEICHUNG"));
  }

  // Widersprüchliche Angaben: Einzelprüfungen mit dem Merkmal „widersprueche“ über die Oberfläche
  console.log("== Widersprüchliche Angaben ==");
  for (const p of require(ROOT + "/test/einzelpruefungen.json").filter((x) => x.erwartet.widersprueche)) {
    const vorher = fehler;
    await durchlauf(page, p.antworten);
    const kennungen = await page.evaluate(() => [...document.querySelectorAll(".widerspruch")].map((e) => e.dataset.kennung));
    const stufe = await page.locator(".gesamt-stufe").textContent();
    ok(JSON.stringify(kennungen) === JSON.stringify(p.erwartet.widersprueche), p.nr + " widersprueche " + kennungen);
    ok(stufe.startsWith("Stufe " + p.erwartet.gesamt + " von 4"), p.nr + " Gesamtstufe " + stufe);
    ok((await page.locator("section.widersprueche").count()) === (p.erwartet.widersprueche.length ? 1 : 0), p.nr + " Abschnitt nur bei Widerspruch");
    if (p.erwartet.widersprueche.length) {
      const text = await page.locator("section.widersprueche").textContent();
      ok(text.includes(I.FEST.widersprueche) && p.erwartet.widersprueche.every((k) => text.includes(I.WIDERSPRUECHE[k].text)), p.nr + " Wortlaut nach Anhang B");
    }
    if (p.nr === "P11" && SHOTS) await page.screenshot({ path: path.join(SHOTS, "ergebnis_P11.png"), fullPage: true });
    if (p.erwartet.widersprueche.length) {
      // „Zur Frage“ führt zur ersten Frage des Widerspruchs, ihre Antwort erhält den Fokus.
      const erste = await page.locator(".widerspruch .frage-nr").first().textContent();
      ok(!(await page.locator(".widerspruch").first().isVisible()), p.nr + " Widersprüche anfangs eingeklappt");
      await page.locator("section.widersprueche summary").click();
      await page.locator(".widerspruch .zur-frage").first().click();
      ok((await page.evaluate(() => document.activeElement.name)) === erste, p.nr + " Zur Frage führt zu " + erste);
    }
    console.log("  " + p.nr + ": " + (fehler === vorher ? "stimmt" : "ABWEICHUNG"));
  }

  // Einordnung als Shadow AI: Einzelprüfungen mit dem Merkmal „einordnung“ über die Oberfläche
  console.log("== Einordnung als Shadow AI ==");
  for (const p of require(ROOT + "/test/einzelpruefungen.json").filter((x) => x.erwartet.einordnung)) {
    const vorher = fehler;
    await durchlauf(page, p.antworten);
    const r = await lies(page);
    const text = await page.locator(".einordnung").textContent();
    ok(r.einordnung === I.EINORDNUNG[p.erwartet.einordnung].titel, p.nr + " einordnung " + r.einordnung);
    ok(text.includes(I.EINORDNUNG[p.erwartet.einordnung].text), p.nr + " Wortlaut nach Anhang B");
    if (/Shadow AI/.test(I.EINORDNUNG[p.erwartet.einordnung].text)) {
      // Das Info-Symbol neben der Überschrift blendet die Erklärung zu Shadow AI ein.
      await page.locator(".einordnung .info-knopf").click();
      ok(await page.locator(".einordnung .info-text").isVisible(), p.nr + " Erklärung zu Shadow AI erscheint");
    }
    ok(r.gesamt.startsWith("Stufe " + p.erwartet.gesamt + " von 4"), p.nr + " Gesamtstufe " + r.gesamt);
    ok(JSON.stringify(r.luecken) === JSON.stringify(p.erwartet.luecken), p.nr + " luecken " + r.luecken);
    console.log("  " + p.nr + ": " + (fehler === vorher ? "stimmt" : "ABWEICHUNG"));
  }

  console.log("== Fragenführung ==");
  await page.goto(URL);
  if (SHOTS) await page.screenshot({ path: path.join(SHOTS, "start.png"), fullPage: true });
  // Ohne KI-Dienst und Aufgabe beginnt das Assessment nicht.
  await page.getByRole("button", { name: "Assessment beginnen" }).click();
  ok((await page.locator(".feld-eingabe.fehlt").count()) === 2 && (await page.locator("#schritte .aktiv").count()) === 0, "Start ohne Angaben: zwei Pflichtfelder markiert");
  await page.selectOption("#ki-dienst", "ChatGPT");
  await page.getByRole("button", { name: "Assessment beginnen" }).click();
  ok((await page.locator(".feld-eingabe.fehlt").count()) === 1 && (await page.locator("#aufgabe-fehler").isVisible()), "Start ohne Aufgabe: ein Pflichtfeld markiert");
  await page.fill("#aufgabe", "Kundenmails zusammenfassen");
  await page.getByRole("button", { name: "Assessment beginnen" }).click();
  ok((await page.locator(".fall-zeile .fall-text").allTextContents()).join("") === "KI-Dienst: ChatGPTNutzung: Kundenmails zusammenfassen", "Nutzungsfall auf der Fragenseite");
  await page.evaluate(() => window.scrollTo(0, 900));
  ok((await page.locator(".fall-haftend").boundingBox()).y < 1, "Nutzungsfall bleibt beim Scrollen sichtbar");
  await page.evaluate(() => window.scrollTo(0, 0));
  // Pflichtfelder
  await page.locator("#weiter").click();
  ok(await page.locator(".sammelmeldung").isVisible(), "Sammelmeldung bei leerem Block");
  ok((await page.locator(".frage.fehlt").count()) === 5, "5 Fragen markiert: " + (await page.locator(".frage.fehlt").count()));
  ok((await page.locator("h1").textContent()).includes("Nutzungsfall"), "bleibt in Block 1");
  // F2 Nein blendet F3-F5 aus, Knopftext wechselt
  await antworte(page, "F1", "Texte"); await antworte(page, "F4", "freigegeben");
  await antworte(page, "F2", "Nein");
  ok(!(await page.locator("#frage-F3").isVisible()) && !(await page.locator("#frage-F5").isVisible()), "F3-F5 ausgeblendet bei F2 Nein");
  ok((await page.locator("#weiter").textContent()) === "Assessment abschließen", "Knopf: abschließen");
  await antworte(page, "F2", "Ja");
  ok(await page.locator("#frage-F4").isVisible(), "F4 wieder sichtbar");
  ok(!(await page.locator('#frage-F4 input[value="freigegeben"]').isChecked()), "F4-Antwort wurde verworfen");
  await antworte(page, "F3", "privat"); await antworte(page, "F4", "nicht bekannt");
  // ausschließende Optionen
  await antworte(page, "F5", [1, 2]);
  await antworte(page, "F5", "Keine");
  ok(!(await page.locator('#frage-F5 input[value="1"]').isChecked()) && await page.locator('#frage-F5 input[value="Keine"]').isChecked(), "Keine schließt Auswahl aus");
  await antworte(page, "F5", "Unklar");
  ok(!(await page.locator('#frage-F5 input[value="Keine"]').isChecked()), "Unklar schließt Keine aus");
  await antworte(page, "F5", [3]);
  ok(!(await page.locator('#frage-F5 input[value="Unklar"]').isChecked()), "Auswahl schließt Unklar aus");
  await antworte(page, "F5", "Keine");
  await page.locator("#weiter").click();
  // Block 2: bedingte Fragen
  ok(!(await page.locator("#frage-F8").isVisible()) && !(await page.locator("#frage-F9").isVisible()), "F8/F9 anfangs verborgen");
  await antworte(page, "F7", [6]);
  ok(await page.locator("#frage-F8").isVisible() && await page.locator("#frage-F9").isVisible(), "F8/F9 nach Auswahl in F7");
  await antworte(page, "F8", "Ja");
  if (SHOTS) await page.screenshot({ path: path.join(SHOTS, "block_B.png"), fullPage: true });
  await antworte(page, "F7", "Keine");
  ok(!(await page.locator("#frage-F8").isVisible()), "F8 nach F7 Keiner verborgen");
  await antworte(page, "F7", "Unklar");
  ok(await page.locator("#frage-F8").isVisible() && !(await page.locator('#frage-F8 input[value="Ja"]').isChecked()), "F8 bei Unklar sichtbar, alte Antwort verworfen");
  await antworte(page, "F7", "Keine");
  await antworte(page, "F6", "Keine"); await antworte(page, "F10", "Nein"); await antworte(page, "F11", "Nein");
  await page.locator("#weiter").click();
  // Block 3
  ok(!(await page.locator("#frage-F13").isVisible()), "F13 anfangs verborgen");
  await antworte(page, "F12", "Unklar");
  ok(await page.locator("#frage-F13").isVisible() && await page.locator("#frage-F17").isVisible() && !(await page.locator("#frage-F14").isVisible()), "F13, F15-F17 bei F12 Unklar, F14 nicht");
  const verweis = await page.evaluate(() => ["F15", "F16"].map((f) => { const p = document.querySelectorAll("#hilfe-" + f + " p"); const l = p[p.length - 1]; return l.className + "|" + l.textContent; }));
  ok(verweis[0] === "hilfe-zusatz|Die Frage bezieht sich auf die personenbezogenen Daten aus F12. Wo die Daten verarbeitet werden, fragt F16." && verweis[1] === "hilfe-zusatz|Wer die Daten verarbeitet, fragt F15.", "Querverweise F15/F16 kursiv ohne Markierungszeichen");
  await antworte(page, "F13", "Ja");
  ok(await page.locator("#frage-F14").isVisible(), "F14 bei F13 Ja");
  await antworte(page, "F13", "Unklar");
  ok(!(await page.locator("#frage-F14").isVisible()), "F14 bei F13 Unklar verborgen");
  await antworte(page, "F12", "Nein");
  ok(!(await page.locator("#frage-F13").isVisible()) && !(await page.locator("#frage-F17").isVisible()), "F13-F17 bei F12 Nein verborgen");
  await page.locator("#weiter").click();
  for (const [f, w] of [["F18", "intern"], ["F19", "Vorschlag"], ["F20", "gering"], ["F21", "immer"], ["F22", "ja"], ["F23", "lokal"], ["F24", "manuell"]]) await antworte(page, f, w);
  await page.locator("#weiter").click();
  for (const f of ["F25", "F26", "F27", "F28", "F30"]) await antworte(page, f, "Ja");
  await antworte(page, "F29", ["Stelle"]);
  // zurück zu Block 2 über die Leiste, F7 ändern, dann direkt zu Block 5: Ergebnis darf nicht erscheinen
  await page.locator(".schritt-knopf", { hasText: "Regulatorische" }).click();
  await antworte(page, "F7", [1]);
  await page.locator(".schritt-knopf", { hasText: "Governance" }).click();
  ok(await page.locator('#frage-F25 input[value="Ja"]').isChecked(), "Antworten bleiben beim Zurückgehen erhalten");
  await page.locator("#weiter").click();
  ok((await page.locator("h1").textContent()).includes("Regulatorische") && (await page.locator(".frage.fehlt").count()) === 2, "Rücksprung zu Block 2 mit 2 offenen Fragen");
  await antworte(page, "F8", "Nein"); await antworte(page, "F9", "Keine");
  for (let i = 0; i < 4; i++) await page.locator("#weiter").click();
  const r = await lies(page);
  // Ergebnisseite: Matrix und „Alle Bereiche öffnen“
  ok((await page.locator(".matrix tbody tr").count()) === 3 && (await page.locator("details.pfad-detail[open]").count()) === 0, "Matrix mit drei Bereichen, Details anfangs geschlossen");
  await page.locator(".alle-oeffnen").click();
  ok((await page.locator("details.pfad-detail[open]").count()) === 3 && (await page.locator(".alle-oeffnen").textContent()) === "Alle Bereiche schließen", "Alle Bereiche öffnen");
  await page.locator(".alle-oeffnen").click();
  ok((await page.locator("details.pfad-detail[open]").count()) === 0, "Alle Bereiche schließen");
  // Empfohlene Maßnahmen: eine Spalte, der Pfeil öffnet die Begründung als zusammenhängenden Text.
  const spalten = await page.evaluate(() => { const k = [...document.querySelectorAll(".empfehlung")].map((e) => e.getBoundingClientRect()); return k.length > 1 && Math.abs(k[0].width - k[1].width) < 2 && k[1].left > k[0].right; });
  ok(spalten, "Mehrere Maßnahmen in zwei gleich breiten Spalten");
  const karte = async (i) => page.locator(".empfehlung").nth(i).evaluate((e) => { const b = e.getBoundingClientRect(); return Math.round(b.height) + "|" + Math.round(b.top - e.parentElement.getBoundingClientRect().top); });
  const daneben = await karte(1);
  ok(!(await page.locator(".empfehlung .grund-text").first().isVisible()), "Begründung anfangs geschlossen");
  await page.locator(".empfehlung details summary").first().click();
  ok(await page.locator(".empfehlung .grund-text").first().isVisible(), "Pfeil öffnet die Begründung");
  const danebenNachher = await karte(1);
  ok(danebenNachher === daneben, "Begründung öffnen verändert die Karte daneben nicht " + daneben + " -> " + danebenNachher);
  ok((await page.locator(".empfehlung .grund-text").first().textContent()).length > 20 && !(await page.locator(".empfehlung").first().textContent()).includes("Festgestellt wurde"), "Begründung als Satz ohne Vorspann");
  await page.locator(".empfehlung details summary").first().click();
  ok((await page.locator(".fall-zeile").first().textContent()) === "KI-Dienst: ChatGPTNutzung: Kundenmails zusammenfassenKategorie: Texte erstellen oder überarbeiten", "Nutzungsfall mit Kategorie im Ergebnis");
  ok(r.emp.some((x) => x.startsWith("E5a|Maßnahme vorhanden")) && r.emp.some((x) => x.startsWith("E5b|Maßnahme fehlt")), "F29 nur Stelle: E5a vorhanden, E5b fehlt: " + r.emp);
  // Antworten ändern, neues Assessment
  await page.getByRole("button", { name: "Neues Assessment" }).click();
  ok((await page.locator("#ki-dienst").inputValue()) === "" && (await page.locator("#aufgabe").inputValue()) === "", "Neustart leert Nutzungsfall");
  await beginne(page);
  ok((await page.locator("input:checked").count()) === 0, "Neustart leert Antworten");
  // Neuladen: nichts gespeichert
  await antworte(page, "F1", "Texte"); await page.reload();
  ok(await page.getByRole("button", { name: "Assessment beginnen" }).isVisible(), "nach Neuladen Startseite");
  const speicher = await page.evaluate(() => ({ l: localStorage.length, s: sessionStorage.length, c: document.cookie }));
  ok(speicher.l === 0 && speicher.s === 0 && speicher.c === "", "kein Browserspeicher, keine Cookies: " + JSON.stringify(speicher));

  console.log("== Fortschritt ==");
  // Gezählt werden nur die Fragen, die bei den bisherigen Antworten gestellt werden.
  const fortschritt = async () => (await page.locator("#fortschritt-text").textContent()) + " | " + (await page.locator("#fortschritt").getAttribute("value")) + "/" + (await page.locator("#fortschritt").getAttribute("max"));
  const gesamt = async () => await page.locator("#fortschritt-gesamt").textContent();
  await page.goto(URL);
  await beginne(page);
  ok((await fortschritt()) === "0 von 5 Fragen beantwortet | 0/23", "Fortschritt am Anfang: " + (await fortschritt()));
  await antworte(page, "F1", "Texte"); await antworte(page, "F2", "Ja");
  ok((await fortschritt()) === "2 von 5 Fragen beantwortet | 2/23", "Fortschritt nach zwei Antworten: " + (await fortschritt()));
  await antworte(page, "F2", "Nein");
  ok((await fortschritt()) === "2 von 2 Fragen beantwortet | 2/2", "Fortschritt bei privater Nutzung: " + (await fortschritt()));
  await antworte(page, "F2", "Ja"); await antworte(page, "F3", "privat"); await antworte(page, "F4", "nicht bekannt"); await antworte(page, "F5", "Keine");
  await page.locator("#weiter").click();
  ok((await fortschritt()) === "0 von 4 Fragen beantwortet | 5/23", "Fortschritt im nächsten Block: " + (await fortschritt()));
  ok((await page.locator("#fortschritt-gesamt").textContent()) === "Gesamtfortschritt 22 %", "Gesamtfortschritt in Prozent");
  ok((await page.locator("#schritte .schritt.fertig").count()) === 1 && (await page.locator("#schritte .schritt.aktiv .schritt-knopf").textContent()).includes("Regulatorische"), "Navigation: Block 1 abgeschlossen, Block 2 aktuell");
  await antworte(page, "F7", [6]);
  ok((await fortschritt()) === "1 von 6 Fragen beantwortet | 6/25", "bedingte Fragen erhöhen die Gesamtzahl: " + (await fortschritt()));
  ok((await gesamt()) === "Gesamtfortschritt 24 %", "Gesamtfortschritt mit bedingten Fragen: " + (await gesamt()));
  await antworte(page, "F7", "Keine");
  ok((await fortschritt()) === "1 von 4 Fragen beantwortet | 6/23", "ausgeblendete Fragen zählen nicht mit: " + (await fortschritt()));
  ok((await gesamt()) === "Gesamtfortschritt 26 %", "Gesamtfortschritt ohne ausgeblendete Fragen: " + (await gesamt()));

  console.log("== Hilfetexte ==");
  await page.goto(URL);
  await beginne(page);
  const mitHilfe = await page.evaluate(() => Object.keys(window.Inhalte.FRAGEN).filter((f) => window.Inhalte.FRAGEN[f].hilfe));
  const inBlockA = mitHilfe.filter((f) => ["F1", "F2", "F3", "F4", "F5"].includes(f)).length;
  ok((await page.locator(".frage .info-knopf").count()) === inBlockA && inBlockA > 0, "jede Frage mit Hilfetext hat eine Info-Schaltfläche");
  const info = page.locator("#frage-F2 .info-knopf"), blase = page.locator("#hilfe-F2");
  ok(!(await blase.isVisible()), "Hilfetext anfangs verborgen");
  await info.click(); await page.mouse.move(5, 5); await page.waitForTimeout(300);
  ok(await blase.isVisible() && (await blase.textContent()).includes("privates Konto"), "Klick öffnet den Hilfetext, er bleibt offen");
  ok((await info.getAttribute("aria-expanded")) === "true", "Schaltfläche meldet den geöffneten Zustand");
  const lage = await page.evaluate(() => ({ feld: document.getElementById("hilfe-F2").getBoundingClientRect().bottom, antworten: document.querySelector("#frage-F2 .optionen").getBoundingClientRect().top }));
  ok(lage.antworten >= lage.feld, "Hilfetext schiebt die Antworten nach unten und überdeckt nichts");
  await info.focus(); await page.keyboard.press("Escape");
  ok(!(await blase.isVisible()), "Escape schließt den Hilfetext");
  await info.click(); await info.click();
  ok(!(await blase.isVisible()), "zweiter Klick schließt den Hilfetext");
  await page.locator("#frage-F3 .info-knopf").click();
  await info.click();
  await page.locator("#frage-F3 .info-knopf").click();
  ok(await page.locator("#hilfe-F3").isVisible() && !(await blase.isVisible()), "nur ein Hilfetext ist geöffnet");
  await page.locator("#frage-F3 .info-knopf").click();
  ok(!(await page.locator("#hilfe-F3").isVisible()), "Info-Schaltfläche schließt den Hilfetext wieder");

  // Wissensbereich der Startseite: drei Themen, anfangs geschlossen, mehrere können offen sein
  await page.goto(URL);
  ok((await page.locator(".wissen-thema").count()) === 3 && (await page.locator(".wissen-inhalt:visible").count()) === 0, "Wissensbereich: drei Themen, anfangs geschlossen");
  await page.locator(".wissen-kopf", { hasText: "Shadow AI" }).click();
  ok((await page.locator("#wissen-shadow-ai").textContent()).includes("nicht freigegeben ist und sich seiner Steuerung und Aufsicht entzieht"), "Shadow AI erklärt");
  await page.locator(".wissen-kopf", { hasText: "Datenschutz" }).click();
  ok(await page.locator("#wissen-shadow-ai").isVisible() && await page.locator("#wissen-datenschutz").isVisible(), "geöffnete Themen bleiben offen");
  await page.locator(".wissen-kopf", { hasText: "Shadow AI" }).click();
  ok(!(await page.locator("#wissen-shadow-ai").isVisible()) && await page.locator("#wissen-datenschutz").isVisible(), "zweiter Klick schließt nur dieses Thema");

  console.log("== Auswahl des KI-Dienstes ==");
  await page.goto(URL);
  const eintraege = await page.locator("#ki-dienst option").allTextContents();
  ok(eintraege.length === 10 && eintraege[0] === "Bitte auswählen" && eintraege[9] === "Sonstiger KI-Dienst", "Auswahlliste: leerer Eintrag, acht Vorschläge, Sonstiger: " + eintraege);
  ok(!(await page.locator("#ki-dienst-name").isVisible()), "Namensfeld anfangs verborgen");
  await page.selectOption("#ki-dienst", "sonstiger");
  ok(await page.locator("#ki-dienst-name").isVisible(), "Namensfeld bei Sonstiger sichtbar");
  await page.fill("#aufgabe", "Protokolle zusammenfassen");
  await page.getByRole("button", { name: "Assessment beginnen" }).click();
  ok((await page.locator("#ki-dienst-name-fehler").isVisible()) && (await page.locator(".feld-eingabe.fehlt").count()) === 1 && (await page.locator("#schritte .aktiv").count()) === 0, "Sonstiger ohne Namen: Namensfeld ist Pflichtfeld");
  await page.fill("#ki-dienst-name", "Hausinterner Assistent");
  ok(!(await page.locator("#ki-dienst-name-fehler").isVisible()), "Fehlermeldung verschwindet nach Eingabe");
  await page.getByRole("button", { name: "Assessment beginnen" }).click();
  ok((await page.locator(".fall-zeile .fall-text").allTextContents()).join("") === "KI-Dienst: Hausinterner AssistentNutzung: Protokolle zusammenfassen", "eingegebener Name als KI-Dienst");
  await page.locator("#marke").click();
  ok((await page.locator("#ki-dienst").inputValue()) === "sonstiger" && (await page.locator("#ki-dienst-name").inputValue()) === "Hausinterner Assistent", "Angaben bleiben auf der Startseite erhalten");
  await page.selectOption("#ki-dienst", "DeepL");
  ok(!(await page.locator("#ki-dienst-name").isVisible()), "Namensfeld bei Vorschlag verborgen");
  await page.getByRole("button", { name: "Assessment beginnen" }).click();
  ok((await page.locator(".fall-zeile .fall-text").allTextContents()).join("") === "KI-Dienst: DeepLNutzung: Protokolle zusammenfassen", "gewählter Vorschlag als KI-Dienst");

  console.log("== Wechsel des Nutzungsfalls ==");
  // Wird der Nutzungsfall nach dem Beginn geändert, gelten die bisherigen Antworten nicht mehr.
  await page.goto(URL);
  await beginne(page);
  await antworte(page, "F1", "Texte");
  await page.locator("#marke").click();
  ok(!(await page.locator(".fall-wechsel").isVisible()), "kein Hinweis bei unverändertem Nutzungsfall");
  await page.getByRole("button", { name: "Assessment beginnen" }).click();
  ok(await page.locator('#frage-F1 input[value="Texte"]').isChecked(), "unveränderter Nutzungsfall: Antworten bleiben erhalten");
  await page.locator("#marke").click();
  await page.fill("#aufgabe", "Angebote schreiben");
  ok(await page.locator(".fall-wechsel").isVisible(), "Hinweis bei geändertem Nutzungsfall");
  await page.fill("#aufgabe", "Kundenmails zusammenfassen");
  ok(!(await page.locator(".fall-wechsel").isVisible()), "Hinweis verschwindet bei Rückkehr zum alten Nutzungsfall");
  await page.selectOption("#ki-dienst", "DeepL");
  ok(await page.locator(".fall-wechsel").isVisible(), "Hinweis bei geändertem KI-Dienst");
  await page.getByRole("button", { name: "Assessment beginnen" }).click();
  ok(!(await page.locator('#frage-F1 input[value="Texte"]').isChecked()), "geänderter Nutzungsfall: bisherige Antworten verworfen");
  ok((await page.locator(".fall-zeile .fall-text").allTextContents()).join("") === "KI-Dienst: DeepLNutzung: Kundenmails zusammenfassen", "neuer Nutzungsfall wird angezeigt");

  console.log("== Nachfrage vor dem Verlassen ==");
  // Der Browser fragt nur nach, solange Antworten vorliegen und noch kein Ergebnis angezeigt wird.
  const nachfragen = [];
  page.on("dialog", async (d) => { nachfragen.push(d.type()); await d.accept(); });
  await page.goto(URL);
  await beginne(page);
  await page.reload();
  ok(nachfragen.length === 0, "keine Nachfrage ohne Antworten: " + nachfragen);
  await beginne(page);
  await antworte(page, "F1", "Texte");
  await page.reload();
  ok(nachfragen.length === 1 && nachfragen[0] === "beforeunload", "Nachfrage beim Neuladen mit Antworten: " + nachfragen);
  ok(await page.getByRole("button", { name: "Assessment beginnen" }).isVisible(), "nach bestätigter Nachfrage Startseite");
  // T2 mit F3 „Ohne Anmeldung“ und F26 „Nein“: E7 nennt im Etikett die Angabe aus F3, E2 verweist auf Art. 4
  await durchlauf(page, Object.assign({}, faelle.T2.antworten, { F3: "ohne Anmeldung", F26: "Nein" }));
  const marke = await page.evaluate(() => (document.querySelector('.empfehlung[data-kennung="E7"] .anlass-marke') || {}).textContent);
  ok(marke === "Ihre Angabe: Ohne Anmeldung oder Benutzerkonto", "Etikett E7 bei F3 ohne Anmeldung: " + marke);
  // Art. 4 KI-VO in E2 verweist auf die konsolidierte Fassung und öffnet ein neues Fenster
  const norm = await page.evaluate(() => { const l = document.querySelector('.empfehlung[data-kennung="E2"] a.norm-link'); return l ? [l.textContent, l.getAttribute("href"), l.target, l.rel].join("|") : ""; });
  ok(norm === "Art. 4 KI-VO|https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:02024R1689-20260727#art_4|_blank|noopener noreferrer", "Verweis Art. 4 KI-VO in E2: " + norm);
  // „Was ist Shadow AI?“ zeigt die Definition aus inhalte.js, unabhängig von der Reihenfolge der Themen
  const definition = await page.evaluate(() => (document.querySelector(".einordnung .info-text") || {}).textContent);
  ok(definition === I.DEFINITION_SHADOW_AI, "Erklärung „Was ist Shadow AI?“: " + definition);
  await page.reload();
  ok(nachfragen.length === 1, "keine Nachfrage auf der Ergebnisseite: " + nachfragen);
  await durchlauf(page, faelle.T1.antworten);
  await page.reload();
  ok(nachfragen.length === 1, "keine Nachfrage nach dem Abschluss der Vorprüfung: " + nachfragen);

  console.log("== Netzwerk und Konsole ==");
  const fremd = [...new Set(anfragen)].filter((u) => !u.startsWith(require("url").pathToFileURL(ROOT).href));
  console.log("  Anfragen gesamt:", anfragen.length, "| verschiedene Dateien:", [...new Set(anfragen)].map((u) => path.basename(u)).join(", "));
  ok(fremd.length === 0, "fremde Anfragen: " + fremd);
  // Firefox meldet Playwright keine Anfragen auf lokale Dateien (file://). Dort entfällt
  // die Prüfung, in Chromium und WebKit muss mindestens die Seite selbst erfasst sein.
  if (ENGINE === "firefox") console.log("  Hinweis: Firefox meldet keine Anfragen auf lokale Dateien, die Netzwerkprüfung erfolgt in Chromium und WebKit.");
  else ok(anfragen.length > 0, "Netzwerkanfragen wurden erfasst");
  ok(konsole.length === 0, "Konsolenmeldungen: " + konsole.join(" || "));

  // Mobilansicht
  const mob = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mp = await mob.newPage();
  await durchlauf(mp, faelle.T5.antworten);
  if (SHOTS) await mp.screenshot({ path: path.join(SHOTS, "mobil_ergebnis.png"), fullPage: true });
  const breite = await mp.evaluate(() => document.documentElement.scrollWidth);
  ok(breite <= 390, "kein horizontales Scrollen mobil: " + breite);
  await mp.goto(URL); await beginne(mp);
  if (SHOTS) await mp.screenshot({ path: path.join(SHOTS, "mobil_block.png"), fullPage: true });

  await browser.close();
  console.log("Fehler gesamt:", fehler);
  process.exit(fehler ? 1 : 0);
})();
