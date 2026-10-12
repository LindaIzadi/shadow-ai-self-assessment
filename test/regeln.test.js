/*
 * Prüft regeln.js in vier Schritten:
 *   1. gegen die dreizehn Testfälle aus Anhang C (testfaelle.json)
 *   2. gegen die Einzelprüfungen (einzelpruefungen.json)
 *   3. Abgleich der internen Codes zwischen regeln.js und inhalte.js
 *   4. Zurückweisung ungültiger Eingaben
 * Aufruf im Projektordner:  node test/regeln.test.js
 */
const path = require("path");
const R = require(path.join(__dirname, "..", "js", "regeln.js"));
const I = require(path.join(__dirname, "..", "js", "inhalte.js"));
const faelle = require(path.join(__dirname, "testfaelle.json"));

// Die Testdaten nennen Regeln und Empfehlungen in der Schreibweise von Anhang C.
// protokoll() überführt das Ergebnis von auswerten() in diese Schreibweise.
const auswerten = (antworten) => R.protokoll(R.auswerten(antworten));
const gleich = (x, y) => JSON.stringify(x) === JSON.stringify(y);

// ---------------------------------------------------------------- 1. Testfälle aus Anhang C
let abweichungen = 0;
for (const [name, f] of Object.entries(faelle)) {
  const ist = auswerten(f.antworten);
  const unterschiede = Object.keys(f.erwartet).filter((k) => !gleich(ist[k], f.erwartet[k]));
  if (unterschiede.length) {
    abweichungen++;
    console.log(name + ": ABWEICHUNG");
    unterschiede.forEach((k) =>
      console.log("   " + k + ": ist " + JSON.stringify(ist[k]) + " / soll " + JSON.stringify(f.erwartet[k]))
    );
  } else {
    console.log(name + ": stimmt mit Anhang C überein");
  }
}
console.log("Abweichungen: " + abweichungen);

// ---------------------------------------------------------------- 2. Einzelprüfungen
// Varianten der Regeln, Hinweise und Empfehlungen, die in den Testfällen nicht
// vorkommen (einzelpruefungen.json). Die erwarteten Ergebnisse sind dort von Hand festgelegt.
const einzel = require(path.join(__dirname, "einzelpruefungen.json"));
let abweichungenEinzel = 0;
for (const p of einzel) {
  const ist = auswerten(p.antworten), ab = [];
  for (const [k, v] of Object.entries(p.erwartet)) {
    if (k === "regeln_mit") v.filter((r) => !ist.regeln.includes(r)).forEach((r) => ab.push("Regel fehlt: " + r));
    else if (k === "regeln_ohne") v.filter((r) => ist.regeln.includes(r)).forEach((r) => ab.push("Regel greift unerwartet: " + r));
    else if (k === "empfehlungen_mit") {
      const vorhanden = ist.empfehlungen.map((e) => JSON.stringify(e));
      v.filter((e) => !vorhanden.includes(JSON.stringify(e))).forEach((e) => ab.push("Empfehlung fehlt: " + e.join(" ")));
    } else if (!gleich(ist[k], v)) ab.push(k + ": ist " + JSON.stringify(ist[k]) + " / soll " + JSON.stringify(v));
  }
  if (ab.length) abweichungenEinzel++;
  console.log(p.nr + ": " + p.text + ": " + (ab.length ? "ABWEICHUNG" : "stimmt"));
  ab.forEach((z) => console.log("   " + z));
}
console.log("Abweichungen in den Einzelprüfungen: " + abweichungenEinzel);

// ---------------------------------------------------------------- 3. Codes in regeln.js und inhalte.js
// regeln.js legt fest, welche Antworten zulässig sind, inhalte.js gibt ihnen den Wortlaut.
// Beide Dateien müssen dieselben Codes verwenden, und zu jedem Namen, den regeln.js
// ausgeben kann, muss inhalte.js einen Text enthalten.
const fehlerCodes = [];
const pruefe = (bedingung, text) => { if (!bedingung) fehlerCodes.push(text); };
const sortiert = (liste) => liste.map(String).sort();

pruefe(gleich(Object.keys(I.FRAGEN), Object.keys(R.ANTWORTEN)), "Fragen in inhalte.js und regeln.js unterscheiden sich");
for (const [f, vorgabe] of Object.entries(R.ANTWORTEN)) {
  const frage = I.FRAGEN[f];
  if (!frage) continue;
  pruefe(frage.typ === vorgabe.typ, f + ": Antwortformat unterscheidet sich");
  pruefe(gleich(frage.optionen.map((o) => o.wert), vorgabe.werte), f + ": Codes der Antwortoptionen unterscheiden sich");
  if (vorgabe.typ === "mehrfach") pruefe(typeof frage.keine === "string", f + ": Wortlaut der Option „Keine“ fehlt");
}
pruefe(gleich(sortiert(I.BLOECKE.flatMap((b) => b.fragen)), sortiert(Object.keys(R.ANTWORTEN))), "Blöcke enthalten nicht genau die 30 Fragen");
pruefe(gleich(sortiert(Object.keys(I.EINORDNUNG)), sortiert(Object.values(R.EINORDNUNG).filter((e) => e !== R.EINORDNUNG.ABSCHLUSS))), "Einordnungen unterscheiden sich");
pruefe(gleich(sortiert(Object.keys(I.ZUSTAENDE)), sortiert(Object.values(R.ZUSTAND))), "Zustände der Schutzmaßnahmen unterscheiden sich");
pruefe(gleich(sortiert(Object.keys(I.STUFEN)), ["1", "2", "3", "4"]), "Reaktionsstufen unterscheiden sich");
for (const p of R.PFADE) pruefe(I.PFADE[p] && I.BEREICHE[p], "Bezeichnung des Pfads " + p + " fehlt");
for (const f of R.FELDER) pruefe(I.REGELNAMEN[f], "Bezeichnung des Risikofelds " + f + " fehlt");

// Zu jedem Treffer und jeder Empfehlung, die in den Testdaten vorkommen, gibt es einen Text.
const alleEingaben = Object.values(faelle).map((f) => f.antworten).concat(einzel.map((p) => p.antworten));
for (const antworten of alleEingaben) {
  const e = R.auswerten(antworten);
  if (e.abschluss) continue;
  for (const t of e.treffer) {
    pruefe(I.REGELNAMEN[t.kennung], "Bezeichnung der Regel " + t.kennung + " fehlt");
    [t.hinweis].concat(t.zusaetze.map((z) => z.hinweis)).forEach((h) => pruefe(I.HINWEISE[h], "Hinweistext fehlt: " + h));
  }
  for (const m of e.empfehlungen) {
    pruefe(I.MASSNAHMEN[m.kennung], "Bezeichnung zu " + m.kennung + " fehlt");
    // Anlass der Empfehlung („Warum diese Empfehlung?“): Text und auslösende Sachverhalte
    pruefe(typeof I.EMPFEHLUNG_GRUND[m.anlass.grund] === "string", "Text zum Anlass fehlt: " + m.kennung + " " + m.anlass.grund);
    m.anlass.sachverhalte.forEach((k) => pruefe(typeof I.SACHVERHALT_KURZ[k] === "string", "Kurztext zum Sachverhalt fehlt: " + k));
    [m.kennung].concat(m.zusaetze).forEach((name) => {
      const texte = I.EMPFEHLUNGEN[name] || {};
      const text = m.zustand === null ? texte.text : m.zustand === R.ZUSTAND.VORHANDEN ? texte.vorhanden : texte.fehlt;
      pruefe(typeof text === "string", "Empfehlungstext fehlt: " + name + " (" + m.zustand + ")");
    });
  }
}
// F3: Selbst eingerichteter Zugang und Nutzung ohne Anmeldung lösen E7 aus, jeweils mit eigenem Anlass und Etikett.
for (const [wert, grund] of [["privat", "privat"], ["ohne Anmeldung", "ohneAnmeldung"]]) {
  const e7 = R.auswerten(Object.assign({}, faelle.T2.antworten, { F3: wert })).empfehlungen.filter((m) => m.kennung === "E7");
  pruefe(e7.length === 1 && e7[0].anlass.grund === grund, "E7 bei F3 " + wert + " fehlt oder hat einen falschen Anlass");
  pruefe(typeof I.EMPFEHLUNG_GRUND[grund] === "string" && typeof I.ANLASS_MARKE[grund] === "string", "Texte zu E7 bei F3 " + wert + " fehlen");
}
pruefe(!R.auswerten(Object.assign({}, faelle.T2.antworten, { F3: "Unternehmen" })).empfehlungen.some((m) => m.kennung === "E7"), "E7 bei F3 Unternehmen");
// Normverweise: Jede Normangabe in Hinweisen und Empfehlungen ist verlinkt, und jeder Verweis kommt vor.
const ergebnisTexte = Object.values(I.HINWEISE).concat(Object.values(I.EMPFEHLUNGEN).flatMap((t) => Object.values(t)), I.FEST.abschlussGrund.map((g) => g.text));
for (const text of ergebnisTexte) {
  for (const norm of text.match(/Art\. \d+[^()]*?(KI-VO|DSGVO)/g) || []) pruefe(I.NORMVERWEISE[norm], "Normangabe ohne Verweis: " + norm);
}
for (const [norm, ziel] of Object.entries(I.NORMVERWEISE)) {
  pruefe(ergebnisTexte.some((t) => t.includes(norm)), "Verweis wird nicht verwendet: " + norm);
  pruefe(/^https:\/\/eur-lex\.europa\.eu\//.test(ziel.adresse) && typeof ziel.hinweis === "string", "Verweis unvollständig: " + norm);
}
fehlerCodes.forEach((z) => console.log("   " + z));
console.log("Abweichungen zwischen regeln.js und inhalte.js: " + fehlerCodes.length);

// ---------------------------------------------------------------- 4. Ungültige Eingaben
// auswerten() muss jede Eingabe zurückweisen, die über die Oberfläche nicht entstehen kann.
const T2 = faelle.T2.antworten;
const UNGUELTIG = [
  ["unbekannter Wert einer Einfachauswahl", { F18: "INVALID" }],
  ["Wert einer anderen Frage", { F20: "intern" }],
  ["Zahl statt Text", { F2: 1 }],
  ["leere Mehrfachauswahl", { F6: [] }],
  ["unbekannter Sachverhalt in einer Mehrfachauswahl", { F6: [9] }],
  ["doppelter Sachverhalt in einer Mehrfachauswahl", { F5: [1, 1] }],
  ["„Keine“ zusammen mit einer Auswahl", { F5: ["Keine", 1] }],
  ["Text statt Liste in einer Mehrfachauswahl", { F29: "Stelle" }],
  ["unbekannte Frage", { F31: "Ja" }],
  ["fehlende Pflichtfrage", { F24: undefined }],
  ["Antwort auf eine nicht gestellte Frage", { F8: "Ja" }],
];
let nichtAbgewiesen = 0;
for (const [text, aenderung] of UNGUELTIG) {
  let abgewiesen = false;
  try { R.auswerten(Object.assign({}, T2, aenderung)); } catch { abgewiesen = true; }
  if (!abgewiesen) { nichtAbgewiesen++; console.log("   nicht zurückgewiesen: " + text); }
}
console.log("Ungültige Eingaben, die nicht zurückgewiesen wurden: " + nichtAbgewiesen + " von " + UNGUELTIG.length);

process.exit(abweichungen || abweichungenEinzel || fehlerCodes.length || nichtAbgewiesen ? 1 : 0);
