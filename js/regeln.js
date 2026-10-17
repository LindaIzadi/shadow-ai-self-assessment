/*
 * regeln.js – Regelbasis des Self-Assessments (Abschnitt 5.3 der Arbeit)
 *
 * Die Datei enthält ausschließlich die Bewertungslogik. Sie kennt weder Texte
 * noch die Oberfläche. Jede Funktion entspricht einer Tabelle aus Abschnitt 5.3:
 *
 *   einordnung()      Tabelle 13  Einordnung als Shadow AI
 *   rPfad()           Tabelle 14  Regeln des regulatorischen Pfads
 *   dPfad()           Tabelle 15  Regeln des datenschutzrechtlichen Pfads
 *   s1() bis s4()     Tabelle 16  Regeln der Risikofelder im S-Pfad
 *   sPfad()           Ersatzwerte für „Unklar“ und Kombinationsregeln K1, K2
 *   empfehlungen()    Tabelle 17  Regeln für die Handlungsempfehlungen
 *   widersprueche()   Widersprüchliche Angaben (Abschnitt 5.3.5), ohne Wirkung auf die Stufe
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
    F4: einfach(["freigegeben", "in Pruefung", "bekannt, nicht freigegeben", "abgelehnt", "nicht bekannt", UNKLAR]),
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
    F17: mehrfach(nummern(3)),
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
  var F7_KRITIS = 4;                     // Anhang III Nr. 2, bei Art. 27 Abs. 1 ausgenommen
  var F7_GRUNDLEGENDE_DIENSTE = 7;       // Anhang III Nr. 5, darunter Buchst. b und c
  var F9_OEFFENTLICH = [1, 2];           // öffentliche Einrichtung, öffentliche Dienste
  var F9_KREDIT_VERSICHERUNG = [3, 4];   // Anhang III Nr. 5 Buchst. b und c

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
      // F14 bei sicherem Personenbezug und bei besonderen Kategorien
      if (a.F12 === JA || a.F13 === JA) fr.push("F14");
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

  // ---------------------------------------------------------------- Tabelle 13
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

  /**
   * Zusatz zu Art. 27 KI-VO (Grundrechte-Folgenabschätzung). Art. 27 Abs. 1 erfasst
   *   öffentliche Einrichtungen und Erbringer öffentlicher Dienste bei Hochrisiko-KI-Systemen
   *   nach Anhang III außer Nr. 2 (F9 Nr. 1, 2 und F7 nicht nur kritische Infrastruktur) sowie
   *   Kreditwürdigkeit und Lebens- und Krankenversicherungen nach Anhang III Nr. 5 Buchst. b, c
   *   (F9 Nr. 3, 4 und F7 grundlegende Dienste oder „Unklar“). F9 „Unklar“ führt zur Prüfung,
   *   außer F7 nennt nur kritische Infrastruktur. Dann kann Art. 27 nicht greifen.
   */
  function grundrechteFolgenabschaetzung(a) {
    var nurKritis = Array.isArray(a.F7) && a.F7.length === 1 && a.F7[0] === F7_KRITIS;
    if (a.F9 === UNKLAR) return !nurKritis;
    if (!Array.isArray(a.F9)) return false;
    var oeffentlich = a.F9.some(function (w) { return F9_OEFFENTLICH.indexOf(w) !== -1; }) && !nurKritis;
    var kreditVersicherung = a.F9.some(function (w) { return F9_KREDIT_VERSICHERUNG.indexOf(w) !== -1; }) &&
      (a.F7 === UNKLAR || enthaelt(a.F7, F7_GRUNDLEGENDE_DIENSTE));
    return oeffentlich || kreditVersicherung;
  }

  // ---------------------------------------------------------------- Tabelle 14
  function rPfad(a) {
    var p = neuerPfad("R");
    if (a.F5 !== KEINE) p.greift("R1", 3, ["F5"], "R1", a.F5 === UNKLAR ? "R1 bei F5 Unklar" : "R1");
    if (klasse(a.F6) === AUSWAHL) {
      var r2 = p.greift("R2", 4, ["F6"], "R2 (Eskalation)");
      if (enthaelt(a.F6, F6_SPAETERER_GELTUNGSBEGINN)) zusatz(r2, "R2 Zusatz Geltungsbeginn", []);
    } else if (a.F6 === UNKLAR) {
      p.greift("R2", 3, ["F6"], "R2 (Pruefbedarf)");
    }
    var r3 = a.F7 !== KEINE;
    if (r3) {
      // Bei F7 „Unklar“ nennt der Hinweis den ungeklärten Bereich, sonst die Angabe.
      var treffer3 = p.greift("R3", 3, ["F7"], "R3", a.F7 === UNKLAR ? "R3 bei F7 Unklar" : "R3");
      if (a.F8 === JA) zusatz(treffer3, "R3 Zusatz Profiling", ["F8"]);
      else if (a.F8 === UNKLAR) zusatz(treffer3, "R3 Zusatz Profiling unklar", ["F8"]);
      var treffer4 = p.greift("R4", 3, ["F7"]);
      if (grundrechteFolgenabschaetzung(a)) zusatz(treffer4, "R4 Zusatz Art. 27", ["F9"]);
    }
    var r5 = [];
    if (a.F10 !== NEIN) r5.push("F10");
    if (a.F11 !== NEIN) r5.push("F11");
    if (enthaelt(a.F7, F7_KATEGORISIERUNG) || enthaelt(a.F7, F7_EMOTIONSERKENNUNG)) r5.push("F7");
    if (r5.length) p.greift("R5", 3, r5);
    return { stufe: p.stufe, treffer: p.treffer, r3: r3 };
  }

  // ---------------------------------------------------------------- Tabelle 15
  function dPfad(a) {
    var p = neuerPfad("D");
    if (a.F12 === NEIN) return { stufe: p.stufe, treffer: p.treffer };
    // D1: Bei F12 „Unklar“ nennt der Hinweis den ungeklärten Personenbezug, bei F12 „Ja“ richtet er
    // sich nach F14. Prüfbedarf bei F14 „Ja“ bedeutet nicht, dass die Freigabe fehlt. Die Stufe
    // beschreibt einen Sachverhalt, den das Assessment nicht abschließend prüfen kann, der Hinweis
    // erkennt die angegebene Freigabe ausdrücklich an. Bei F14 „Nein“ und „Unklar“ sagt der Hinweis
    // nur, dass eine Prüfung und Freigabe nicht bestätigt ist.
    var hinweisD1 = a.F12 === UNKLAR ? "D1 bei F12 Unklar" : a.F14 === JA ? "D1 bei F14 Ja" : "D1 bei F14 Nein oder Unklar";
    p.greift("D1", 3, ["F12"], "D1", hinweisD1);
    
    if (a.F13 === JA) {
      // Tabelle B.3 nennt für D2 mit Prüfbedarf zwei Hinweise, je nach auslösender Antwort.
      if (a.F14 === JA) 
        p.greift(
          "D2", 3, ["F13", "F14"], 
          "D2 (Pruefbedarf)", 
          "D2 (Pruefbedarf) bei F14 Ja"
        );
      else 
        p.greift("D2", 4, ["F13", "F14"], "D2 (Eskalation)");
    } else if (a.F13 === UNKLAR) {
      p.greift(
        "D2", 3, ["F13"], 
        "D2 (Pruefbedarf)", 
        "D2 (Pruefbedarf) bei F13 Unklar");
    }


    // D3 bis D5: Bei „Unklar“ nennt der Hinweis die ungeklärte Angabe, sonst den angegebenen Sachverhalt.
    // F17 „Keine“ löst D5 nicht aus. Das Assessment schließt damit nicht aus, dass eine
    // Datenschutz-Folgenabschätzung erforderlich ist (siehe Hilfetext zu F17).
    if (a.F15 !== NEIN) p.greift("D3", 3, ["F15"], "D3", a.F15 === UNKLAR ? "D3 bei F15 Unklar" : "D3");
    if (a.F16 !== NEIN) p.greift("D4", 3, ["F16"], "D4", a.F16 === UNKLAR ? "D4 bei F16 Unklar" : "D4");
    if (a.F17 !== KEINE) p.greift("D5", 3, ["F17"], "D5", a.F17 === UNKLAR ? "D5 bei F17 Unklar" : "D5");
    return { stufe: p.stufe, treffer: p.treffer };
  }

  // ---------------------------------------------------------------- Tabelle 16
  /** Ersatzwerte für „Unklar“ im S-Pfad: nie die günstigste Option. */
  var ERSATZ = {
    F4: "bekannt, nicht freigegeben", F18: "intern", F19: "massgeblich", F20: "spuerbar",
    F21: "teilweise", F22: "teilweise", F23: "extern mit", F24: "Erweiterung"
  };
  // Ausprägungen je Frage, geordnet von günstig (1) nach ungünstig
  var FREIGABE = { "freigegeben": 1, "in Pruefung": 1, "bekannt, nicht freigegeben": 2, "abgelehnt": 2, "nicht bekannt": 3 };   // F4
  var SENSITIVITAET = { oeffentlich: 1, intern: 2, vertraulich: 3 };                                           // F18
  var EINFLUSS = { Information: 1, Vorschlag: 1, massgeblich: 2, automatisch: 3 };                              // F19
  var FOLGEN = { gering: 1, spuerbar: 2, erheblich: 3 };                                                        // F20
  var PRUEFUNG = { immer: 1, teilweise: 2, nie: 3 };                                                            // F21
  var NACHVOLLZIEHBARKEIT = { ja: 1, teilweise: 2, nein: 3 };                                                   // F22
  // F23 unterscheidet externe Verarbeitung ohne und mit Nutzung zum Training. Eine Speicherung ohne
  // Training, etwa für Sicherheitsprüfungen, gehört zu „extern ohne“. Die Antwortcodes sind unverändert.
  var VERARBEITUNG = {                                                                                          // F23
    "lokal": { extern: false, trainingMoeglich: false },
    "extern ohne": { extern: true, trainingMoeglich: false },
    "extern mit": { extern: true, trainingMoeglich: true }
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
    // Hinweistexte: Ein angegebener Sachverhalt wird als Angabe genannt („Nach Ihren Angaben …“),
    // ein nur angenommener („Unklar“ mit Ersatzwert) als Möglichkeit. Die Stufen bleiben gleich.
    // S1: Bei sicher externer Verarbeitung (F23) richtet sich der Hinweis nach F18. Bei F23 „Unklar“
    // bleibt der allgemeine Hinweis, denn die externe Verarbeitung ist dort nur angenommen.
    var extern = a.F23 === "extern ohne" || a.F23 === "extern mit";
    var hinweise = {
      S1: extern && a.F18 !== UNKLAR ? "S1 bei F18 " + a.F18 : extern ? "S1 bei F18 Unklar" : "S1",
      // S2: Ist eine der auslösenden Fragen „Unklar“, ist der Sachverhalt nur angenommen.
      S2: [a.F19, a.F20, a.F21].indexOf(UNKLAR) !== -1 ? "S2 bei Unklar" : "S2",
      // S3: je Freigabestand (F4) und Nachvollziehbarkeit (F22) ein eigener Hinweis
      S3: "S3 bei F4 " + a.F4 + " und F22 " + a.F22,
      // S4: je Verarbeitung (F23) und Einbindung (F24) ein eigener Hinweis
      S4: "S4 bei F23 " + a.F23 + " und F24 " + a.F24
    };
    FELDER.forEach(function (f) {
      if (felder[f] >= 2) p.greift(f, felder[f], FELD_FRAGEN[f], f, hinweise[f]);
    });
    // Kombinationsregeln
    if (felder.S1 === 3 && nachschlagen(VERARBEITUNG, w.F23, "F23").trainingMoeglich) {
      p.greift("K1", 4, ["F18", "F23"], "K1", a.F23 === UNKLAR ? "K1 bei F23 Unklar" : "K1");
    }
    if (felder.S2 === 3 && felder.S3 === 3) {
      p.greift("K2", 4, ["F19", "F20", "F21", "F4", "F22"]);
    }
    return { stufe: p.stufe, felder: felder, treffer: p.treffer };
  }

  // ---------------------------------------------------------------- Tabelle 17
  /**
   * Handlungsempfehlungen in der Form { kennung, zustand, zusaetze, anlass }.
   * zustand  Stand der zugehörigen Schutzmaßnahme. null bei einer Empfehlung ohne
   *          Schutzmaßnahme (E7, E8).
   * zusaetze Namen ergänzender Empfehlungstexte (Tabelle B.5)
   * anlass   Warum die Empfehlung ausgegeben wird: { grund, sachverhalte }.
   *          grund nennt den Anlass nach Tabelle 17 (Schlüssel der Texte in inhalte.js),
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
    var abgelehnt = a.F4 === "abgelehnt";
    var grundFreigabe = { grund: a.F4 === UNKLAR ? "freigabeUnklar" : abgelehnt ? "abgelehnt" : "nichtFrei", sachverhalte: [] };
    var nichtFrei = ["bekannt, nicht freigegeben", "abgelehnt", "nicht bekannt", UNKLAR].indexOf(a.F4) !== -1;
    function teil29(name) {
      if (a.F29 === UNKLAR) return ZUSTAND.UNKLAR;
      if (a.F29 === KEINE) return ZUSTAND.FEHLT;
      return enthaelt(a.F29, name) ? ZUSTAND.VORHANDEN : ZUSTAND.FEHLT;
    }
    var liste = [];
    function empfiehl(kennung, stand, anlass, zusaetze) {
      liste.push({ kennung: kennung, zustand: stand, zusaetze: zusaetze || [], anlass: anlass });
    }
    // Informationen verlassen das Unternehmen (S1) oder unterliegen den Bedingungen des Anbieters (S4).
    var datenAbfluss = felder.S1 >= 2 || felder.S4 >= 2;
    // E1: Fehlt eine KI-Richtlinie oder ist sie unklar, wird sie ab Handlungsbedarf oder bei
    // möglicher Shadow AI empfohlen. Besteht bereits eine Richtlinie, wird ihre Anwendung
    // empfohlen, wenn die Nutzung Shadow AI sein kann oder Informationen das Unternehmen verlassen.
    // Dann ist zu klären, ob die Richtlinie diese Nutzung und diese Eingaben zulässt.
    // Die Begründung von E1 nennt beide Anlässe, wenn beide vorliegen: die nicht bestätigte oder
    // abgelehnte Freigabe (Einordnung) und die mögliche Weitergabe an einen Anbieter (S1, S4).
    // Liegt keiner davor, nennt sie wie bisher die Regeln mit der Gesamtstufe.
    var richtlinie = zustand(a.F25, "F25");
    var grundRichtlinie = {
      grund: "richtlinie", richtlinie: richtlinie,
      freigabe: anlassEinordnung ? (abgelehnt ? "abgelehnt" : "offen") : null,
      abfluss: datenAbfluss,
      sachverhalte: datenAbfluss ? risiken(["S1", "S4"], "K1") : []
    };
    if (richtlinie === ZUSTAND.VORHANDEN) {
      if (anlassEinordnung || datenAbfluss) empfiehl("E1", richtlinie, grundRichtlinie);
    } else if (gesamt >= 2 || anlassEinordnung) {
      empfiehl("E1", richtlinie,
        anlassEinordnung || datenAbfluss ? grundRichtlinie : { grund: "gesamt", sachverhalte: mitStufe(gesamt) });
    }
    if (a.F26 !== JA) {
      empfiehl("E2", zustand(a.F26, "F26"), { grund: a.F26 === UNKLAR ? "schulungUnklar" : "schulungNein", sachverhalte: [] });
    }
    // E3: nur bei fehlenden oder unklaren technischen Schutzmaßnahmen. Sind sie vorhanden, kann
    // die nutzende Person an ihnen nichts ändern. Für sie gilt dann E1.
    // E3 und E7 entfallen bei ausdrücklich abgelehnter Nutzung. Dann gelten E9 (Nutzung einstellen)
    // und E6 (freigegebene Alternative). Schutzmaßnahmen oder ein Unternehmenszugang für den
    // abgelehnten Dienst könnten sonst als Weg zur weiteren Nutzung verstanden werden.
    if (datenAbfluss && a.F27 !== JA && !abgelehnt) {
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
      // fassung: Der Text richtet sich nach der Antwort auf F22.
      empfiehl("E8", null, { grund: "sachverhalteRisiko", fassung: a.F22, sachverhalte: risiken(["S3"], "K2") });
    }
    if (gesamt >= 3 || anlassEinordnung) {
      empfiehl("E5a", teil29("Stelle"),
        gesamt >= 3 ? { grund: "stelle", sachverhalte: mitStufe(gesamt) } : grundEinordnung);
    }
    // Nach einer ausdrücklichen Ablehnung entfällt der Weg zur Freigabe (E5b). An seine Stelle
    // tritt E9: die Nutzung einstellen. Die freigegebene Alternative (E6) bleibt.
    if (nichtFrei) {
      if (abgelehnt) empfiehl("E9", null, grundFreigabe);
      else empfiehl("E5b", teil29("Verfahren"), grundFreigabe);
      empfiehl("E6", zustand(a.F30, "F30"), grundFreigabe);
    }
    // E7 bei selbst eingerichtetem Zugang und bei Nutzung ohne Anmeldung, der Anlass nennt die Angabe
    if (a.F3 === "privat" && !abgelehnt) empfiehl("E7", null, { grund: "privat", sachverhalte: [] });
    if (a.F3 === "ohne Anmeldung" && !abgelehnt) empfiehl("E7", null, { grund: "ohneAnmeldung", sachverhalte: [] });
    return liste;
  }

  // ---------------------------------------------------------------- Widersprüchliche Angaben
  /**
   * Angaben, die einander nach ihrem Wortlaut ausschließen (Abschnitt 5.3.5).
   * Sie werden im Ergebnis ausgewiesen und verändern keine Reaktionsstufe.
   *   W1        keine personenbezogenen Daten (F12), aber Profiling (F8)
   *   W2 (F15)  Verarbeitung nur auf eigenen Systemen (F23), aber externe Verarbeitung (F15)
   *   W2 (F16)  Verarbeitung nur auf eigenen Systemen (F23), aber Drittlandbezug (F16)
   *   W3        personenbezogene Daten (F12) und Eingaben beim externen Anbieter (F23),
   *             aber keine externe Verarbeitung personenbezogener Daten (F15). Bei F12 „Unklar“
   *             ist der Personenbezug offen, dort gibt es keinen Widerspruch.
   */
  function widersprueche(a) {
    var w = [];
    if (a.F12 === NEIN && a.F8 === JA) w.push("W1");
    if (a.F23 === "lokal" && a.F15 === JA) w.push("W2 (F15)");
    if (a.F23 === "lokal" && a.F16 === JA) w.push("W2 (F16)");
    if (a.F12 === JA && (a.F23 === "extern ohne" || a.F23 === "extern mit") && a.F15 === NEIN) w.push("W3");
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
