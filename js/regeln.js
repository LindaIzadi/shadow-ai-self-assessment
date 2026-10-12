/*
 * regeln.js – Regelbasis des Self-Assessments (Abschnitt 5.3 der Arbeit)
 *
 * Die Datei enthält ausschließlich die Bewertungslogik. Sie kennt weder Texte
 * noch die Oberfläche. Jede Funktion entspricht einer Tabelle aus Abschnitt 5.3:
 *
 *   einordnung()      Tabelle 14  Einordnung als Shadow AI
 *   rPfad()           Tabelle 15  Regeln des regulatorischen Pfads
 *   dPfad()           Tabelle 16  Regeln des datenschutzrechtlichen Pfads
 *   s1() bis s4()     Tabelle 17  Regeln der Risikofelder im S-Pfad
 *   sPfad()           Ersatzwerte für „Unklar“ und Kombinationsregeln K1, K2
 *   empfehlungen()    Tabelle 18  Regeln für die Handlungsempfehlungen
 *   widersprueche()   Widersprüchliche Angaben (Abschnitt 5.3.4), ohne Wirkung auf die Stufe
 *   auswerten()       Gesamtergebnis (höchste Stufe der drei Teilergebnisse)
 *   protokoll()       Ergebnis in der Schreibweise von Anhang C (für die Prüfung)
 *
 * Reaktionsstufen: 1 Kein besonderer Handlungsbedarf, 2 Handlungsbedarf,
 *                  3 Prüfbedarf, 4 Eskalation
 *
 * Antworten werden als Objekt übergeben, z. B. { F2: "Ja", F6: [1, 4], ... }.
 * Mehrfachauswahlen sind "Keine", "Unklar" oder eine Liste der gewählten Werte.
 * Welche Werte zulässig sind, legt ANTWORTEN fest. auswerten() weist jede andere
 * Eingabe mit einer Fehlermeldung zurück.
 *
 * Die Datei läuft im Browser (globales Objekt „Regeln“) und zur Prüfung in Node.js.
 */
(function (wurzel) {
  "use strict";

  // ---------------------------------------------------------------- Zulässige Antworten
  var KEINE = "Keine", UNKLAR = "Unklar", JA = "Ja", NEIN = "Nein";
  var ZUSTAND = { VORHANDEN: "vorhanden", FEHLT: "fehlt", UNKLAR: "unklar" };
  var EINORDNUNG = {
    ABSCHLUSS: "Abschluss nach Vorpruefung",
    KEINE: "keine Shadow AI",
    IN_PRUEFUNG: "keine Shadow AI, Freigabe steht aus",
    UNKLAR: "unklar",
    SHADOW_AI: "Shadow AI"
  };
  var PFADE = ["R", "D", "S"];
  var FELDER = ["S1", "S2", "S3", "S4"];

  var REIHENFOLGE = [];
  for (var i = 1; i <= 30; i++) REIHENFOLGE.push("F" + i);

  function einfach(werte) { return { typ: "einfach", werte: werte }; }
  function mehrfach(werte) { return { typ: "mehrfach", werte: werte }; }
  function nummern(anzahl) {
    var liste = [];
    for (var n = 1; n <= anzahl; n++) liste.push(n);
    return liste;
  }
  var JA_NEIN_UNKLAR = [JA, NEIN, UNKLAR];

  /**
   * Interne Codes aller Antworten (Tabelle A.1). Bei Mehrfachauswahlen stehen hier die
   * wählbaren Sachverhalte; „Keine“ und „Unklar“ kommen als ausschließende Antworten hinzu.
   * inhalte.js ordnet jedem Code seinen Wortlaut zu. test/regeln.test.js prüft, dass beide
   * Dateien dieselben Codes verwenden.
   */
  var ANTWORTEN = {
    F1: einfach(["Texte", "Uebersetzen", "Recherchieren", "Programmcode", "Daten", "Medien", "Sonstiges"]),
    F2: einfach(JA_NEIN_UNKLAR),
    F3: einfach(["Unternehmen", "privat", "ohne Anmeldung", UNKLAR]),
    F4: einfach(["freigegeben", "in Pruefung", "bekannt, nicht freigegeben", "nicht bekannt", UNKLAR]),
    F5: mehrfach(nummern(3)),
    F6: mehrfach(nummern(8)),
    F7: mehrfach(nummern(10)),
    F8: einfach(JA_NEIN_UNKLAR),
    F9: mehrfach(nummern(4)),
    F10: einfach(JA_NEIN_UNKLAR),
    F11: einfach(JA_NEIN_UNKLAR),
    F12: einfach(JA_NEIN_UNKLAR),
    F13: einfach(JA_NEIN_UNKLAR),
    F14: einfach(JA_NEIN_UNKLAR),
    F15: einfach(JA_NEIN_UNKLAR),
    F16: einfach(JA_NEIN_UNKLAR),
    F17: mehrfach(nummern(2)),
    F18: einfach(["oeffentlich", "intern", "vertraulich", UNKLAR]),
    F19: einfach(["Information", "Vorschlag", "massgeblich", "automatisch", UNKLAR]),
    F20: einfach(["gering", "spuerbar", "erheblich", UNKLAR]),
    F21: einfach(["immer", "teilweise", "nie", UNKLAR]),
    F22: einfach(["ja", "teilweise", "nein", UNKLAR]),
    F23: einfach(["lokal", "extern ohne", "extern mit", UNKLAR]),
    F24: einfach(["manuell", "Erweiterung", "automatisiert", UNKLAR]),
    F25: einfach(JA_NEIN_UNKLAR),
    F26: einfach(JA_NEIN_UNKLAR),
    F27: einfach(JA_NEIN_UNKLAR),
    F28: einfach(JA_NEIN_UNKLAR),
    F29: mehrfach(["Stelle", "Verfahren"]),
    F30: einfach(JA_NEIN_UNKLAR)
  };

  // Sachverhalte in Auswahllisten, auf die eine Regel einzeln Bezug nimmt
  var F6_SPAETERER_GELTUNGSBEGINN = 8;   // Art. 5 Abs. 1 Buchst. ba und bb KI-VO
  var F7_KATEGORISIERUNG = 2;            // Art. 50 Abs. 3 KI-VO
  var F7_EMOTIONSERKENNUNG = 3;          // Art. 50 Abs. 3 KI-VO

  // ---------------------------------------------------------------- Hilfen
  var AUSWAHL = "Auswahl";
  /** Eine Mehrfachauswahl wirkt über: Keine / Unklar / mindestens eine Auswahl. */
  function klasse(antwort) {
    return antwort === KEINE || antwort === UNKLAR ? antwort : AUSWAHL;
  }
  function enthaelt(antwort, wert) {
    return Array.isArray(antwort) && antwort.indexOf(wert) !== -1;
  }
  /** Liest einen Tabellenwert. Ein fehlender Eintrag ist ein Fehler und kein stilles „undefined“. */
  function nachschlagen(tabelle, wert, frage) {
    if (!Object.prototype.hasOwnProperty.call(tabelle, wert)) {
      throw new Error("Regelbasis: kein Eintrag für " + frage + " = " + JSON.stringify(wert));
    }
    return tabelle[wert];
  }
  var ZUSTAND_ZU_ANTWORT = { Ja: ZUSTAND.VORHANDEN, Nein: ZUSTAND.FEHLT, Unklar: ZUSTAND.UNKLAR };
  function zustand(antwort, frage) {
    return nachschlagen(ZUSTAND_ZU_ANTWORT, antwort, frage);
  }

  // ---------------------------------------------------------------- Fragenführung
  /** Bei ausschließlich privater Nutzung endet das Assessment nach F2 (Abschnitt 5.3.1). */
  function endetNachVorpruefung(a) {
    return a.F2 === NEIN;
  }

  /** Fragen, die bei diesen Antworten gestellt werden (Tabelle A.1, Spalte „Erscheint“). */
  function sichtbar(a) {
    if (endetNachVorpruefung(a)) return ["F1", "F2"];
    var fr = ["F1", "F2", "F3", "F4", "F5", "F6", "F7"];
    if (a.F7 !== undefined && a.F7 !== KEINE) fr.push("F8", "F9");
    fr.push("F10", "F11", "F12");
    if (a.F12 !== undefined && a.F12 !== NEIN) {
      fr.push("F13");
      if (a.F13 === JA) fr.push("F14");
      fr.push("F15", "F16", "F17");
    }
    for (var n = 18; n <= 30; n++) fr.push("F" + n);
    return fr;
  }

  /** Prüft eine einzelne Antwort gegen ANTWORTEN. */
  function istZulaessig(frage, antwort) {
    var vorgabe = ANTWORTEN[frage];
    if (!vorgabe) return false;
    if (vorgabe.typ === "einfach") return vorgabe.werte.indexOf(antwort) !== -1;
    if (antwort === KEINE || antwort === UNKLAR) return true;
    if (!Array.isArray(antwort) || antwort.length === 0) return false;
    return antwort.every(function (wert, pos) {
      return vorgabe.werte.indexOf(wert) !== -1 && antwort.indexOf(wert) === pos;   // bekannt und nicht doppelt
    });
  }

  /**
   * Pflichtfelder und Werte: Genau die sichtbaren Fragen müssen beantwortet sein,
   * und jede Antwort muss ein zulässiger Wert ihrer Frage sein.
   */
  function pruefeEingabe(a) {
    var beantwortet = Object.keys(a).filter(function (f) { return a[f] !== undefined && a[f] !== null; });
    var unzulaessig = beantwortet.filter(function (f) { return !istZulaessig(f, a[f]); });
    if (unzulaessig.length) {
      throw new Error("Eingabe ungültig: unzulässige Antwort bei [" + unzulaessig.join(", ") + "]");
    }
    var soll = sichtbar(a);
    var fehlt = soll.filter(function (f) { return beantwortet.indexOf(f) === -1; });
    var zuviel = beantwortet.filter(function (f) { return soll.indexOf(f) === -1; });
    if (fehlt.length || zuviel.length) {
      throw new Error("Eingabe unvollständig oder widersprüchlich: fehlt [" + fehlt.join(", ") +
        "], zu viel [" + zuviel.join(", ") + "]");
    }
  }

  // ---------------------------------------------------------------- Tabelle 14
  function einordnung(f2, f4) {
    if (f2 === NEIN) return EINORDNUNG.ABSCHLUSS;
    if (f4 === "freigegeben") return EINORDNUNG.KEINE;
    if (f4 === "in Pruefung") return EINORDNUNG.IN_PRUEFUNG;
    if (f2 === UNKLAR || f4 === UNKLAR) return EINORDNUNG.UNKLAR;
    return EINORDNUNG.SHADOW_AI;
  }

  // ---------------------------------------------------------------- Regeltreffer
  /**
   * Sammelt die Regeln, die in einem Bewertungspfad greifen. Ein Treffer hat die Form
   *   { pfad, kennung, name, stufe, hinweis, fragen, zusaetze: [{ name, hinweis, fragen }] }
   * kennung  Regel nach Abschnitt 5.3.2, z. B. "R2"
   * name     Schreibweise in Anhang C, z. B. "R2 (Eskalation)"
   * hinweis  Schlüssel des Hinweistexts in inhalte.js (Tabellen B.2 bis B.4)
   * fragen   Antworten, die die Regel ausgelöst haben
   * Zusätze ergänzen den Hinweis einer Regel und verändern keine Stufe.
   */
  function neuerPfad(pfad) {
    var p = { stufe: 1, treffer: [] };
    p.greift = function (kennung, stufe, fragen, name, hinweis) {
      var t = {
        pfad: pfad, kennung: kennung, name: name || kennung, stufe: stufe,
        hinweis: hinweis || name || kennung, fragen: fragen, zusaetze: []
      };
      p.treffer.push(t);
      if (stufe > p.stufe) p.stufe = stufe;
      return t;
    };
    return p;
  }
  function zusatz(treffer, name, fragen) {
    treffer.zusaetze.push({ name: name, hinweis: name, fragen: fragen });
  }

  // ---------------------------------------------------------------- Tabelle 15
  function rPfad(a) {
    var p = neuerPfad("R");
    if (a.F5 !== KEINE) p.greift("R1", 3, ["F5"]);
    if (klasse(a.F6) === AUSWAHL) {
      var r2 = p.greift("R2", 4, ["F6"], "R2 (Eskalation)");
      if (enthaelt(a.F6, F6_SPAETERER_GELTUNGSBEGINN)) zusatz(r2, "R2 Zusatz Geltungsbeginn", []);
    } else if (a.F6 === UNKLAR) {
      p.greift("R2", 3, ["F6"], "R2 (Pruefbedarf)");
    }
    var r3 = a.F7 !== KEINE;
    if (r3) {
      var treffer3 = p.greift("R3", 3, ["F7"]);
      if (a.F8 === JA) zusatz(treffer3, "R3 Zusatz Profiling", ["F8"]);
      else if (a.F8 === UNKLAR) zusatz(treffer3, "R3 Zusatz Profiling unklar", ["F8"]);
      var treffer4 = p.greift("R4", 3, ["F7"]);
      if (a.F9 !== KEINE) zusatz(treffer4, "R4 Zusatz Art. 27", ["F9"]);
    }
    var r5 = [];
    if (a.F10 !== NEIN) r5.push("F10");
    if (a.F11 !== NEIN) r5.push("F11");
    if (enthaelt(a.F7, F7_KATEGORISIERUNG) || enthaelt(a.F7, F7_EMOTIONSERKENNUNG)) r5.push("F7");
    if (r5.length) p.greift("R5", 3, r5);
    return { stufe: p.stufe, treffer: p.treffer, r3: r3 };
  }

  // ---------------------------------------------------------------- Tabelle 16
  function dPfad(a) {
    var p = neuerPfad("D");
    if (a.F12 === NEIN) return { stufe: p.stufe, treffer: p.treffer };
    p.greift("D1", 3, ["F12"]);
    if (a.F13 === JA) {
      // Tabelle B.3 nennt für D2 mit Prüfbedarf zwei Hinweise, je nach auslösender Antwort.
      if (a.F14 === JA) p.greift("D2", 3, ["F13", "F14"], "D2 (Pruefbedarf)", "D2 (Pruefbedarf) bei F14 Ja");
      else p.greift("D2", 4, ["F13", "F14"], "D2 (Eskalation)");
    } else if (a.F13 === UNKLAR) {
      p.greift("D2", 3, ["F13"], "D2 (Pruefbedarf)", "D2 (Pruefbedarf) bei F13 Unklar");
    }
    if (a.F15 !== NEIN) p.greift("D3", 3, ["F15"]);
    if (a.F16 !== NEIN) p.greift("D4", 3, ["F16"]);
    if (a.F17 !== KEINE) p.greift("D5", 3, ["F17"]);
    return { stufe: p.stufe, treffer: p.treffer };
  }

  // ---------------------------------------------------------------- Tabelle 17
  /** Ersatzwerte für „Unklar“ im S-Pfad: nie die günstigste Option. */
  var ERSATZ = {
    F4: "bekannt, nicht freigegeben", F18: "intern", F19: "massgeblich", F20: "spuerbar",
    F21: "teilweise", F22: "teilweise", F23: "extern mit", F24: "Erweiterung"
  };
  // Ausprägungen je Frage, geordnet von günstig (1) nach ungünstig
  var FREIGABE = { "freigegeben": 1, "in Pruefung": 1, "bekannt, nicht freigegeben": 2, "nicht bekannt": 3 };   // F4
  var SENSITIVITAET = { oeffentlich: 1, intern: 2, vertraulich: 3 };                                           // F18
  var EINFLUSS = { Information: 1, Vorschlag: 1, massgeblich: 2, automatisch: 3 };                              // F19
  var FOLGEN = { gering: 1, spuerbar: 2, erheblich: 3 };                                                        // F20
  var PRUEFUNG = { immer: 1, teilweise: 2, nie: 3 };                                                            // F21
  var NACHVOLLZIEHBARKEIT = { ja: 1, teilweise: 2, nein: 3 };                                                   // F22
  var VERARBEITUNG = {                                                                                          // F23
    "lokal": { extern: false, speicherungMoeglich: false },
    "extern ohne": { extern: true, speicherungMoeglich: false },
    "extern mit": { extern: true, speicherungMoeglich: true }
  };
  // Stufe des Risikofelds S4 je Verarbeitung (F23) und Einbindung (F24)
  var S4_STUFE = {
    "lokal": { manuell: 1, Erweiterung: 1, automatisiert: 1 },
    "extern ohne": { manuell: 1, Erweiterung: 1, automatisiert: 2 },
    "extern mit": { manuell: 2, Erweiterung: 3, automatisiert: 3 }
  };
  var S_TABELLEN = {
    F4: FREIGABE, F18: SENSITIVITAET, F19: EINFLUSS, F20: FOLGEN, F21: PRUEFUNG,
    F22: NACHVOLLZIEHBARKEIT, F23: VERARBEITUNG, F24: S4_STUFE.lokal
  };
  var FELD_FRAGEN = { S1: ["F18", "F23"], S2: ["F19", "F20", "F21"], S3: ["F4", "F22"], S4: ["F23", "F24"] };

  function s1(f18, f23) {
    if (!nachschlagen(VERARBEITUNG, f23, "F23").extern) return 1;
    return nachschlagen(SENSITIVITAET, f18, "F18");
  }
  function s2(f19, f20, f21) {
    var einfluss = nachschlagen(EINFLUSS, f19, "F19");
    var folgen = nachschlagen(FOLGEN, f20, "F20");
    var pruefung = nachschlagen(PRUEFUNG, f21, "F21");
    if (folgen === 1) return 1;
    if (folgen === 3 && einfluss >= 2 && pruefung >= 2) return 3;
    if (folgen === 2 && einfluss === 3 && pruefung === 3) return 3;
    if (einfluss >= 2 || pruefung >= 2) return 2;
    return 1;
  }
  function s3(f4, f22) {
    var freigabe = nachschlagen(FREIGABE, f4, "F4");
    var nachvollziehbar = nachschlagen(NACHVOLLZIEHBARKEIT, f22, "F22");
    if (freigabe === 3 || (freigabe === 2 && nachvollziehbar === 3)) return 3;
    if (freigabe === 2 || nachvollziehbar >= 2) return 2;
    return 1;
  }
  function s4(f23, f24) {
    return nachschlagen(nachschlagen(S4_STUFE, f23, "F23"), f24, "F24");
  }

  function sPfad(a) {
    var w = {};
    Object.keys(ERSATZ).forEach(function (f) { w[f] = a[f] === UNKLAR ? ERSATZ[f] : a[f]; });
    var felder = {
      S1: s1(w.F18, w.F23), S2: s2(w.F19, w.F20, w.F21),
      S3: s3(w.F4, w.F22), S4: s4(w.F23, w.F24)
    };
    var p = neuerPfad("S");
    FELDER.forEach(function (f) {
      if (felder[f] >= 2) p.greift(f, felder[f], FELD_FRAGEN[f]);
    });
    // Kombinationsregeln
    if (felder.S1 === 3 && nachschlagen(VERARBEITUNG, w.F23, "F23").speicherungMoeglich) {
      p.greift("K1", 4, ["F18", "F23"]);
    }
    if (felder.S2 === 3 && felder.S3 === 3) {
      p.greift("K2", 4, ["F19", "F20", "F21", "F4", "F22"]);
    }
    return { stufe: p.stufe, felder: felder, treffer: p.treffer };
  }

  // ---------------------------------------------------------------- Tabelle 18
  /**
   * Handlungsempfehlungen in der Form { kennung, zustand, zusaetze, anlass }.
   * zustand  Stand der zugehörigen Schutzmaßnahme. null bei einer Empfehlung ohne
   *          Schutzmaßnahme (E7, E8).
   * zusaetze Namen ergänzender Empfehlungstexte (Tabelle B.5)
   * anlass   Warum die Empfehlung ausgegeben wird: { grund, sachverhalte }.
   *          grund nennt den Anlass nach Tabelle 18 (Schlüssel der Texte in inhalte.js),
   *          sachverhalte die Kennungen der auslösenden Regeln. Die Oberfläche zeigt den
   *          Anlass unter „Warum diese Empfehlung?“ an.
   */
  function empfehlungen(a, gesamt, felder, einordn, r3, treffer) {
    var anlassEinordnung = einordn === EINORDNUNG.SHADOW_AI || einordn === EINORDNUNG.UNKLAR;
    var kennungen = (treffer || []).map(function (t) { return t.kennung; });
    /** Kennungen der Regeln, die die angegebene Stufe ausgelöst haben, ohne Doppelungen. */
    function mitStufe(stufe) {
      return (treffer || []).filter(function (t, pos) {
        return t.stufe === stufe && kennungen.indexOf(t.kennung) === pos;
      }).map(function (t) { return t.kennung; });
    }
    /** Risikofelder ab Handlungsbedarf, ergänzt um die Kombinationsregel, falls sie greift. */
    function risiken(liste, kombination) {
      var feld = liste.filter(function (f) { return felder[f] >= 2; });
      return kennungen.indexOf(kombination) !== -1 ? feld.concat(kombination) : feld;
    }
    var grundEinordnung = { grund: einordn === EINORDNUNG.UNKLAR ? "unklar" : "shadow", sachverhalte: [] };
    var grundFreigabe = { grund: a.F4 === UNKLAR ? "freigabeUnklar" : "nichtFrei", sachverhalte: [] };
    var nichtFrei = ["bekannt, nicht freigegeben", "nicht bekannt", UNKLAR].indexOf(a.F4) !== -1;
    function teil29(name) {
      if (a.F29 === UNKLAR) return ZUSTAND.UNKLAR;
      if (a.F29 === KEINE) return ZUSTAND.FEHLT;
      return enthaelt(a.F29, name) ? ZUSTAND.VORHANDEN : ZUSTAND.FEHLT;
    }
    var liste = [];
    function empfiehl(kennung, stand, anlass, zusaetze) {
      liste.push({ kennung: kennung, zustand: stand, zusaetze: zusaetze || [], anlass: anlass });
    }
    // E1: Fehlt eine KI-Richtlinie oder ist sie unklar, wird sie ab Handlungsbedarf oder bei
    // möglicher Shadow AI empfohlen. Besteht bereits eine Richtlinie, wird ihre Anwendung nur
    // empfohlen, wenn die Nutzung Shadow AI sein kann. Dann ist zu klären, ob die Richtlinie
    // diese Nutzung zulässt. Bei freigegebener Nutzung trägt der Verweis auf die bestehende
    // Richtlinie nichts zu den festgestellten Sachverhalten bei und entfällt.
    var richtlinie = zustand(a.F25, "F25");
    if (richtlinie === ZUSTAND.VORHANDEN) {
      if (anlassEinordnung) empfiehl("E1", richtlinie, grundEinordnung);
    } else if (gesamt >= 2 || anlassEinordnung) {
      empfiehl("E1", richtlinie,
        gesamt >= 2 ? { grund: "gesamt", sachverhalte: mitStufe(gesamt) } : grundEinordnung);
    }
    if (a.F26 !== JA) {
      empfiehl("E2", zustand(a.F26, "F26"), { grund: a.F26 === UNKLAR ? "schulungUnklar" : "schulungNein", sachverhalte: [] });
    }
    if (felder.S1 >= 2 || felder.S4 >= 2) {
      empfiehl("E3", zustand(a.F27, "F27"), { grund: "sachverhalteRisiko", sachverhalte: risiken(["S1", "S4"], "K1") });
    }
    if (felder.S2 >= 2) {
      var pruefung = zustand(a.F28, "F28");
      empfiehl("E4", pruefung, { grund: "sachverhalteRisiko", sachverhalte: risiken(["S2"], "K2") },
        r3 && pruefung !== ZUSTAND.VORHANDEN ? ["E4 Zusatz Art. 26 Abs. 2"] : []);
    }
    // E8: Maßnahme zum Risikofaktor Transparenz und Nachvollziehbarkeit (S3). Sie entfällt nur,
    // wenn S3 allein aus der fehlenden Freigabe folgt und die Nutzung nachvollziehbar ist. Diesen
    // Teil decken E5b und E6 ab. So bleibt bei Handlungsbedarf nie eine Empfehlungsliste leer.
    var nichtNachvollziehbar = a.F22 !== "ja";
    if (felder.S3 >= 2 && (nichtNachvollziehbar || !nichtFrei)) {
      empfiehl("E8", null, { grund: "sachverhalteRisiko", sachverhalte: risiken(["S3"], "K2") });
    }
    if (gesamt >= 3 || anlassEinordnung) {
      empfiehl("E5a", teil29("Stelle"),
        gesamt >= 3 ? { grund: "stelle", sachverhalte: mitStufe(gesamt) } : grundEinordnung);
    }
    if (nichtFrei) {
      empfiehl("E5b", teil29("Verfahren"), grundFreigabe);
      empfiehl("E6", zustand(a.F30, "F30"), grundFreigabe);
    }
    // E7 bei selbst eingerichtetem Zugang und bei Nutzung ohne Anmeldung, der Anlass nennt die Angabe
    if (a.F3 === "privat") empfiehl("E7", null, { grund: "privat", sachverhalte: [] });
    if (a.F3 === "ohne Anmeldung") empfiehl("E7", null, { grund: "ohneAnmeldung", sachverhalte: [] });
    return liste;
  }

  // ---------------------------------------------------------------- Widersprüchliche Angaben
  /**
   * Angaben, die einander nach ihrem Wortlaut ausschließen (Abschnitt 5.3.4).
   * Sie werden im Ergebnis ausgewiesen und verändern keine Reaktionsstufe.
   *   W1        keine personenbezogenen Daten (F12), aber Profiling (F8)
   *   W2 (F15)  Daten verlassen das Unternehmen nicht (F23), aber externe Verarbeitung (F15)
   *   W2 (F16)  Daten verlassen das Unternehmen nicht (F23), aber Drittlandbezug (F16)
   */
  function widersprueche(a) {
    var w = [];
    if (a.F12 === NEIN && a.F8 === JA) w.push("W1");
    if (a.F23 === "lokal" && a.F15 === JA) w.push("W2 (F15)");
    if (a.F23 === "lokal" && a.F16 === JA) w.push("W2 (F16)");
    return w;
  }

  // ---------------------------------------------------------------- Gesamtergebnis
  /**
   * Wertet einen Nutzungsfall aus. Ergebnis:
   *   { abschluss: true }                          Abschluss nach der Vorprüfung
   *   { abschluss: false, gesamt, R, D, S,         Reaktionsstufen 1 bis 4
   *     felder: { S1, S2, S3, S4 },                Stufen der Risikofelder
   *     bestimmend: ["D"],                         Pfade mit der höchsten Stufe, leer bei Stufe 1
   *     einordnung, freigabezusatz,                Einordnung als Shadow AI und Zusatz zur Freigabe
   *     treffer, luecken, widersprueche,           widersprueche: Kennungen, ohne Wirkung auf die Stufe
   *     empfehlungen }
   */
  function auswerten(a) {
    pruefeEingabe(a);
    if (endetNachVorpruefung(a)) return { abschluss: true };

    var r = rPfad(a), d = dPfad(a), s = sPfad(a);
    var treffer = r.treffer.concat(d.treffer, s.treffer);
    var stufen = { R: r.stufe, D: d.stufe, S: s.stufe };
    var gesamt = Math.max(stufen.R, stufen.D, stufen.S);
    var einordn = einordnung(a.F2, a.F4);

    return {
      abschluss: false,
      gesamt: gesamt, R: stufen.R, D: stufen.D, S: stufen.S,
      felder: s.felder,
      // Bei Stufe 1 bestimmt kein Bereich das Ergebnis: Nirgends besteht Prüf- oder Handlungsbedarf.
      bestimmend: gesamt > 1 ? PFADE.filter(function (p) { return stufen[p] === gesamt; }) : [],
      einordnung: einordn,
      freigabezusatz: a.F4 === "freigegeben" && gesamt >= 3,
      treffer: treffer,
      luecken: REIHENFOLGE.filter(function (f) { return a[f] === UNKLAR; }),
      widersprueche: widersprueche(a),
      empfehlungen: empfehlungen(a, gesamt, s.felder, einordn, r.r3, treffer)
    };
  }

  /**
   * Ergebnis in der Schreibweise von Anhang C und der Testdaten: Regeln und
   * Empfehlungen als flache Listen ihrer Namen. Dient dem Vergleich mit den Testfällen.
   */
  function protokoll(e) {
    if (e.abschluss) return { gesamt: "Abschluss nach der Vorpruefung" };
    var regeln = [], paare = [];
    e.treffer.forEach(function (t) {
      regeln.push(t.name);
      t.zusaetze.forEach(function (z) { regeln.push(z.name); });
    });
    e.empfehlungen.forEach(function (m) {
      var stand = m.zustand === null ? "-" : m.zustand;
      paare.push([m.kennung, stand]);
      m.zusaetze.forEach(function (name) { paare.push([name, stand]); });
    });
    return {
      gesamt: e.gesamt, R: e.R, D: e.D, S: e.S,
      felder: FELDER.map(function (f) { return e.felder[f]; }),
      einordnung: e.einordnung, freigabezusatz: e.freigabezusatz,
      regeln: regeln, luecken: e.luecken, widersprueche: e.widersprueche, empfehlungen: paare
    };
  }

  // ---------------------------------------------------------------- Selbstprüfung beim Laden
  /**
   * Die Tabellen des S-Pfads müssen genau die Antworten ihrer Frage abdecken, und jeder
   * Ersatzwert muss eine dieser Antworten sein. Ein Tippfehler fällt so beim Laden auf.
   */
  (function pruefeTabellen() {
    function gleich(x, y) { return x.slice().sort().join("|") === y.slice().sort().join("|"); }
    Object.keys(S_TABELLEN).forEach(function (frage) {
      var soll = ANTWORTEN[frage].werte.filter(function (wert) { return wert !== UNKLAR; });
      if (!gleich(Object.keys(S_TABELLEN[frage]), soll)) {
        throw new Error("Regelbasis: Tabelle zu " + frage + " passt nicht zu den zulässigen Antworten");
      }
      if (soll.indexOf(ERSATZ[frage]) === -1) {
        throw new Error("Regelbasis: Ersatzwert zu " + frage + " ist keine zulässige Antwort");
      }
    });
    Object.keys(S4_STUFE).forEach(function (verarbeitung) {
      if (!gleich(Object.keys(S4_STUFE[verarbeitung]), Object.keys(S4_STUFE.lokal))) {
        throw new Error("Regelbasis: Tabelle S4 ist unvollständig bei " + verarbeitung);
      }
    });
    if (!gleich(Object.keys(S4_STUFE), Object.keys(VERARBEITUNG))) {
      throw new Error("Regelbasis: Tabelle S4 passt nicht zu den Antworten auf F23");
    }
  })();

  var api = {
    KEINE: KEINE, UNKLAR: UNKLAR, ZUSTAND: ZUSTAND, EINORDNUNG: EINORDNUNG,
    PFADE: PFADE, FELDER: FELDER, ANTWORTEN: ANTWORTEN,
    sichtbar: sichtbar, endetNachVorpruefung: endetNachVorpruefung,
    istZulaessig: istZulaessig, pruefeEingabe: pruefeEingabe,
    einordnung: einordnung, rPfad: rPfad, dPfad: dPfad, sPfad: sPfad,
    s1: s1, s2: s2, s3: s3, s4: s4, empfehlungen: empfehlungen, widersprueche: widersprueche,
    auswerten: auswerten, protokoll: protokoll
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else wurzel.Regeln = api;
})(typeof window !== "undefined" ? window : this);
