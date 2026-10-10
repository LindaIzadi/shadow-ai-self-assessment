/*
 * Prüft den Prototyp im Browser: Die zehn Testfälle aus Anhang C werden über die
 * Oberfläche eingegeben und das angezeigte Ergebnis wird mit testfaelle.json
 * verglichen. Zusätzlich werden Fragenführung, Pflichtfelder, ausschließende
 * Optionen, widersprüchliche Angaben, die Einordnung „Shadow AI nicht ausgeschlossen“, Fortschrittsanzeige, Hilfetexte, die Auswahl des KI-Dienstes, die Nachfrage vor
 * dem Verlassen der Seite, Netzwerkzugriffe und Browserspeicher geprüft.
 *
 * Benötigt Node.js und Playwright (npm install playwright).
 * Aufruf im Projektordner:  node test/browser.test.js
 */
const { chromium } = require("playwright");
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
      pfade: pfad, felder: t(".felder .stufe-zahl"),
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
const EIN = { "keine Shadow AI": "Keine Shadow AI", "keine Shadow AI, Freigabe steht aus": "Freigabe in Prüfung", "Shadow AI": "Shadow AI", "unklar": "Shadow AI nicht ausgeschlossen" };

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const anfragen = [], konsole = [];
  page.on("request", (r) => anfragen.push(r.url()));
  page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") konsole.push(m.text()); });
  page.on("pageerror", (e) => konsole.push("pageerror: " + e.message));

  console.log("== Zehn Testfälle im Browser ==");
  for (const [name, f] of Object.entries(faelle)) {
    const vorher = fehler;
    await durchlauf(page, f.antworten);
    const e = f.erwartet;
    if (e.gesamt === "Abschluss nach der Vorpruefung") {
      const txt = await page.locator("main").textContent();
      ok(txt.includes("Abschluss nach der Vorprüfung") && txt.includes("ausschließlich privat"), name + " Abschluss");
    } else {
      const r = await lies(page);
      ok(r.gesamt.startsWith("Stufe " + e.gesamt + " von 4"), name + " gesamt " + r.gesamt);
      if (e.gesamt === 1) ok(r.herkunft === I.FEST.gesamtKeinBereich, name + " Satz zu Stufe 1");
      ok(JSON.stringify(r.pfade) === JSON.stringify([e.R, e.D, e.S].map(String)), name + " pfade " + r.pfade);
      ok(JSON.stringify(r.felder) === JSON.stringify(e.felder.map(String)), name + " felder " + r.felder);
      ok(r.einordnung === EIN[e.einordnung], name + " einordnung " + r.einordnung);
      ok(r.zusatz === e.freigabezusatz, name + " freigabezusatz");
      ok(r.shadowZusatz === (e.einordnung === "Shadow AI"), name + " Zusatz bei Shadow AI");
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
  await page.goto(URL);
  await beginne(page);
  ok((await fortschritt()) === "0 von 23 Fragen beantwortet | 0/23", "Fortschritt am Anfang: " + (await fortschritt()));
  await antworte(page, "F1", "Texte"); await antworte(page, "F2", "Ja");
  ok((await fortschritt()) === "2 von 23 Fragen beantwortet | 2/23", "Fortschritt nach zwei Antworten: " + (await fortschritt()));
  await antworte(page, "F2", "Nein");
  ok((await fortschritt()) === "2 von 2 Fragen beantwortet | 2/2", "Fortschritt bei privater Nutzung: " + (await fortschritt()));
  await antworte(page, "F2", "Ja"); await antworte(page, "F3", "privat"); await antworte(page, "F4", "nicht bekannt"); await antworte(page, "F5", "Keine");
  await page.locator("#weiter").click();
  ok((await fortschritt()) === "5 von 23 Fragen beantwortet | 5/23", "Fortschritt im nächsten Block: " + (await fortschritt()));
  await antworte(page, "F7", [6]);
  ok((await fortschritt()) === "6 von 25 Fragen beantwortet | 6/25", "bedingte Fragen erhöhen die Gesamtzahl: " + (await fortschritt()));
  await antworte(page, "F7", "Keine");
  ok((await fortschritt()) === "6 von 23 Fragen beantwortet | 6/23", "ausgeblendete Fragen zählen nicht mit: " + (await fortschritt()));

  console.log("== Hilfetexte ==");
  await page.goto(URL);
  await beginne(page);
  const mitHilfe = await page.evaluate(() => Object.keys(window.Inhalte.FRAGEN).filter((f) => window.Inhalte.FRAGEN[f].hilfe));
  const inBlockA = mitHilfe.filter((f) => ["F1", "F2", "F3", "F4", "F5"].includes(f)).length;
  ok((await page.locator(".frage .info-knopf").count()) === inBlockA && inBlockA > 0, "jede Frage mit Hilfetext hat eine Info-Schaltfläche");
  const info = page.locator("#frage-F2 .info-knopf"), blase = page.locator("#hilfe-F2");
  ok(!(await blase.isVisible()), "Hilfetext anfangs verborgen");
  await info.hover();
  ok(await blase.isVisible() && (await blase.textContent()).includes("privates Konto"), "Hilfetext erscheint beim Überfahren");
  await page.mouse.move(5, 5); await page.waitForTimeout(400);
  ok(!(await blase.isVisible()), "Hilfetext verschwindet nach dem Verlassen");
  await info.focus();
  ok(await blase.isVisible(), "Hilfetext erscheint bei Tastaturfokus");
  await page.keyboard.press("Escape");
  ok(!(await blase.isVisible()), "Escape schließt den Hilfetext");
  await info.click(); await page.mouse.move(5, 5); await page.waitForTimeout(400);
  ok(await blase.isVisible(), "Klick hält den Hilfetext offen");
  await page.locator("#frage-F3 .info-knopf").click();
  ok(!(await blase.isVisible()) && await page.locator("#hilfe-F3").isVisible(), "nur ein Hilfetext bleibt offen");
  await antworte(page, "F1", "Texte");
  ok(!(await page.locator("#hilfe-F3").isVisible()), "Klick daneben schließt den Hilfetext");

  // Erklärung von Shadow AI auf der Startseite
  await page.goto(URL);
  const sai = page.locator("#hilfe-shadow-ai");
  ok(!(await sai.isVisible()), "Erklärung Shadow AI anfangs verborgen");
  await page.locator(".start-einleitung .info-knopf").hover();
  ok(await sai.isVisible() && (await sai.textContent()).includes("nicht freigegeben ist und sich seiner Steuerung und Aufsicht entzieht"), "Erklärung Shadow AI beim Überfahren");
  ok((await page.locator(".start-einleitung .info-knopf").getAttribute("aria-label")) === "Was ist Shadow AI?", "Schaltfläche benannt");

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
  await durchlauf(page, faelle.T2.antworten);
  await page.reload();
  ok(nachfragen.length === 1, "keine Nachfrage auf der Ergebnisseite: " + nachfragen);
  await durchlauf(page, faelle.T1.antworten);
  await page.reload();
  ok(nachfragen.length === 1, "keine Nachfrage nach dem Abschluss der Vorprüfung: " + nachfragen);

  console.log("== Netzwerk und Konsole ==");
  const fremd = [...new Set(anfragen)].filter((u) => !u.startsWith(require("url").pathToFileURL(ROOT).href));
  console.log("  Anfragen gesamt:", anfragen.length, "| verschiedene Dateien:", [...new Set(anfragen)].map((u) => path.basename(u)).join(", "));
  ok(fremd.length === 0, "fremde Anfragen: " + fremd);
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
