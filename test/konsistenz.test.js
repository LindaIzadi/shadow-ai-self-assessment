/*
 * Konsistenzprüfung der Regelbasis (Abschnitt 4.3.3, Anhang D)
 *
 * Geprüft wird unmittelbar die Regelbasis des Prototyps (js/regeln.js), nicht eine
 * Nachbildung. Weil alle Fragen feste Antwortoptionen haben, ist die Zahl der
 * Antwortkombinationen endlich. Das Skript führt alle Kombinationen jedes
 * Bewertungspfads hindurch und prüft drei Eigenschaften:
 *
 *   Vollständigkeit       Jede Kombination führt zu einer Reaktionsstufe von 1 bis 4, ohne
 *                         dass eine Regel fehlt oder die Auswertung abbricht.
 *   Widerspruchsfreiheit  Das Ergebnis ist eindeutig: Jede Regel greift je Kombination
 *                         höchstens einmal und damit mit genau einer Stufe (etwa R2 nie
 *                         zugleich mit „Eskalation“ und „Prüfbedarf“), die Stufe des Pfads
 *                         ist genau die höchste Stufe der greifenden Regeln, und im S-Pfad
 *                         stimmt jede Feldstufe mit der Stufe ihrer Regel überein.
 *                         Zusätzlich liefert dieselbe Kombination stets dasselbe Ergebnis.
 *   Monotonie             Eine ungünstigere Antwort führt bei sonst gleichen Angaben nie zu
 *                         einer niedrigeren Stufe (Duijm 2015, S. 22, 24).
 *
 * Dazu kommen zwei Prüfungen für die Antwort „Unklar“ im S-Pfad (Abschnitt 5.3.3).
 *
 * Zum Umfang: Die drei Pfade werden über alle ihre Kombinationen einzeln durchlaufen. Die Zahl
 * der Kombinationen aller drei Pfade zusammen wird aus diesen Verteilungen berechnet und nicht
 * einzeln durch auswerten() geführt. Das ist zulässig, weil jeder Pfad nur seine eigenen Fragen
 * auswertet und das Gesamtergebnis die höchste der drei Stufen ist. Beides prüft eine
 * Stichprobe vollständiger Assessments über auswerten().
 *
 * Mehrfachauswahlen wirken in den Regeln nur über drei Klassen: „Keine“, „Unklar“ oder
 * mindestens eine Auswahl. Einzelne Auswahlen werden nur dort unterschieden, wo eine Regel
 * sie einzeln nennt (F6 Nr. 8, F7 Nr. 2 und 3). Schritt 2 belegt diese Zusammenfassung,
 * indem er für jede Mehrfachauswahl alle zulässigen Teilmengen durchläuft.
 *
 * Aufruf im Projektordner:  node test/konsistenz.test.js
 */
const path = require("path");
const R = require(path.join(__dirname, "..", "js", "regeln.js"));

const fehler = [];
const zaehle = (liste) => liste.reduce((z, x) => { z[x] = (z[x] || 0) + 1; return z; }, {});
const kreuz = (...listen) => listen.reduce((acc, l) => acc.flatMap((a) => l.map((x) => a.concat([x]))), [[]]);
const JNU = ["Nein", "Unklar", "Ja"];             // aufsteigend ungünstiger
const RANG_JNU = { Nein: 0, Unklar: 1, Ja: 2 };
const RANG_KLASSE = { Keine: 0, Unklar: 1, Auswahl: 2 };

/** Alle zulässigen Antworten einer Mehrfachauswahl: Keine, Unklar und jede nicht leere Teilmenge. */
function alleTeilmengen(werte) {
  const liste = [];
  for (let maske = 1; maske < (1 << werte.length); maske++) {
    liste.push(werte.filter((_, i) => maske & (1 << i)));
  }
  return liste;
}
const klasse = (antwort) => (antwort === "Keine" || antwort === "Unklar" ? antwort : "Auswahl");

/** Prüft Vollständigkeit und Widerspruchsfreiheit eines Pfads für eine Kombination. */
function stufeVon(funktion, antworten, pfad) {
  let e, wiederholt;
  try {
    e = funktion(antworten);
    wiederholt = funktion(antworten);
  } catch (x) {
    fehler.push(pfad + " unvollständig: " + x.message + " bei " + JSON.stringify(antworten));
    return null;
  }
  const bei = " bei " + JSON.stringify(antworten);
  if (![1, 2, 3, 4].includes(e.stufe)) fehler.push(pfad + " unvollständig: Stufe " + e.stufe + bei);
  // Jede Regel greift höchstens einmal, also mit genau einer Stufe.
  const kennungen = e.treffer.map((t) => t.kennung);
  kennungen.forEach((k, i) => { if (kennungen.indexOf(k) !== i) fehler.push(pfad + " widersprüchlich: " + k + " greift mehrfach" + bei); });
  // Die Stufe des Pfads ergibt sich eindeutig aus den greifenden Regeln.
  const hoechste = Math.max(1, ...e.treffer.map((t) => t.stufe));
  if (e.stufe !== hoechste) fehler.push(pfad + " widersprüchlich: Stufe " + e.stufe + ", höchste Regelstufe " + hoechste + bei);
  // S-Pfad: Jede Feldstufe ab „Handlungsbedarf“ hat genau eine Regel mit derselben Stufe.
  if (e.felder) {
    R.FELDER.forEach((f) => {
      const t = e.treffer.find((x) => x.kennung === f);
      if ((e.felder[f] >= 2) !== Boolean(t) || (t && t.stufe !== e.felder[f])) fehler.push(pfad + " widersprüchlich: Feld " + f + bei);
    });
  }
  if (JSON.stringify(e) !== JSON.stringify(wiederholt)) fehler.push(pfad + " nicht wiederholbar" + bei);
  return e.stufe;
}

// ================================================================ 1. Einordnung als Shadow AI
console.log("== Einordnung als Shadow AI (Tabelle 14) ==");
const F2 = R.ANTWORTEN.F2.werte, F4 = R.ANTWORTEN.F4.werte;
const einordnungen = kreuz(F2, F4).map(([f2, f4]) => R.einordnung(f2, f4));
einordnungen.forEach((e) => { if (!Object.values(R.EINORDNUNG).includes(e)) fehler.push("Einordnung unvollständig: " + e); });
console.log("  Kombinationen:", einordnungen.length, zaehle(einordnungen));

// ================================================================ 2. Mehrfachauswahlen
// Für jede Mehrfachauswahl werden alle Teilmengen durchlaufen. Die Stufe muss dieselbe sein
// wie bei der Vertreterin ihrer Klasse. Die übrigen Angaben stehen dabei auf jeder
// Kombination der Klassen der anderen Fragen des Pfads.
console.log("== Mehrfachauswahlen ==");
const VERTRETER = {
  F5: [[1]], F9: [[1]], F17: [[1]],
  F6: [[1], [8]],                     // Nr. 8: späterer Geltungsbeginn (Zusatz zu R2)
  F7: [[1], [2], [3]]                 // Nr. 2 und 3: zusätzlich R5
};
const KLASSEN = ["Keine", "Unklar"];
const wahl = (f) => KLASSEN.concat(VERTRETER[f]);

/** Alle Kombinationen des R-Pfads über die Klassen und Vertreter der Mehrfachauswahlen. */
function rKombinationen() {
  const liste = [];
  for (const [f5, f6, f7, f10, f11] of kreuz(wahl("F5"), wahl("F6"), wahl("F7"), JNU, JNU)) {
    const folge = f7 === "Keine" ? [[undefined, undefined]] : kreuz(JNU, wahl("F9"));
    for (const [f8, f9] of folge) liste.push({ F5: f5, F6: f6, F7: f7, F8: f8, F9: f9, F10: f10, F11: f11 });
  }
  return liste;
}
/** Alle Kombinationen des D-Pfads (F13 bis F17 erscheinen nur bei Personenbezug, F14 nur bei F13 „Ja“). */
function dKombinationen() {
  const liste = [{ F12: "Nein" }];
  for (const f12 of ["Unklar", "Ja"]) {
    for (const f13 of JNU) {
      for (const f14 of f13 === "Ja" ? JNU : [undefined]) {
        for (const [f15, f16, f17] of kreuz(JNU, JNU, wahl("F17"))) {
          liste.push({ F12: f12, F13: f13, F14: f14, F15: f15, F16: f16, F17: f17 });
        }
      }
    }
  }
  return liste;
}

/** Vertreterin, deren Stufe eine Teilmenge haben muss: die mit Zusatzregel, sonst die erste. */
function vertreterFuer(frage, teilmenge) {
  const besondere = VERTRETER[frage].slice(1).find((v) => v.some((x) => teilmenge.includes(x)));
  return besondere || VERTRETER[frage][0];
}
let teilmengenGeprueft = 0;
function pruefeTeilmengen(frage, kombinationen, funktion, pfad) {
  const teilmengen = alleTeilmengen(R.ANTWORTEN[frage].werte);
  for (const k of kombinationen) {
    if (k[frage] !== VERTRETER[frage][0]) continue;
    for (const t of teilmengen) {
      const soll = funktion(Object.assign({}, k, { [frage]: vertreterFuer(frage, t) })).stufe;
      const ist = funktion(Object.assign({}, k, { [frage]: t })).stufe;
      teilmengenGeprueft++;
      if (ist !== soll) fehler.push(pfad + ": Teilmenge " + JSON.stringify(t) + " bei " + frage + " weicht von ihrer Vertreterin ab");
    }
  }
}
const rk = rKombinationen(), dk = dKombinationen();
for (const f of ["F5", "F6", "F7", "F9"]) pruefeTeilmengen(f, rk, R.rPfad, "R-Pfad");
pruefeTeilmengen("F17", dk, R.dPfad, "D-Pfad");
for (const f of ["F5", "F6", "F7", "F9", "F17"]) {
  console.log("  " + f + ": " + (alleTeilmengen(R.ANTWORTEN[f].werte).length + 2) + " zulässige Antworten");
}
console.log("  Teilmengen gegen ihre Klasse geprüft:", teilmengenGeprueft);

// ================================================================ 3. R-Pfad
// Gezählt wird wie in Anhang D über die Klassen der Mehrfachauswahlen. Bei F6 und F7 gehen
// die Vertreter einzeln in die Monotonie ein, für die Zählung werden sie zur Klasse
// „Auswahl“ zusammengefasst.
console.log("== R-Pfad (Tabelle 15) ==");
const rStufe = new Map();
for (const k of rk) rStufe.set(k, stufeVon(R.rPfad, k, "R-Pfad"));
const rKlassen = new Map();
for (const k of rk) {
  const schluessel = [k.F5, k.F6, k.F7, k.F8, k.F9, k.F10, k.F11]
    .map((x) => (x === undefined ? "-" : Array.isArray(x) ? "Auswahl" : x)).join("|");
  rKlassen.set(schluessel, rStufe.get(k));
}
console.log("  Kombinationen:", rKlassen.size, "Stufen:", zaehle([...rKlassen.values()]));

/** Rang einer Antwort für die Monotonie. Bei F7 ist eine Auswahl mit Zusatzregel (R5) ungünstiger. */
function rangR(frage, wert) {
  if (wert === undefined) return -1;
  if (frage === "F8" || frage === "F10" || frage === "F11") return RANG_JNU[wert];
  if (klasse(wert) !== "Auswahl") return RANG_KLASSE[wert];
  return frage === "F7" && wert !== VERTRETER.F7[0] ? 3 : 2;
}
let rPaare = 0;
const R_FRAGEN = ["F5", "F6", "F7", "F8", "F9", "F10", "F11"];
for (const x of rk) {
  for (const y of rk) {
    const unterschiede = R_FRAGEN.filter((f) => JSON.stringify(x[f]) !== JSON.stringify(y[f]));
    if (unterschiede.length === 0) continue;
    let dominiert = false;
    if (unterschiede.length === 1) {
      const f = unterschiede[0];
      dominiert = rangR(f, y[f]) > rangR(f, x[f]);
    } else if (x.F7 === "Keine" && y.F7 !== "Keine" && unterschiede.every((f) => ["F7", "F8", "F9"].includes(f))) {
      dominiert = true;   // F7 „Keine“ zu einer anderen Antwort: F8 und F9 kommen hinzu
    }
    if (!dominiert) continue;
    rPaare++;
    if (rStufe.get(y) < rStufe.get(x)) fehler.push("R-Pfad nicht monoton: " + JSON.stringify(x) + " -> " + JSON.stringify(y));
  }
}
console.log("  Monotonie: geprüfte Paare", rPaare);

// ================================================================ 4. D-Pfad
console.log("== D-Pfad (Tabelle 16) ==");
const dStufe = new Map();
for (const k of dk) dStufe.set(k, stufeVon(R.dPfad, k, "D-Pfad"));
console.log("  Kombinationen:", dk.length, "Stufen:", zaehle([...dStufe.values()]));

// F14 ist die einzige Frage, bei der „Ja“ die günstige Antwort ist (Prüfung und Freigabe liegen vor).
const RANG_F14 = { Ja: 0, Unklar: 1, Nein: 1 };
function rangD(frage, wert) {
  if (wert === undefined) return -1;
  if (frage === "F14") return RANG_F14[wert];
  if (frage === "F17") return RANG_KLASSE[klasse(wert)];
  return RANG_JNU[wert];
}
const D_FRAGEN = ["F12", "F13", "F14", "F15", "F16", "F17"];
let dPaare = 0;
for (const x of dk) {
  for (const y of dk) {
    let dominiert;
    if (x.F12 === "Nein") {
      dominiert = y.F12 !== "Nein";
    } else {
      const u = D_FRAGEN.filter((f) => JSON.stringify(x[f]) !== JSON.stringify(y[f]));
      if (u.length === 1) dominiert = rangD(u[0], y[u[0]]) > rangD(u[0], x[u[0]]);
      else dominiert = u.length === 2 && u[0] === "F13" && u[1] === "F14" && rangD("F13", y.F13) > rangD("F13", x.F13);
    }
    if (!dominiert) continue;
    dPaare++;
    if (dStufe.get(y) < dStufe.get(x)) fehler.push("D-Pfad nicht monoton: " + JSON.stringify(x) + " -> " + JSON.stringify(y));
  }
}
console.log("  Monotonie: geprüfte Paare", dPaare);

// ================================================================ 5. S-Pfad
// Die Antwortoptionen sind von der günstigsten zur ungünstigsten geordnet (Tabelle 17).
console.log("== S-Pfad (Tabelle 17) ==");
const S_FRAGEN = ["F4", "F18", "F19", "F20", "F21", "F22", "F23", "F24"];
const ordnung = (f) => R.ANTWORTEN[f].werte.filter((w) => w !== "Unklar");
const sOptionen = S_FRAGEN.map((f) => ordnung(f).concat(["Unklar"]));
const sStufe = new Map(), felderZahl = {}, kombiZahl = {};
const sk = kreuz(...sOptionen);
const schluessel = (k) => k.join("|");
for (const k of sk) {
  const a = {};
  S_FRAGEN.forEach((f, i) => { a[f] = k[i]; });
  const st = stufeVon(R.sPfad, a, "S-Pfad");
  sStufe.set(schluessel(k), st);
  const e = R.sPfad(a);
  R.FELDER.forEach((f) => { const z = f + ":" + e.felder[f]; felderZahl[z] = (felderZahl[z] || 0) + 1; });
  e.treffer.filter((t) => t.kennung[0] === "K").forEach((t) => { kombiZahl[t.kennung] = (kombiZahl[t.kennung] || 0) + 1; });
}
console.log("  Kombinationen:", sk.length, "Stufen:", zaehle([...sStufe.values()]));
console.log("  Kombinationsregeln ausgelöst:", kombiZahl);
console.log("  Feldstufen (1/2/3):", Object.fromEntries(R.FELDER.map((f) => [f, [1, 2, 3].map((s) => felderZahl[f + ":" + s] || 0)])));

let sPaare = 0;
const wirkung = {};
for (const k of sk) {
  const s = sStufe.get(schluessel(k));
  S_FRAGEN.forEach((f, i) => {
    const o = ordnung(f);
    if (k[i] === "Unklar") {
      // „Unklar“ liegt nie unter der günstigsten und nie über der ungünstigsten Antwort.
      const guenstig = sStufe.get(schluessel(k.slice(0, i).concat([o[0]], k.slice(i + 1))));
      const unguenstig = sStufe.get(schluessel(k.slice(0, i).concat([o[o.length - 1]], k.slice(i + 1))));
      sPaare += 2;
      if (s < guenstig) fehler.push("S-Pfad: „Unklar“ günstiger als die günstigste Antwort bei " + f + ": " + k);
      if (s > unguenstig) fehler.push("S-Pfad: „Unklar“ ungünstiger als die ungünstigste Antwort bei " + f + ": " + k);
      if (s > guenstig) wirkung[f] = (wirkung[f] || 0) + 1;
    } else {
      const j = o.indexOf(k[i]);
      if (j + 1 < o.length) {
        sPaare++;
        const y = sStufe.get(schluessel(k.slice(0, i).concat([o[j + 1]], k.slice(i + 1))));
        if (y < s) fehler.push("S-Pfad nicht monoton bei " + f + ": " + k);
      }
    }
  });
}
console.log("  Monotonie: geprüfte Paare", sPaare);
S_FRAGEN.forEach((f) => console.log("  " + f + ": „Unklar“ führt in " + (wirkung[f] || 0) + " Kombinationen zu einer höheren Stufe als die günstigste Antwort"));

// ================================================================ 6. Gesamtergebnis
console.log("== Gesamtergebnis ==");
const cr = zaehle([...rKlassen.values()]), cd = zaehle([...dStufe.values()]), cs = zaehle([...sStufe.values()]);
const ges = {};
for (const [a, na] of Object.entries(cr)) for (const [b, nb] of Object.entries(cd)) for (const [c, nc] of Object.entries(cs)) {
  const m = Math.max(a, b, c);
  ges[m] = (ges[m] || 0) + na * nb * nc;
}
console.log("  Kombinationen (R x D x S), berechnet aus den Verteilungen der Pfade:", Object.values(ges).reduce((x, y) => x + y, 0), "Stufen:", ges);

// Stichprobe vollständiger Assessments: Fragenführung, Eingabeprüfung und Gesamtergebnis
// wirken zusammen. Der Zufallsgenerator ist fest initialisiert, die Stichprobe ist bei jedem
// Lauf dieselbe.
let saat = 20261009;
const zufall = () => { saat = (saat * 1103515245 + 12345) % 2147483648; return saat / 2147483648; };
const waehle = (liste) => liste[Math.floor(zufall() * liste.length)];
function zufallsAntwort(frage) {
  const v = R.ANTWORTEN[frage];
  if (v.typ === "einfach") return waehle(v.werte);
  const r = zufall();
  if (r < 0.2) return "Keine";
  if (r < 0.35) return "Unklar";
  const t = v.werte.filter(() => zufall() < 0.4);
  return t.length ? t : [v.werte[0]];
}
const STICHPROBE = 20000;
let abgeschlossen = 0;
for (let n = 0; n < STICHPROBE; n++) {
  const a = {};
  // Fragen werden in der Reihenfolge der Oberfläche beantwortet, bis keine neue mehr erscheint.
  for (let runde = 0; runde < 5; runde++) {
    for (const f of R.sichtbar(a)) if (a[f] === undefined) a[f] = zufallsAntwort(f);
    for (const f of Object.keys(a)) if (!R.sichtbar(a).includes(f)) delete a[f];
  }
  let e;
  try { e = R.auswerten(a); } catch (x) { fehler.push("auswerten() wirft bei zulässiger Eingabe: " + x.message); continue; }
  if (e.abschluss) { abgeschlossen++; continue; }
  if (e.gesamt !== Math.max(e.R, e.D, e.S)) fehler.push("Gesamtergebnis ist nicht die höchste Stufe: " + JSON.stringify(a));
  if (e.R !== R.rPfad(a).stufe || e.D !== R.dPfad(a).stufe || e.S !== R.sPfad(a).stufe) fehler.push("Teilergebnis weicht ab: " + JSON.stringify(a));
  // Jeder Pfad wertet nur seine eigenen Fragen aus: Mit allein diesen Fragen ergibt sich dieselbe Stufe.
  const nur = (fragen) => Object.fromEntries(fragen.filter((f) => a[f] !== undefined).map((f) => [f, a[f]]));
  if (R.rPfad(nur(R_FRAGEN)).stufe !== e.R || R.dPfad(nur(D_FRAGEN)).stufe !== e.D || R.sPfad(nur(S_FRAGEN)).stufe !== e.S) {
    fehler.push("Ein Pfad hängt von Fragen eines anderen Pfads ab: " + JSON.stringify(a));
  }
}
console.log("  Stichprobe vollständiger Assessments:", STICHPROBE, "davon nach der Vorprüfung beendet:", abgeschlossen);

// ================================================================ Ergebnis
console.log("== Zusammenfassung ==");
fehler.slice(0, 20).forEach((f) => console.log("  " + f));
console.log("Fehler der Konsistenzprüfung: " + fehler.length);
process.exitCode = fehler.length ? 1 : 0;
