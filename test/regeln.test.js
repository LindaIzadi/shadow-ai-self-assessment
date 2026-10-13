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
    m.anlass.sachverhalte.forEach((k) => {
      const t = e.treffer.find((x) => x.kennung === k);
      pruefe(t && I.sachverhaltSaetze(k, t.fragen, antworten).length > 0, "Kurztext zum Sachverhalt fehlt: " + k);
    });
    [m.kennung].concat(m.zusaetze).forEach((name) => {
      const texte = I.EMPFEHLUNGEN[name] || {};
      const text = m.zustand === null ? texte[m.anlass.fassung] || texte[m.anlass.grund] || texte.text : m.zustand === R.ZUSTAND.VORHANDEN ? texte.vorhanden : (m.zustand === R.ZUSTAND.UNKLAR && texte.unklar) || texte.fehlt;
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
// D1: Der Hinweis richtet sich nach F14 (Ja, Nein oder Unklar, nicht gestellt).
const hinweisD1 = (antworten) => R.auswerten(antworten).treffer.find((t) => t.kennung === "D1").hinweis;
pruefe(hinweisD1(faelle.T13.antworten) === "D1 bei F14 Ja", "D1-Hinweis bei F14 Ja");
pruefe(hinweisD1(faelle.T4.antworten) === "D1 bei F14 Nein oder Unklar", "D1-Hinweis bei F14 Nein");
pruefe(hinweisD1(Object.assign({}, faelle.T4.antworten, { F14: "Unklar" })) === "D1 bei F14 Nein oder Unklar", "D1-Hinweis bei F14 Unklar");
pruefe(hinweisD1(Object.assign({}, faelle.T4.antworten, { F12: "Unklar", F14: undefined })) === "D1 bei F12 Unklar", "D1-Hinweis bei F12 Unklar");
pruefe(hinweisD1(Object.assign({}, faelle.T4.antworten, { F12: "Unklar", F13: "Ja", F14: "Ja" })) === "D1 bei F12 Unklar", "D1-Hinweis bei F12 Unklar trotz F14 Ja");
// Jede Kombination von F12, F13 und F14 führt im D-Pfad zu Hinweisen, die es in inhalte.js gibt.
for (const f12 of ["Ja", "Unklar"]) for (const f13 of ["Ja", "Nein", "Unklar"]) for (const f14 of ["Ja", "Nein", "Unklar", undefined]) {
  if ((f14 !== undefined) !== (f12 === "Ja" || f13 === "Ja")) continue;
  const d = R.dPfad({ F12: f12, F13: f13, F14: f14, F15: "Nein", F16: "Nein", F17: "Keine" });
  d.treffer.forEach((t) => pruefe(I.HINWEISE[t.hinweis], "Hinweistext fehlt: " + t.hinweis + " bei F12 " + f12 + ", F13 " + f13 + ", F14 " + f14));
}
// D3 bis D5: Bei „Unklar“ erscheint die eigene Fassung, bei „Nein“ oder „Keine“ kein Treffer, Stufe immer 3.
const dBasis = { F12: "Ja", F13: "Nein", F14: "Ja", F15: "Nein", F16: "Nein", F17: "Keine" };
for (const [k, frage, werte] of [["D3", "F15", ["Ja", "Nein", "Unklar"]], ["D4", "F16", ["Ja", "Nein", "Unklar"]], ["D5", "F17", ["Keine", "Unklar", [1], [2], [3], [1, 2, 3]]]]) {
  for (const wert of werte) {
    const t = R.dPfad(Object.assign({}, dBasis, { [frage]: wert })).treffer.find((x) => x.kennung === k);
    const name = k + " bei " + frage + " " + JSON.stringify(wert);
    if (wert === "Nein" || wert === "Keine") { pruefe(!t, name + " darf nicht greifen"); continue; }
    const erwartet = wert === "Unklar" ? k + " bei " + frage + " Unklar" : k;
    pruefe(t && t.stufe === 3 && t.hinweis === erwartet && I.HINWEISE[erwartet], name + ": Stufe oder Hinweis falsch");
  }
}
// W3: nur bei F12 „Ja“, Eingaben beim externen Anbieter (F23) und F15 „Nein“.
for (const f12 of ["Ja", "Unklar"]) for (const f23 of ["lokal", "extern ohne", "extern mit", "Unklar"]) for (const f15 of ["Ja", "Nein", "Unklar"]) {
  const w = R.auswerten(Object.assign({}, einzel.find((x) => x.nr === "P16").antworten, { F12: f12, F14: f12 === "Ja" ? "Nein" : undefined, F23: f23, F15: f15 })).widersprueche;
  const erwartet = f12 === "Ja" && f23 !== "lokal" && f23 !== "Unklar" && f15 === "Nein";
  pruefe(w.includes("W3") === erwartet, "W3 bei F12 " + f12 + ", F23 " + f23 + ", F15 " + f15);
}
pruefe(Object.keys(I.WIDERSPRUECHE).length === 4 && I.WIDERSPRUECHE.W3, "Text zu W3 fehlt");
// S1: eigener Hinweis bei F18 „Intern“ oder „Unklar“ nur bei sicher externer Verarbeitung (F23).
for (const f18 of ["oeffentlich", "intern", "vertraulich", "Unklar"]) for (const f23 of ["lokal", "extern ohne", "extern mit", "Unklar"]) {
  const t = R.sPfad(Object.assign({}, einzel.find((x) => x.nr === "P12").antworten, { F18: f18, F23: f23 })).treffer.find((x) => x.kennung === "S1");
  const extern = f23 === "extern ohne" || f23 === "extern mit";
  const erwartet = extern ? "S1 bei F18 " + f18 : "S1";
  if (t) pruefe(t.hinweis === erwartet && I.HINWEISE[erwartet], "S1-Hinweis bei F18 " + f18 + ", F23 " + f23 + ": " + t.hinweis);
  pruefe(!!t === (f23 !== "lokal" && f18 !== "oeffentlich"), "S1 greift falsch bei F18 " + f18 + ", F23 " + f23);
}
// K1: bei F23 „extern mit“ der Hinweis zur Angabe, bei F23 „Unklar“ die unklare Fassung.
for (const f23 of ["extern mit", "Unklar"]) {
  const t = R.sPfad(Object.assign({}, einzel.find((x) => x.nr === "P12").antworten, { F18: "vertraulich", F23: f23 })).treffer.find((x) => x.kennung === "K1");
  const erwartet = f23 === "Unklar" ? "K1 bei F23 Unklar" : "K1";
  pruefe(t && t.stufe === 4 && t.hinweis === erwartet && I.HINWEISE[erwartet], "K1 bei F23 " + f23);
}
// S2: Sobald F19, F20 oder F21 „Unklar“ ist, erscheint die Fassung zum angenommenen Sachverhalt.
const sOpt = { F19: ["Information", "Vorschlag", "massgeblich", "automatisch", "Unklar"], F20: ["gering", "spuerbar", "erheblich", "Unklar"], F21: ["immer", "teilweise", "nie", "Unklar"] };
for (const f19 of sOpt.F19) for (const f20 of sOpt.F20) for (const f21 of sOpt.F21) {
  const t = R.sPfad(Object.assign({}, einzel.find((x) => x.nr === "P12").antworten, { F19: f19, F20: f20, F21: f21 })).treffer.find((x) => x.kennung === "S2");
  if (!t) continue;
  const erwartet = [f19, f20, f21].includes("Unklar") ? "S2 bei Unklar" : "S2";
  pruefe(t.hinweis === erwartet && I.HINWEISE[erwartet], "S2-Hinweis bei " + [f19, f20, f21].join(", "));
}
// S3: Jede Kombination aus F4 und F22 mit Treffer hat einen eigenen Hinweis, die Stufen bleiben.
const s3Stufe = { freigegeben: [1, 2, 2, 2], "in Pruefung": [1, 2, 2, 2], "bekannt, nicht freigegeben": [2, 2, 3, 2], abgelehnt: [2, 2, 3, 2], "nicht bekannt": [3, 3, 3, 3], Unklar: [2, 2, 3, 2] };
for (const [f4, stufen] of Object.entries(s3Stufe)) ["ja", "teilweise", "nein", "Unklar"].forEach((f22, i) => {
  const s = R.sPfad(Object.assign({}, einzel.find((x) => x.nr === "P12").antworten, { F4: f4, F22: f22 }));
  const t = s.treffer.find((x) => x.kennung === "S3");
  pruefe(s.felder.S3 === stufen[i], "S3-Stufe bei F4 " + f4 + ", F22 " + f22);
  if (stufen[i] === 1) pruefe(!t, "S3 darf bei F4 " + f4 + ", F22 " + f22 + " nicht greifen");
  else pruefe(t && I.HINWEISE[t.hinweis], "S3-Hinweis fehlt bei F4 " + f4 + ", F22 " + f22);
});
// S4: Jede Kombination aus F23 und F24 mit Treffer hat einen eigenen Hinweis, die Stufen bleiben.
const s4Stufe = { lokal: [1, 1, 1, 1], "extern ohne": [1, 1, 2, 1], "extern mit": [2, 3, 3, 3], Unklar: [2, 3, 3, 3] };
for (const [f23, stufen] of Object.entries(s4Stufe)) ["manuell", "Erweiterung", "automatisiert", "Unklar"].forEach((f24, i) => {
  const s = R.sPfad(Object.assign({}, einzel.find((x) => x.nr === "P12").antworten, { F23: f23, F24: f24 }));
  const t = s.treffer.find((x) => x.kennung === "S4");
  pruefe(s.felder.S4 === stufen[i], "S4-Stufe bei F23 " + f23 + ", F24 " + f24);
  if (stufen[i] === 1) pruefe(!t, "S4 darf bei F23 " + f23 + ", F24 " + f24 + " nicht greifen");
  else pruefe(t && I.HINWEISE[t.hinweis], "S4-Hinweis fehlt bei F23 " + f23 + ", F24 " + f24);
});
// E1: Begründung je Anlass (Freigabe offen oder abgelehnt, Weitergabe S1/S4) und F25.
// Bei F25 „Nein“ unterstellt sie keine Richtlinie, bei „Abgelehnt“ keine ausstehende Freigabe.
for (const f4 of ["bekannt, nicht freigegeben", "abgelehnt", "freigegeben"]) for (const f23 of ["lokal", "extern mit"]) for (const f25 of ["Ja", "Nein", "Unklar"]) {
  const e = R.auswerten(Object.assign({}, einzel.find((x) => x.nr === "P12").antworten, { F4: f4, F23: f23, F25: f25 }));
  const e1 = e.empfehlungen.find((m) => m.kennung === "E1");
  const fall = "E1 bei F4 " + f4 + ", F23 " + f23 + ", F25 " + f25;
  if (!e1 || e1.anlass.grund !== "richtlinie") { pruefe(f4 === "freigegeben" && f23 === "lokal", fall + ": Anlass fehlt"); continue; }
  const text = I.begruendungE1(e1.anlass);
  pruefe(e1.anlass.freigabe === (f4 === "freigegeben" ? null : f4 === "abgelehnt" ? "abgelehnt" : "offen") && e1.anlass.abfluss === (f23 !== "lokal"), fall + ": Anlass falsch");
  pruefe(!/undefined/.test(text) && text.split("Bitte klären Sie").length <= 2, fall + ": " + text);
  pruefe(f25 !== "Nein" || !/KI-Richtlinie Ihres Unternehmens|solche Richtlinie/.test(text), fall + ": unterstellt eine Richtlinie");
  pruefe(f4 !== "abgelehnt" || !/noch nicht bestätigt/.test(text), fall + ": abgelehnt als ausstehend dargestellt");
}
// E2 bis E4: eigene Fassung für „Unklar“ in Titel und Text
for (const k of ["E2", "E3", "E4"]) pruefe(I.EMPFEHLUNGEN[k].unklar && I.EMPFEHLUNG_TITEL[k].unklar, "Unklar-Fassung fehlt: " + k);
// E5a: Fassung nach der Option „Stelle“ in F29 (angekreuzt, nicht angekreuzt, „Keine“, „Unklar“).
for (const [f29, stand] of [[["Stelle"], "vorhanden"], [["Stelle", "Verfahren"], "vorhanden"], [["Verfahren"], "fehlt"], ["Keine", "fehlt"], ["Unklar", "unklar"]]) {
  const e5a = R.auswerten(Object.assign({}, einzel.find((x) => x.nr === "P12").antworten, { F29: f29 })).empfehlungen.find((m) => m.kennung === "E5a");
  pruefe(e5a && e5a.zustand === stand && I.EMPFEHLUNGEN.E5a[stand] && I.EMPFEHLUNG_TITEL.E5a[stand], "E5a bei F29 " + JSON.stringify(f29));
}
// E5b: Fassung nach der Option „Verfahren“ in F29. Bei „abgelehnt“ steht E9 statt E5b.
for (const [f29, stand] of [[["Verfahren"], "vorhanden"], [["Stelle"], "fehlt"], ["Keine", "fehlt"], ["Unklar", "unklar"]]) {
  const e5b = R.auswerten(Object.assign({}, einzel.find((x) => x.nr === "P12").antworten, { F29: f29 })).empfehlungen.find((m) => m.kennung === "E5b");
  pruefe(e5b && e5b.zustand === stand && I.EMPFEHLUNGEN.E5b[stand] && I.EMPFEHLUNG_TITEL.E5b[stand], "E5b bei F29 " + JSON.stringify(f29));
}
const abgelehntE = R.auswerten(Object.assign({}, einzel.find((x) => x.nr === "P12").antworten, { F4: "abgelehnt" })).empfehlungen.map((m) => m.kennung);
pruefe(abgelehntE.includes("E9") && !abgelehntE.includes("E5b") && abgelehntE.includes("E6"), "abgelehnt: E9 und E6 statt E5b");
// E6: Fassung nach F30
for (const [f30, stand] of [["Ja", "vorhanden"], ["Nein", "fehlt"], ["Unklar", "unklar"]]) {
  const e6 = R.auswerten(Object.assign({}, einzel.find((x) => x.nr === "P12").antworten, { F30: f30 })).empfehlungen.find((m) => m.kennung === "E6");
  pruefe(e6 && e6.zustand === stand && I.EMPFEHLUNGEN.E6[stand] && I.EMPFEHLUNG_TITEL.E6[stand], "E6 bei F30 " + f30);
}
// E7: Titel und Text je Angabe in F3, ohne „Warum diese Empfehlung?“
for (const grund of ["privat", "ohneAnmeldung"]) pruefe(I.EMPFEHLUNGEN.E7[grund] && I.EMPFEHLUNG_TITEL.E7[grund], "E7-Fassung fehlt: " + grund);
pruefe(I.OHNE_BEGRUENDUNG.includes("E7"), "E7 ohne Begründung");
// E8: Text je Antwort auf F22. Bei F22 „Ja“ greift E8 nie (alle Kombinationen aus F4 und F22).
for (const f4 of ["freigegeben", "in Pruefung", "bekannt, nicht freigegeben", "abgelehnt", "nicht bekannt", "Unklar"]) for (const f22 of ["ja", "teilweise", "nein", "Unklar"]) {
  const e8 = R.auswerten(Object.assign({}, einzel.find((x) => x.nr === "P12").antworten, { F4: f4, F22: f22 })).empfehlungen.find((m) => m.kennung === "E8");
  if (f22 === "ja") pruefe(!e8, "E8 bei F22 ja und F4 " + f4);
  else if (e8) pruefe(e8.anlass.fassung === f22 && I.EMPFEHLUNGEN.E8[f22] && I.EMPFEHLUNG_TITEL.E8[f22], "E8-Fassung bei F22 " + f22);
}
pruefe(!I.EMPFEHLUNGEN.E8.ja && !I.EMPFEHLUNGEN.E8.text, "E8 ohne unerreichbare Fassung");
// R4-Zusatz Art. 27: nur bei passender Kombination aus F7 und F9 (Art. 27 Abs. 1 KI-VO).
const art27 = (f7, f9) => {
  const t = R.rPfad(Object.assign({}, einzel.find((x) => x.nr === "P1").antworten, { F7: f7, F9: f9 })).treffer.find((x) => x.kennung === "R4");
  return t.zusaetze.some((z) => z.name === "R4 Zusatz Art. 27");
};
for (const [f7, f9, soll] of [
  [[7], [3], true], [[7], [4], true], ["Unklar", [3], true], [[6], [3], false], [[6], [4], false],
  [[6], [1], true], [[6], [2], true], [[4], [1], false], [[4], [2], false], [[4, 6], [1], true], ["Unklar", [1], true],
  [[4], "Unklar", false], [[4, 6], "Unklar", true], [[6], "Unklar", true], ["Unklar", "Unklar", true], [[7], "Keine", false], [[4], [1, 3], false], [[4, 7], [3], true]
]) pruefe(art27(f7, f9) === soll, "Art.-27-Zusatz bei F7 " + JSON.stringify(f7) + ", F9 " + JSON.stringify(f9));
// R3: eigener Hinweis bei F7 „Unklar“, Stufe unverändert 3
for (const [f7, soll] of [[[6], "R3"], [[4, 7], "R3"], ["Unklar", "R3 bei F7 Unklar"]]) {
  const t = R.rPfad(Object.assign({}, einzel.find((x) => x.nr === "P1").antworten, { F7: f7 })).treffer.find((x) => x.kennung === "R3");
  pruefe(t && t.stufe === 3 && t.name === "R3" && t.hinweis === soll && I.HINWEISE[soll], "R3-Hinweis bei F7 " + JSON.stringify(f7));
}
// Gesamtergebnis bei ausdrücklich abgelehnter Nutzung: eigener Text bei Stufe 2 und 3, Stufe 4 regulär.
for (const stufe of [1, 2, 3, 4]) for (const f4 of ["freigegeben", "Unklar", "abgelehnt"]) {
  const text = I.gesamtBeschreibung(stufe, f4);
  const abweichend = f4 === "abgelehnt" && (stufe === 2 || stufe === 3);
  pruefe(abweichend ? /ausdrücklich abgelehnt/.test(text) : text === I.STUFEN[stufe].gesamt, "Gesamttext bei Stufe " + stufe + ", F4 " + f4);
}
// R1: eigener Hinweis bei F5 „Unklar“
for (const [f5, soll] of [[[1], "R1"], [[2, 3], "R1"], ["Unklar", "R1 bei F5 Unklar"]]) {
  const t = R.rPfad(Object.assign({}, einzel.find((x) => x.nr === "P1").antworten, { F5: f5 })).treffer.find((x) => x.kennung === "R1");
  pruefe(t && t.stufe === 3 && t.hinweis === soll && I.HINWEISE[soll], "R1-Hinweis bei F5 " + JSON.stringify(f5));
}
// E3 und E7 entfallen bei F4 „abgelehnt“, E9 erscheint. Gegenprobe mit „freigegeben“.
for (const [f4, mitE37] of [["abgelehnt", false], ["freigegeben", true], ["Unklar", true]]) {
  const e = R.auswerten(Object.assign({}, einzel.find((x) => x.nr === "P12").antworten, { F4: f4, F3: "privat", F23: "extern mit", F27: "Nein" }));
  const k = e.empfehlungen.map((m) => m.kennung);
  pruefe(k.includes("E3") === mitE37 && k.includes("E7") === mitE37 && k.includes("E9") === (f4 === "abgelehnt"), "E3/E7/E9 bei F4 " + f4 + ": " + k);
}
// E1-Begründung bei F25 „Nein“: Angabe statt erneuter Aufforderung
pruefe(I.begruendungE1({ richtlinie: "fehlt", freigabe: "offen", abfluss: true }).endsWith("Nach Ihren Angaben ist Ihnen keine KI-Richtlinie oder Nutzungsregel bekannt, die diese Nutzung abdeckt.") &&
  !/Bitte klären/.test(I.begruendungE1({ richtlinie: "fehlt", freigabe: "abgelehnt", abfluss: false })), "E1-Begründung bei F25 Nein");
// Kurztexte der Regeln R1 bis R5 und D1 bis D5: je eine Fassung für eine Angabe und für „Unklar“.
for (const k of ["R1", "R2", "R3", "R4", "R5", "D1", "D2", "D3", "D4", "D5"]) {
  const kurz = I.SACHVERHALT_KURZ[k] || {};
  pruefe(typeof kurz.ja === "string" && typeof kurz.unklar === "string", "Kurztexte zu " + k + " unvollständig");
}
// Risikofelder: In jeder Kombination des S-Pfads hat jeder Treffer mindestens einen Satz, und jede
// ungünstige Antwort einer Frage des S-Pfads hat einen Satz, die günstigste keinen.
const S_FRAGEN = ["F4", "F18", "F19", "F20", "F21", "F22", "F23", "F24"];
const GUENSTIG = { F4: ["freigegeben", "in Pruefung"], F18: ["oeffentlich"], F19: ["Information", "Vorschlag"], F20: ["gering"], F21: ["immer"], F22: ["ja"], F23: ["lokal"], F24: ["manuell"] };
for (const f of S_FRAGEN) {
  for (const w of R.ANTWORTEN[f].werte) {
    const satz = (I.ANGABE_KURZ[f] || {})[w];
    pruefe(GUENSTIG[f].includes(w) ? satz === undefined : typeof satz === "string", "Kurztext zu " + f + " " + w);
  }
}
let sKombinationen = 0;
(function durchlaufe(i, a) {
  if (i === S_FRAGEN.length) {
    sKombinationen++;
    for (const t of R.sPfad(a).treffer) pruefe(I.sachverhaltSaetze(t.kennung, t.fragen, a).length > 0, "Kein Kurztext zu " + t.kennung + " bei " + JSON.stringify(a));
    return;
  }
  for (const w of R.ANTWORTEN[S_FRAGEN[i]].werte) durchlaufe(i + 1, Object.assign({}, a, { [S_FRAGEN[i]]: w }));
})(0, {});
pruefe(sKombinationen === S_FRAGEN.reduce((n, f) => n * R.ANTWORTEN[f].werte.length, 1), "S-Pfad nicht vollständig durchlaufen: " + sKombinationen);
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
