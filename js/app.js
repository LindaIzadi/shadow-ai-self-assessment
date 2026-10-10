/*
 * app.js – Oberfläche des Self-Assessments
 *
 * Aufgaben: Fragenführung Block für Block, bedingte Fragen ein- und ausblenden,
 * Pflichtfelder prüfen, Ergebnis darstellen. Die Texte kommen aus inhalte.js,
 * die Bewertung aus regeln.js. Diese Datei trifft keine fachliche Entscheidung
 * und enthält keinen Wortlaut: Sie zeigt an, was regeln.js als Ergebnis liefert.
 *
 * Alle Angaben liegen nur in den Variablen dieser Datei. Es gibt keinen Aufruf,
 * der Daten überträgt oder im Browser ablegt. Beim Neuladen der Seite sind sie weg.
 */
(function () {
  "use strict";

  var I = window.Inhalte, R = window.Regeln, T = I.OBERFLAECHE;

  // ------------------------------------------------------------ Zustand
  var antworten = {};          // { F1: "Texte", F6: [1, 4], ... }
  var SONSTIGER = "sonstiger"; // Wert des Eintrags „Sonstiger KI-Dienst“ in der Auswahlliste
  var dienstWahl = "";         // gewählter Eintrag der Auswahlliste: "", ein Vorschlag oder SONSTIGER
  var dienstName = "";         // frei eingegebener Name bei „Sonstiger KI-Dienst“
  var aufgabe = "";            // konkrete Aufgabe, nur zur Orientierung
  var startFehler = false;     // true, wenn die Startseite fehlende Angaben anzeigen soll
  var ERSTER_BLOCK = I.BLOECKE[0].id;
  var schritt = "start";       // "start", Kennung eines Blocks ("1" bis "5"), "ergebnis", "abschluss"
  var erreicht = {};           // bereits besuchte Blöcke, für die Navigation
  var fallDesAssessments = null; // KI-Dienst und Aufgabe, zu denen die Antworten gegeben wurden

  var schliesseHilfe = null;
  var schliesseErlaeuterung = null;   // schließt die geöffnete Erläuterung einer Frage   // schließt den Hilfetext, der per Klick offen gehalten wird

  var haupt = document.getElementById("inhalt");
  var schritteListe = document.getElementById("schritte");
  document.getElementById("leiste-fuss").textContent = fuelle(T.standRegelbasis, { stand: I.STAND });
  // Vor dem Verlassen oder Neuladen der Seite fragt der Browser nach, solange Antworten
  // vorliegen, die noch zu keinem Ergebnis geführt haben. Die Seite speichert dafür nichts:
  // Sie meldet dem Browser nur, dass Eingaben verloren gingen. Den Wortlaut der Nachfrage
  // bestimmt der Browser.
  window.addEventListener("beforeunload", function (e) {
    var abgeschlossen = schritt === "ergebnis" || schritt === "abschluss";
    if (abgeschlossen || Object.keys(antworten).length === 0) return;
    e.preventDefault();
    e.returnValue = "";
  });
  // Ein Klick neben einen offen gehaltenen Hilfetext schließt ihn.
  document.addEventListener("click", function (e) {
    if (schliesseHilfe && !e.target.closest(".info-knopf, .hilfe-blase")) schliesseHilfe();
  });
  // Ein Klick auf den Namen führt zur Startseite. Die bisherigen Antworten bleiben erhalten.
  document.getElementById("marke").addEventListener("click", function () { geheZu("start"); });

  // ------------------------------------------------------------ kleine DOM-Hilfen
  function el(tag, klasse, text) {
    var e = document.createElement(tag);
    if (klasse) e.className = klasse;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function anhaengen(eltern) {
    for (var i = 1; i < arguments.length; i++) if (arguments[i]) eltern.appendChild(arguments[i]);
    return eltern;
  }
  function knopf(text, klasse, aktion) {
    var b = el("button", "knopf " + (klasse || ""), text);
    b.type = "button";
    b.addEventListener("click", aktion);
    return b;
  }
  /** Setzt Werte in einen Text aus inhalte.js ein: fuelle("Stufe {stufe}", { stufe: 3 }). */
  function fuelle(text, werte) {
    return text.replace(/\{(\w+)\}/g, function (platzhalter, name) { return String(werte[name]); });
  }
  /** Kleine Liniensymbole als eingebettetes SVG. Es wird keine Bilddatei geladen. */
  var SYMBOLE = {
    dokument: ["M7 3h7l5 5v13H7z", "M14 3v5h5", "M10 13h6", "M10 17h6"],
    waage: ["M12 4v16", "M8 20h8", "M5 7h14", "M5 7l-3 7a3 3 0 0 0 6 0z", "M19 7l-3 7a3 3 0 0 0 6 0z"],
    schloss: ["M6 11h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z", "M8 11V8a4 4 0 0 1 8 0v3"],
    haken: ["M5.5 12.5l4.2 4.2L18.5 8"],
    schild: ["M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z"],
    pfeil: ["M5 12h14", "M13 6l6 6-6 6"],
    buch: ["M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z", "M5 18a2 2 0 0 1 2-2h11"],
    winkel: ["M15 6l-6 6 6 6"],
    rechts: ["M9 6l6 6-6 6"],
    flagge: ["M5 21V4", "M5 4h12l-2.5 4 2.5 4H5"],
    info: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M12 11v5", "M12 8h.01"],
    kreuz: ["M6 6l12 12", "M18 6L6 18"],
    extern: ["M14 4h6v6", "M20 4l-9 9", "M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"],
    liste: ["M9 6h11", "M9 12h11", "M9 18h11", "M4.5 6h.01", "M4.5 12h.01", "M4.5 18h.01"],
    ziel: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M12 12h.01"],
    balken: ["M5 20v-8", "M12 20V5", "M19 20v-5"]
  };
  function symbol(name) {
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.7");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    SYMBOLE[name].forEach(function (d) {
      var pfad = document.createElementNS(NS, "path");
      pfad.setAttribute("d", d);
      svg.appendChild(pfad);
    });
    var rahmen = el("span", "symbol symbol-" + name);
    rahmen.appendChild(svg);
    return rahmen;
  }

  function blockZu(id) {
    return I.BLOECKE.filter(function (b) { return b.id === id; })[0];
  }

  // ------------------------------------------------------------ Navigation
  /** Name des KI-Dienstes, nur zur Orientierung: der gewählte Vorschlag oder der eingegebene Name. */
  function kiDienst() { return dienstWahl === SONSTIGER ? dienstName : dienstWahl; }
  function fallFehlt() { return !kiDienst().trim() || !aufgabe.trim(); }
  function fallSchluessel() { return kiDienst().trim() + "|" + aufgabe.trim(); }
  /** true, wenn KI-Dienst oder Aufgabe nach dem Beginn geändert wurden und schon Antworten vorliegen. */
  function fallGeaendert() {
    return fallDesAssessments !== null && Object.keys(antworten).length > 0 && fallSchluessel() !== fallDesAssessments;
  }
  /**
   * Beginnt das Assessment. Wurde der Nutzungsfall geändert, gehören die bisherigen Antworten
   * zu einem anderen Fall. Sie werden verworfen, damit sie nicht unter der neuen Beschreibung
   * erscheinen. Die Startseite weist vorher darauf hin.
   */
  function beginnen() {
    if (!fallFehlt()) {
      if (fallGeaendert()) { antworten = {}; erreicht = {}; }
      fallDesAssessments = fallSchluessel();
    }
    geheZu(ERSTER_BLOCK);
  }

  /**
   * Zeile „KI-Dienst: … Nutzung: …“. Auf den Fragenseiten bleibt sie beim Scrollen sichtbar
   * und zeigt darunter den Fortschritt. Im Ergebnis nennt sie zusätzlich die Kategorie der
   * Nutzung (Antwort auf F1).
   */
  function zeichneFall(haftend, mitKategorie) {
    var zeile = el("div", haftend ? "fall-zeile fall-haftend" : "fall-zeile");
    function angabe(etikett, wert) {
      var text = el("p", "fall-text");
      anhaengen(text, el("span", "fall-etikett", etikett), document.createTextNode(" "), el("span", "fall-name", wert));
      return text;
    }
    anhaengen(zeile, angabe(T.fallDienst, kiDienst().trim()), angabe(T.fallAufgabe, aufgabe.trim()));
    if (mitKategorie) zeile.appendChild(angabe(T.fallKategorie, antwortText("F1")[0]));
    if (haftend) {
      // Hinweis rechts: Die Angaben verlassen den Browser nicht.
      var schutz = el("p", "fall-schutz");
      anhaengen(schutz, symbol("schild"), el("span", "", T.fallSchutz));
      zeile.appendChild(schutz);
    }
    return zeile;
  }

  /**
   * Fortschritt: Der Balken zeigt den Gesamtfortschritt, daneben in Prozent. Die Zahl der
   * beantworteten Fragen des Blocks wird vorgelesen und steht sichtbar in der Seitenleiste. Gezählt werden nur Fragen, die bei den bisherigen Antworten
   * gestellt werden. Die Zahlen ändern sich, wenn eine Antwort bedingte Fragen ein- oder ausblendet.
   */
  function aktualisiereFortschritt(sichtbar) {
    var balken = document.getElementById("fortschritt");
    if (!balken) return;
    function beantwortet(liste) { return liste.filter(function (f) { return antworten[f] !== undefined; }).length; }
    var block = blockZu(schritt);
    var imBlock = block.fragen.filter(function (f) { return sichtbar.indexOf(f) !== -1; });
    balken.max = sichtbar.length;
    balken.value = beantwortet(sichtbar);
    document.getElementById("fortschritt-text").textContent =
      fuelle(T.fortschritt, { beantwortet: beantwortet(imBlock), gesamt: imBlock.length });
    document.getElementById("fortschritt-gesamt").textContent =
      fuelle(T.fortschrittGesamt, { prozent: Math.round(100 * beantwortet(sichtbar) / sichtbar.length) });
    zeichneSchritte();
  }

  function geheZu(ziel) {
    // Ohne KI-Dienst und Aufgabe beginnt das Assessment nicht.
    startFehler = false;
    if (ziel !== "start" && fallFehlt()) { ziel = "start"; startFehler = true; }
    schritt = ziel;
    if (blockZu(ziel)) erreicht[ziel] = true;
    zeichne();
    window.scrollTo(0, 0);
    haupt.focus({ preventScroll: true });
    if (startFehler) {
      var offen = document.getElementById(
        !dienstWahl ? "ki-dienst" : !kiDienst().trim() ? "ki-dienst-name" : "aufgabe");
      if (offen) offen.focus();
    }
  }

  function zeichneSchritte() {
    schritteListe.textContent = "";
    var privat = R.endetNachVorpruefung(antworten);
    var sichtbar = R.sichtbar(antworten);
    var alleFertig = !privat;
    I.BLOECKE.forEach(function (b) {
      var li = el("li", "schritt");
      var aktiv = schritt === b.id;
      var erledigt = erreicht[b.id] && !aktiv;
      // abgeschlossen: besucht und alle derzeit gestellten Fragen des Blocks beantwortet
      var fertig = erledigt && !privat && offeneFragen(b).length === 0;
      if (!(fertig || (aktiv && !privat && offeneFragen(b).length === 0) || schritt === "ergebnis")) alleFertig = false;
      if (aktiv) { li.classList.add("aktiv"); li.setAttribute("aria-current", "step"); }
      if (erledigt) li.classList.add("erledigt");
      if (fertig) li.classList.add("fertig");
      var inhalt;
      if (erledigt && !(privat && b.id !== ERSTER_BLOCK)) {
        inhalt = el("button", "schritt-knopf");
        inhalt.type = "button";
        inhalt.addEventListener("click", function () { geheZu(b.id); });
      } else {
        inhalt = el("span", "schritt-knopf");
      }
      var kennung = el("span", "schritt-kennung", fertig ? "" : b.id);
      if (fertig) kennung.appendChild(symbol("haken"));
      var titel = el("span", "schritt-titel", b.titel);
      if (fertig) titel.appendChild(el("span", "nur-vorlesen", " (" + T.blockFertig + ")"));
      // Stand des Blocks rechts: „beantwortet / gestellt“
      var stand = null;
      if (!privat || b.id === ERSTER_BLOCK) {
        var imBlock = b.fragen.filter(function (f) { return sichtbar.indexOf(f) !== -1; });
        var beantwortet = imBlock.filter(function (f) { return antworten[f] !== undefined; }).length;
        stand = el("span", "schritt-stand");
        var zahl = el("span", "schritt-zahl", beantwortet + " / " + imBlock.length);
        zahl.setAttribute("aria-label", fuelle(T.fortschritt, { beantwortet: beantwortet, gesamt: imBlock.length }));
        stand.appendChild(zahl);
      }
      anhaengen(inhalt, kennung, titel);
      if (stand) inhalt.appendChild(stand);
      li.appendChild(inhalt);
      schritteListe.appendChild(li);
    });
    var li = el("li", "schritt schritt-ergebnis");
    if (schritt === "ergebnis" || schritt === "abschluss") { li.classList.add("aktiv"); li.setAttribute("aria-current", "step"); }
    // Das Ergebnis ist erreichbar, sobald alle Blöcke besucht und alle gestellten Fragen beantwortet sind.
    var erreichbar = alleFertig && schritt !== "ergebnis" && I.BLOECKE.every(function (b) { return erreicht[b.id]; });
    var s;
    if (erreichbar) {
      s = el("button", "schritt-knopf");
      s.type = "button";
      s.addEventListener("click", function () { geheZu("ergebnis"); });
    } else {
      s = el("span", "schritt-knopf");
    }
    var ziel = el("span", "schritt-kennung");
    ziel.appendChild(symbol("flagge"));
    anhaengen(s, ziel, el("span", "schritt-titel", T.ergebnis));
    li.appendChild(s);
    schritteListe.appendChild(li);
  }

  /** Zeitleiste zum Geltungsbeginn. Die Lage von „Heute“ ergibt sich aus dem Tagesdatum. */
  function zeichneTermine() {
    var Z = I.TERMINE, jetzt = new Date();
    var heute = jetzt.getFullYear() + "-" + ("0" + (jetzt.getMonth() + 1)).slice(-2) + "-" + ("0" + jetzt.getDate()).slice(-2);
    var rahmen = el("div", "termine");
    var liste = el("ol", "termine-liste");
    var gesetzt = false;
    function heuteZeile() {
      var li = el("li", "termin termin-heute");
      var datum = jetzt.getDate() + ". " + Z.monate[jetzt.getMonth()] + " " + jetzt.getFullYear();
      // Datum und Marke „Heute“ in einer Zeile
      var zeile = el("span", "termin-heute-zeile");
      anhaengen(zeile, el("span", "termin-heute-datum", datum), el("span", "termin-heute-text", Z.heute));
      li.appendChild(zeile);
      liste.appendChild(li);
      gesetzt = true;
    }
    Z.eintraege.forEach(function (t) {
      if (!gesetzt && t.datum > heute) heuteZeile();
      var li = el("li", "termin " + (t.datum <= heute ? "termin-gilt" : "termin-kommt"));
      var name = el("span", "termin-name", t.titel);
      if (t.zusatz) name.appendChild(el("span", "termin-zusatz", " " + t.zusatz));
      anhaengen(li, el("span", "termin-datum", t.anzeige), name);
      liste.appendChild(li);
    });
    if (!gesetzt) heuteZeile();
    // Verweis auf die amtliche Fassung. Die Seite selbst lädt nichts nach.
    var verweis = el("a", "termine-link");
    verweis.href = Z.link.adresse;
    verweis.target = "_blank";
    verweis.rel = "noopener noreferrer";
    verweis.setAttribute("aria-label", Z.link.text + " (" + Z.link.hinweis + ")");
    verweis.setAttribute("title", Z.quelle);
    anhaengen(verweis, el("span", "", Z.link.text), symbol("rechts"));
    anhaengen(rahmen, liste, verweis);
    return rahmen;
  }

  function zeichne() {
    schliesseHilfe = null;
    schliesseErlaeuterung = null;
    document.body.setAttribute("data-schritt", schritt);
    zeichneSchritte();
    haupt.textContent = "";
    if (schritt === "start") zeichneStart();
    else if (schritt === "ergebnis") zeichneErgebnis();
    else if (schritt === "abschluss") zeichneAbschluss();
    else zeichneBlock(blockZu(schritt));
  }

  // ------------------------------------------------------------ Startseite
  // Auf der Startseite ist der regulatorische Hintergrund auf breiten Bildschirmen zunächst ausgeklappt.
  var hintergrundOffen = !!(window.matchMedia && window.matchMedia("(min-width: 76rem)").matches);

  function zeichneStart() {
    var Z = T.start;
    // Kopfzeile mit dem Namen der Anwendung (die Leiste ist auf der Startseite ausgeblendet)
    var kopfleiste = el("header", "start-leiste");
    var kopfzeile = el("div", "start-kopfzeile");
    kopfzeile.appendChild(el("span", "start-marke", T.titel));
    kopfleiste.appendChild(kopfzeile);

    var kopf = el("div", "start-kopf");
    // Hinter dem Einleitungstext erklärt eine Info-Schaltfläche den Begriff Shadow AI.
    var einleitung = el("div", "start-einleitung");
    var einleitungText = el("p", "einleitung", T.startText);
    var shadowAi = hilfeZu("shadow-ai", T.shadowAi, T.shadowAiFrage);
    // Der zweite Satz beginnt in einer neuen Zeile, die Info-Schaltfläche steht direkt hinter „Shadow AI“.
    var zweiterSatz = el("span", "einleitung-zweiter-satz", T.startText2 + "\u00a0");
    anhaengen(zweiterSatz, shadowAi[0], document.createTextNode(T.startText3));
    einleitungText.appendChild(zweiterSatz);
    anhaengen(einleitung, einleitungText, shadowAi[1]);
    // Der letzte Teil der Überschrift ist farbig hervorgehoben, „KI-Nutzung“ wird nicht getrennt.
    var ueberschrift = el("h1", "start-titel", Z.titelAnfang + " ");
    ueberschrift.appendChild(el("span", "start-titel-akzent", Z.titelAkzent.replace("KI-Nutzung", "KI\u2011Nutzung")));
    anhaengen(kopf, el("p", "start-vorzeile", Z.vorzeile), ueberschrift, einleitung);

    var punkte = el("dl", "start-punkte");
    var punktSymbole = ["dokument", "schild", "schloss"];
    T.startPunkte.forEach(function (p, i) {
      var d = el("div", "start-punkt");
      anhaengen(d, symbol(punktSymbole[i]), el("dt", "", p.titel), el("dd", "", p.text));
      punkte.appendChild(d);
    });

    // Nutzungsfall und Start in einer Karte. Der Hinweis zum Ausfüllen steht als kurzer Absatz darüber.
    var vorab = el("section", "vorab");
    var hinweise = el("p", "vorab-text", I.EINLEITUNG.fallAnleitung);
    var feld = el("div", "vorab-start");
    var E = I.EINLEITUNG;
    /** Beschriftung, Eingabeelement, Hinweis und Fehlermeldung eines Pflichtfelds der Startseite. */
    function feldgruppe(id, titel, eingabe, hinweisText, fehlerText, fehlt) {
      var gruppe = el("div", "feld-gruppe");
      var label = el("label", "feld-titel", titel);
      label.setAttribute("for", id);
      eingabe.id = id;
      eingabe.setAttribute("aria-describedby", id + "-hinweis " + id + "-fehler");
      var hinweis = el("p", "feld-hinweis", hinweisText);
      hinweis.id = id + "-hinweis";
      var fehler = el("p", "fehlertext", fehlerText);
      fehler.id = id + "-fehler";
      fehler.hidden = !fehlt;
      if (fehlt) { eingabe.classList.add("fehlt"); eingabe.setAttribute("aria-invalid", "true"); }
      anhaengen(gruppe, label, eingabe, hinweis, fehler);
      return gruppe;
    }
    /** Nimmt die Fehlermarkierung zurück, sobald das Feld ausgefüllt ist. */
    function entferneMarkierung(eingabe) {
      document.getElementById(eingabe.id + "-fehler").hidden = true;
      eingabe.classList.remove("fehlt");
      eingabe.removeAttribute("aria-invalid");
    }
    function textfeld(id, titel, hinweisText, fehlerText, wert, schreibe, fehlt) {
      var eingabe = el("input", "feld-eingabe");
      eingabe.type = "text"; eingabe.maxLength = 60;
      eingabe.autocomplete = "off"; eingabe.required = true; eingabe.value = wert;
      eingabe.addEventListener("input", function () {
        schreibe(eingabe.value);
        if (eingabe.value.trim()) entferneMarkierung(eingabe);
      });
      eingabe.addEventListener("keydown", function (e) { if (e.key === "Enter") beginnen(); });
      return feldgruppe(id, titel, eingabe, hinweisText, fehlerText, fehlt);
    }
    /**
     * Auswahlliste für den KI-Dienst: ein leerer Eintrag, die Vorschläge aus inhalte.js und
     * „Sonstiger KI-Dienst“. Nur bei diesem letzten Eintrag erscheint das Feld für den Namen.
     */
    function dienstfelder() {
      var auswahl = el("select", "feld-eingabe");
      auswahl.required = true;
      function eintrag(wert, text) {
        var o = el("option", "", text);
        o.value = wert;
        auswahl.appendChild(o);
      }
      eintrag("", E.dienstBitteWaehlen);
      E.dienstVorschlaege.forEach(function (name) { eintrag(name, name); });
      eintrag(SONSTIGER, E.dienstSonstiger);
      auswahl.value = dienstWahl;

      var namensfeld = textfeld("ki-dienst-name", E.dienstNameTitel, E.dienstNameHinweis, E.dienstNameFehlt,
        dienstName, function (w) { dienstName = w; zeigeFallwechsel(); },
        startFehler && dienstWahl === SONSTIGER && !dienstName.trim());
      namensfeld.hidden = dienstWahl !== SONSTIGER;

      auswahl.addEventListener("change", function () {
        dienstWahl = auswahl.value;
        namensfeld.hidden = dienstWahl !== SONSTIGER;
        if (dienstWahl) entferneMarkierung(auswahl);
        zeigeFallwechsel();
      });
      return [
        feldgruppe("ki-dienst", E.dienstTitel, auswahl, E.dienstHinweis, E.dienstFehlt, startFehler && !dienstWahl),
        namensfeld
      ];
    }
    /** Ergänzt ein Textfeld um eine Schaltfläche, die die Eingabe löscht. Sie erscheint nur bei Inhalt. */
    function loeschbar(gruppe) {
      var eingabe = gruppe.querySelector("input");
      var rahmen = el("div", "feld-loeschbar");
      gruppe.insertBefore(rahmen, eingabe);
      rahmen.appendChild(eingabe);
      var leeren = el("button", "feld-leeren");
      leeren.type = "button";
      leeren.setAttribute("aria-label", T.eingabeLeeren);
      leeren.setAttribute("title", T.eingabeLeeren);
      leeren.appendChild(symbol("kreuz"));
      leeren.hidden = !eingabe.value;
      eingabe.addEventListener("input", function () { leeren.hidden = !eingabe.value; });
      leeren.addEventListener("click", function () {
        eingabe.value = "";
        aufgabe = "";
        leeren.hidden = true;
        zeigeFallwechsel();
        eingabe.focus();
      });
      rahmen.appendChild(leeren);
      return gruppe;
    }
    var dienst = dienstfelder();
    var start = knopf("", "haupt start-knopf", beginnen);
    // Hinweis, sobald ein bereits begonnener Nutzungsfall geändert wird
    var wechsel = el("p", "fall-wechsel", E.fallWechsel);
    wechsel.setAttribute("role", "status");
    wechsel.hidden = true;
    function zeigeFallwechsel() { wechsel.hidden = !fallGeaendert(); }
    anhaengen(start, symbol("pfeil"), el("span", "", T.beginnen));
    var fallHinweis = el("p", "feld-hinweis fall-hinweis");
    anhaengen(fallHinweis, symbol("info"), el("span", "", E.fallHinweis));
    // Kopf der Karte: Symbol, Überschrift und Kurzanleitung
    var kartenKopf = el("div", "vorab-kopf");
    var kartenText = el("div", "vorab-kopf-text");
    anhaengen(kartenText, el("h2", "feld-kopf", E.fallTitel), hinweise);
    anhaengen(kartenKopf, symbol("dokument"), kartenText);
    var aufgabeFeld = textfeld("aufgabe", E.aufgabeTitel, E.aufgabeHinweis, E.aufgabeFehlt,
      aufgabe, function (w) { aufgabe = w; zeigeFallwechsel(); }, startFehler && !aufgabe.trim());
    // Das Beispiel steht als Platzhalter im Feld, der Hinweis darunter wird nur vorgelesen.
    aufgabeFeld.querySelector("input").placeholder = E.aufgabePlatzhalter;
    aufgabeFeld.querySelector(".feld-hinweis").className = "feld-hinweis nur-vorlesen";
    anhaengen(feld,
      kartenKopf,
      dienst[0], dienst[1],
      loeschbar(aufgabeFeld),
      wechsel, start, fallHinweis);
    zeigeFallwechsel();
    vorab.appendChild(feld);

    // Regulatorischer Hintergrund: Zeitleiste zum Geltungsbeginn, ein- und ausklappbar
    var hintergrund = el("aside", "hintergrund");
    hintergrund.setAttribute("aria-label", I.TERMINE.titel);
    var umschalter = el("button", "hintergrund-knopf");
    umschalter.type = "button";
    umschalter.setAttribute("aria-controls", "hintergrund-inhalt");
    var inhalt = el("div", "hintergrund-inhalt");
    inhalt.id = "hintergrund-inhalt";
    anhaengen(inhalt, el("p", "hintergrund-vorzeile", Z.hintergrundVorzeile), el("h2", "hintergrund-titel", I.TERMINE.titel), el("p", "hintergrund-einleitung", I.TERMINE.einleitung), zeichneTermine());
    var lasche = el("span", "hintergrund-lasche");
    anhaengen(lasche, symbol("buch"), el("span", "hintergrund-lasche-text", Z.hintergrundVorzeile));
    anhaengen(umschalter, symbol("winkel"), lasche);
    function setzeHintergrund() {
      buehne.classList.toggle("hintergrund-zu", !hintergrundOffen);
      inhalt.hidden = !hintergrundOffen;
      umschalter.setAttribute("aria-expanded", hintergrundOffen ? "true" : "false");
      umschalter.setAttribute("aria-label", hintergrundOffen ? Z.hintergrundZu : Z.hintergrundAuf);
      umschalter.setAttribute("title", hintergrundOffen ? Z.hintergrundZu : Z.hintergrundAuf);
    }
    umschalter.addEventListener("click", function () { hintergrundOffen = !hintergrundOffen; setzeHintergrund(); });
    anhaengen(hintergrund, umschalter, inhalt);

    var spalte = el("div", "start-spalte");
    anhaengen(spalte, kopf, punkte, vorab);
    var buehne = el("div", "start-buehne");
    anhaengen(buehne, spalte, hintergrund);
    setzeHintergrund();

    // Band mit den Eckdaten des Assessments
    var band = el("ul", "start-band");
    var bandSymbole = ["liste", "ziel", "balken"];
    Z.band.forEach(function (b, i) {
      var li = el("li", "");
      var text = el("span", "start-band-text");
      anhaengen(text, el("strong", "", b.titel), el("span", "", b.text));
      anhaengen(li, symbol(bandSymbole[i]), text);
      band.appendChild(li);
    });

    var seite = el("div", "start");
    anhaengen(seite, kopfleiste, buehne, band);
    haupt.appendChild(seite);
  }

  // ------------------------------------------------------------ Fragenblock
  function zeichneBlock(block) {
    var pos = I.BLOECKE.indexOf(block);
    // Der Nutzungsfall steht über jeder Fragenseite und bleibt beim Scrollen sichtbar.
    haupt.appendChild(zeichneFall(true));
    // Kopf des Blocks: Überschrift und Beschreibung, rechts der Fortschritt.
    // Balken und Zahlen füllt aktualisiereFortschritt(), sobald die Fragen der Seite stehen.
    var kopf = el("div", "block-kopf block-karte");
    var kopfText = el("div", "block-kopf-text");
    anhaengen(kopfText,
      el("p", "block-zaehler", fuelle(T.blockZaehler, { aktuell: block.id, letzter: I.BLOECKE[I.BLOECKE.length - 1].id })),
      el("h1", "block-titel", block.titel), el("p", "block-beschreibung", block.beschreibung));
    // Balken: Gesamtfortschritt. Die Zahl des Blocks steht in der Seitenleiste und wird hier nur vorgelesen.
    var fortschritt = el("div", "fortschritt");
    var zahl = el("p", "fortschritt-text nur-vorlesen");
    zahl.id = "fortschritt-text";
    var unten = el("div", "fortschritt-unten");
    var balken = el("progress", "fortschritt-balken");
    balken.id = "fortschritt";
    balken.setAttribute("aria-labelledby", "fortschritt-gesamt");
    var gesamt = el("span", "fortschritt-gesamt");
    gesamt.id = "fortschritt-gesamt";
    anhaengen(unten, balken, gesamt);
    anhaengen(fortschritt, zahl, unten);
    anhaengen(kopf, kopfText, fortschritt);
    haupt.appendChild(kopf);

    var meldung = el("p", "sammelmeldung");
    meldung.setAttribute("role", "alert");
    meldung.hidden = true;
    haupt.appendChild(meldung);

    var formular = el("form", "fragen");
    formular.noValidate = true;
    formular.addEventListener("submit", function (e) { e.preventDefault(); });
    block.fragen.forEach(function (id) { formular.appendChild(zeichneFrage(id)); });
    haupt.appendChild(formular);

    var aktionen = el("div", "aktionen");
    var zurueck = knopf(T.zurueck, "neben", function () {
      geheZu(pos === 0 ? "start" : I.BLOECKE[pos - 1].id);
    });
    var weiter = knopf("", "haupt", function () {
      var offen = offeneFragen(block);
      if (offen.length) { zeigeFehler(block, offen, meldung); return; }
      if (R.endetNachVorpruefung(antworten)) { geheZu("abschluss"); return; }
      if (pos < I.BLOECKE.length - 1) { geheZu(I.BLOECKE[pos + 1].id); return; }
      // Vor dem Ergebnis alle Blöcke prüfen: Nach einer geänderten Antwort in einem
      // früheren Block können dort neue Fragen offen sein.
      var unvollstaendig = I.BLOECKE.filter(function (b) { return offeneFragen(b).length; })[0];
      if (unvollstaendig) {
        geheZu(unvollstaendig.id);
        zeigeFehler(unvollstaendig, offeneFragen(unvollstaendig), document.querySelector(".sammelmeldung"));
        return;
      }
      geheZu("ergebnis");
    });
    weiter.id = "weiter";
    anhaengen(aktionen, zurueck, weiter);
    haupt.appendChild(aktionen);

    aktualisiereSichtbarkeit(block);
  }

  function zeichneFrage(id) {
    var f = I.FRAGEN[id];
    var satz = el("fieldset", "frage");
    satz.id = "frage-" + id;
    var legende = el("legend", "frage-kopf");
    var fragetext = el("span", "frage-text", f.frage);
    anhaengen(legende, el("span", "frage-nr", id), fragetext);
    satz.appendChild(legende);

    if (f.hilfe) {
      // Die Info-Schaltfläche steht rechts im Kopf der Frage. Die Erläuterung erscheint direkt
      // unter der Frage und schiebt die Antworten nach unten.
      var hilfe = hilfeFeld(id, f.hilfe);
      legende.appendChild(hilfe[0]);
      satz.appendChild(hilfe[1]);
    }
    if (f.typ === "mehrfach") satz.appendChild(el("p", "frage-art", T.mehrfachHinweise[id] || T.mehrfachHinweis));

    // Nur Darstellung: höchstens drei gleich breite Spalten. Kurze Antworten stehen nebeneinander,
    // längere in zwei Spalten, sehr lange untereinander. Mehrfachlisten stehen in zwei Spalten.
    var liste = el("div", "optionen");
    var laengste = Math.max.apply(null, f.optionen.map(function (o) { return o.text.length; }));
    var anzahl = f.optionen.length;
    if (f.typ === "einfach") {
      var spalten = laengste > 60 ? 1 : laengste > 48 ? 2 : anzahl <= 3 ? anzahl : anzahl === 4 || laengste > 36 ? 2 : 3;
      liste.classList.add("optionen-sp" + spalten);
      if (laengste <= 12) liste.classList.add("optionen-kurz");
      f.optionen.forEach(function (o) { liste.appendChild(option(id, "radio", o.wert, o.text)); });
    } else {
      liste.classList.add("optionen-spalten");
      f.optionen.forEach(function (o) { liste.appendChild(option(id, "checkbox", o.wert, o.text)); });
      // „Keine“ und „Unklar“ in einem eigenen Bereich. Ihre Wahl hebt die übrigen Angaben auf (uebernehme).
      var aus = el("div", "optionen-ausschluss");
      anhaengen(aus, option(id, "checkbox", R.KEINE, f.keine), option(id, "checkbox", R.UNKLAR, T.unklar));
      liste.appendChild(aus);
    }
    satz.appendChild(liste);

    var fehler = el("p", "fehlertext", T.pflicht);
    fehler.id = "fehler-" + id;
    fehler.hidden = true;
    satz.appendChild(fehler);
    return satz;
  }

  /**
   * Absätze eines Hilfetexts. Mehrere Einträge stehen untereinander. Beginnt ein Eintrag mit
   * einer Kurzbezeichnung und Doppelpunkt, wird sie hervorgehoben.
   */
  function hilfeAbsaetze(ziel, texte) {
    (Array.isArray(texte) ? texte : [texte]).forEach(function (t) {
      var absatz = el("p", ""), pos = t.indexOf(": "), punkt = t.indexOf(". ");
      if (pos > 0 && pos <= 40 && (punkt === -1 || pos < punkt)) {
        anhaengen(absatz, el("strong", "", t.slice(0, pos + 1)), document.createTextNode(t.slice(pos + 1)));
      } else {
        absatz.textContent = t;
      }
      ziel.appendChild(absatz);
    });
  }

  /**
   * Erläuterung zu einer Frage: ein Feld unter der Frage, das die Antworten nach unten schiebt
   * und nichts überdeckt. Die Info-Schaltfläche öffnet und schließt es, Escape schließt es
   * ebenfalls. Es ist immer nur eine Erläuterung geöffnet.
   * Rückgabe: [Schaltfläche, Feld].
   */
  function hilfeFeld(id, texte) {
    var feld = el("div", "hilfe-feld");
    feld.id = "hilfe-" + id;
    feld.hidden = true;
    feld.setAttribute("role", "region");
    feld.setAttribute("aria-label", T.erlaeuterung);
    hilfeAbsaetze(feld, texte);

    var b = el("button", "info-knopf", T.infoZeichen);
    b.type = "button";
    b.setAttribute("aria-label", T.erlaeuterung);
    b.setAttribute("aria-controls", feld.id);
    b.setAttribute("aria-expanded", "false");
    function setze(offen) {
      if (offen && schliesseErlaeuterung && schliesseErlaeuterung !== schliessen) schliesseErlaeuterung();
      feld.hidden = !offen;
      b.setAttribute("aria-expanded", offen ? "true" : "false");
      if (offen) schliesseErlaeuterung = schliessen;
      else if (schliesseErlaeuterung === schliessen) schliesseErlaeuterung = null;
    }
    function schliessen() { setze(false); }
    b.addEventListener("click", function () { setze(feld.hidden); });
    [b, feld].forEach(function (element) {
      element.addEventListener("keydown", function (e) { if (e.key === "Escape" && !feld.hidden) { setze(false); b.focus(); } });
    });
    return [b, feld];
  }

  /**
   * Erklärung als Blase (Begriff Shadow AI auf der Startseite): eine Info-Schaltfläche und
   * eine Blase mit dem Text. Die Blase
   * erscheint, solange der Mauszeiger auf der Schaltfläche oder der Blase steht oder die
   * Schaltfläche den Tastaturfokus hat. Ein Klick hält sie offen, bis erneut geklickt, Escape
   * gedrückt oder neben die Blase geklickt wird. So ist der Text auch ohne Mauszeiger erreichbar.
   * bezeichnung: Name der Schaltfläche für Screenreader, sonst „Erläuterung zur Frage“.
   * Rückgabe: [Schaltfläche, Anker mit der Blase].
   */
  function hilfeZu(id, texte, bezeichnung) {
    var blase = el("div", "hilfe-blase hilfe-inhalt");
    blase.id = "hilfe-" + id;
    blase.setAttribute("role", "tooltip");
    blase.hidden = true;
    hilfeAbsaetze(blase, texte);

    var b = el("button", "info-knopf", T.infoZeichen);
    b.type = "button";
    b.setAttribute("aria-label", bezeichnung || T.erlaeuterung);
    b.setAttribute("aria-describedby", blase.id);
    b.setAttribute("aria-expanded", "false");

    var fest = false, zeiger = false, fokus = false, frist = null;
    function zeige() {
      blase.hidden = !(fest || zeiger || fokus);
      b.setAttribute("aria-expanded", blase.hidden ? "false" : "true");
    }
    function schliesse() {
      fest = false; zeiger = false; fokus = false;
      if (schliesseHilfe === schliesse) schliesseHilfe = null;
      zeige();
    }
    function zeigerDa(da) {
      window.clearTimeout(frist);
      if (da) { zeiger = true; zeige(); return; }
      // kurze Frist, damit der Zeiger von der Schaltfläche in die Blase wechseln kann
      frist = window.setTimeout(function () { zeiger = false; zeige(); }, 200);
    }
    [b, blase].forEach(function (element) {
      element.addEventListener("mouseenter", function () { zeigerDa(true); });
      element.addEventListener("mouseleave", function () { zeigerDa(false); });
    });
    b.addEventListener("focus", function () { fokus = true; zeige(); });
    b.addEventListener("blur", function () { fokus = false; zeige(); });
    b.addEventListener("click", function () {
      if (fest) { schliesse(); return; }
      if (schliesseHilfe) schliesseHilfe();
      fest = true; schliesseHilfe = schliesse;
      zeige();
    });
    b.addEventListener("keydown", function (e) { if (e.key === "Escape") schliesse(); });

    var anker = el("div", "hilfe-anker");
    anker.appendChild(blase);
    return [b, anker];
  }

  function option(frage, art, wert, text) {
    var label = el("label", "option");
    var eingabe = el("input");
    eingabe.type = art;
    eingabe.name = frage;
    eingabe.value = String(wert);
    eingabe.checked = istGewaehlt(frage, wert);
    eingabe.addEventListener("change", function () { uebernehme(frage, art, wert, eingabe.checked); });
    // Alle Antworten erscheinen in derselben Schrift, ohne Hervorhebung einzelner Teile.
    var inhalt = el("span", "option-text", text);
    anhaengen(label, eingabe, inhalt);
    return label;
  }

  function istGewaehlt(frage, wert) {
    var a = antworten[frage];
    if (Array.isArray(a)) return a.indexOf(wert) !== -1;
    return a === wert;
  }

  /** Interner Code der Antwort, für die ein Eingabefeld steht. Das Feld trägt ihn nur als Text. */
  function wertZu(frage, eingabe) {
    var werte = I.FRAGEN[frage].optionen.map(function (o) { return o.wert; }).concat([R.KEINE, R.UNKLAR]);
    return werte.filter(function (w) { return String(w) === eingabe.value; })[0];
  }

  /** Übernimmt eine Auswahl in den Zustand. „Keine“ und „Unklar“ schließen jede weitere Auswahl aus. */
  function uebernehme(frage, art, wert, gewaehlt) {
    if (art === "radio") {
      antworten[frage] = wert;
    } else if (wert === R.KEINE || wert === R.UNKLAR) {
      if (gewaehlt) antworten[frage] = wert; else delete antworten[frage];
    } else {
      var liste = Array.isArray(antworten[frage]) ? antworten[frage].slice() : [];
      var pos = liste.indexOf(wert);
      if (gewaehlt && pos === -1) liste.push(wert);
      if (!gewaehlt && pos !== -1) liste.splice(pos, 1);
      liste.sort(function (x, y) { return x > y ? 1 : x < y ? -1 : 0; });
      if (liste.length) antworten[frage] = liste; else delete antworten[frage];
    }
    // Kästchen der Frage an den Zustand angleichen (ausschließende Optionen)
    if (art === "checkbox") {
      var kaestchen = document.querySelectorAll("#frage-" + frage + " input");
      for (var i = 0; i < kaestchen.length; i++) kaestchen[i].checked = istGewaehlt(frage, wertZu(frage, kaestchen[i]));
    }
    loescheFehler(frage);
    aktualisiereSichtbarkeit(blockZu(schritt));
  }

  /** Blendet bedingte Fragen ein oder aus und verwirft Antworten ausgeblendeter Fragen. */
  function aktualisiereSichtbarkeit(block) {
    var sichtbar = R.sichtbar(antworten);
    Object.keys(antworten).forEach(function (f) {
      if (sichtbar.indexOf(f) === -1) delete antworten[f];
    });
    block.fragen.forEach(function (id) {
      var satz = document.getElementById("frage-" + id);
      var zeigen = sichtbar.indexOf(id) !== -1;
      if (satz.hidden === !zeigen) return;
      satz.hidden = !zeigen;
      if (!zeigen) {
        var eingaben = satz.querySelectorAll("input");
        for (var i = 0; i < eingaben.length; i++) eingaben[i].checked = false;
        loescheFehler(id);
      }
    });
    var weiter = document.getElementById("weiter");
    if (weiter) {
      var letzter = I.BLOECKE.indexOf(block) === I.BLOECKE.length - 1;
      weiter.textContent = R.endetNachVorpruefung(antworten) ? T.abschliessen : (letzter ? T.auswerten : T.weiter);
    }
    aktualisiereFortschritt(sichtbar);
  }

  function offeneFragen(block) {
    var sichtbar = R.sichtbar(antworten);
    return block.fragen.filter(function (id) {
      return sichtbar.indexOf(id) !== -1 && antworten[id] === undefined;
    });
  }
  function zeigeFehler(block, offen, meldung) {
    block.fragen.forEach(loescheFehler);
    offen.forEach(function (id) {
      var satz = document.getElementById("frage-" + id);
      satz.classList.add("fehlt");
      satz.setAttribute("aria-describedby", "fehler-" + id);
      document.getElementById("fehler-" + id).hidden = false;
    });
    meldung.textContent = T.pflichtSammel;
    meldung.hidden = false;
    var erste = document.getElementById("frage-" + offen[0]);
    erste.scrollIntoView({ block: "center" });
    var eingabe = erste.querySelector("input");
    if (eingabe) eingabe.focus({ preventScroll: true });
  }
  function loescheFehler(id) {
    var satz = document.getElementById("frage-" + id);
    if (!satz) return;
    satz.classList.remove("fehlt");
    satz.removeAttribute("aria-describedby");
    var fehler = document.getElementById("fehler-" + id);
    if (fehler) fehler.hidden = true;
  }

  // ------------------------------------------------------------ Abschluss nach der Vorprüfung
  function zeichneAbschluss() {
    var kopf = el("div", "block-kopf");
    kopf.appendChild(zeichneFall(false));
    kopf.appendChild(el("h1", "block-titel", T.abschlussTitel));
    var karte = el("section", "abschluss");
    karte.appendChild(el("p", "abschluss-ergebnis", I.FEST.abschluss));
    karte.appendChild(el("h2", "", T.abschlussFrage));
    I.FEST.abschlussGrund.forEach(function (t) { karte.appendChild(el("p", "", t)); });
    var aktionen = el("div", "aktionen aktionen-ergebnis");
    anhaengen(aktionen,
      knopf(T.aendern, "haupt", function () { geheZu(ERSTER_BLOCK); }),
      knopf(T.neu, "neben", neuesAssessment));
    karte.appendChild(aktionen);
    anhaengen(haupt, kopf, karte);
  }

  function neuesAssessment() {
    antworten = {}; dienstWahl = ""; dienstName = ""; aufgabe = ""; erreicht = {}; fallDesAssessments = null;
    geheZu("start");
  }

  // ------------------------------------------------------------ Ergebnis
  /** Wortlaut der gegebenen Antwort auf eine Frage. */
  function antwortText(id) {
    var f = I.FRAGEN[id], a = antworten[id];
    function wortlaut(w) {
      if (w === R.KEINE) return f.keine;
      if (w === R.UNKLAR) return T.unklar;
      var o = f.optionen.filter(function (x) { return x.wert === w; })[0];
      return o ? o.text : String(w);
    }
    return Array.isArray(a) ? a.map(wortlaut) : [wortlaut(a)];
  }

  function stufenMarke(stufe, zusatz) {
    var m = el("span", "stufe stufe-" + stufe);
    // Die Zahl bleibt für die Auswertung im Dokument. Angezeigt wird nur ein farbiger Punkt.
    var zahl = el("span", "stufe-zahl", String(stufe));
    zahl.setAttribute("aria-hidden", "true");
    anhaengen(m, zahl, el("span", "stufe-name", I.STUFEN[stufe].name));
    if (zusatz) m.classList.add(zusatz);
    return m;
  }

  /** Hinweistexte eines Regeltreffers: der Hinweis der Regel, danach die ihrer Zusätze. */
  function hinweisTexte(treffer) {
    return [treffer.hinweis]
      .concat(treffer.zusaetze.map(function (z) { return z.hinweis; }))
      .map(function (schluessel) { return I.HINWEISE[schluessel]; });
  }
  /** Fragen, deren Antworten die Regel oder einen ihrer Zusätze ausgelöst haben. */
  function ausloesendeFragen(treffer) {
    var fragen = treffer.fragen.slice();
    treffer.zusaetze.forEach(function (z) {
      z.fragen.forEach(function (f) { if (fragen.indexOf(f) === -1) fragen.push(f); });
    });
    return fragen;
  }

  /**
   * Bewertungsmatrix: eine Zeile je Bereich (Shadow AI, EU AI Act, Datenschutz), eine Spalte
   * je Reaktionsstufe. Ein farbiger Punkt zeigt die Stufe des Bereichs.
   */
  var MATRIX_REIHENFOLGE = ["S", "R", "D"];
  function zeichneMatrix(e) {
    var tabelle = el("table", "matrix");
    tabelle.setAttribute("role", "img");
    tabelle.setAttribute("aria-label", fuelle(T.matrixBeschreibung,
      { gesamt: e.gesamt, name: I.STUFEN[e.gesamt].name, R: e.R, D: e.D, S: e.S }));
    var kopf = el("tr");
    kopf.appendChild(el("th", "matrix-ecke"));
    for (var s = 1; s <= 4; s++) {
      // weiche Trennstellen, damit lange Stufennamen in schmalen Spalten sauber umbrechen
      var name = I.STUFEN[s].name.replace("Handlungsbedarf", "Handlungs\u00adbedarf").replace("Prüfbedarf", "Prüf\u00adbedarf");
      kopf.appendChild(el("th", "matrix-stufe matrix-stufe-" + s, name));
    }
    var thead = el("thead");
    thead.appendChild(kopf);
    var tbody = el("tbody");
    MATRIX_REIHENFOLGE.forEach(function (pfad) {
      var zeile = el("tr", e.bestimmend.indexOf(pfad) !== -1 ? "bestimmend" : "");
      zeile.appendChild(el("th", "matrix-bereich", I.BEREICHE[pfad]));
      for (var stufe = 1; stufe <= 4; stufe++) {
        var zelle = el("td", "");
        if (e[pfad] === stufe) zelle.appendChild(el("span", "matrix-punkt stufe-" + stufe));
        zeile.appendChild(zelle);
      }
      tbody.appendChild(zeile);
    });
    anhaengen(tabelle, thead, tbody);
    return tabelle;
  }

  function zeichneRegel(treffer) {
    // Jeder Sachverhalt ist eingeklappt. Sichtbar bleiben Name und Stufe.
    var li = el("li", "regel");
    var klapp = el("details", "regel-klapp");
    var kopf = el("summary", "regel-kopf");
    // Die Kennung der Regel dient der Dokumentation und wird nicht angezeigt.
    li.setAttribute("data-kennung", treffer.kennung);
    anhaengen(kopf, el("span", "regel-name", I.REGELNAMEN[treffer.kennung]), stufenMarke(treffer.stufe, "klein"));
    klapp.appendChild(kopf);
    li.appendChild(klapp);
    var inhalt = el("div", "regel-inhalt");
    var texte = el("div", "regel-texte");
    hinweisTexte(treffer).forEach(function (t) { texte.appendChild(el("p", "regel-text", t)); });
    inhalt.appendChild(texte);
    klapp.appendChild(inhalt);
    var fragen = ausloesendeFragen(treffer);
    if (fragen.length) {
      var dl = el("dl", "ausloeser");
      fragen.forEach(function (f) {
        var d = el("div", "ausloeser-zeile");
        var dt = el("dt");
        anhaengen(dt, el("span", "frage-nr", f), el("span", "frage-wortlaut", " " + I.FRAGEN[f].frage));
        var dd = el("dd");
        antwortText(f).forEach(function (t) { dd.appendChild(el("span", "antwort", t)); });
        anhaengen(d, dt, dd);
        dl.appendChild(d);
      });
      var rahmen = el("details", "ausloeser-rahmen");
      anhaengen(rahmen, el("summary", "", T.ausloeser), dl);
      inhalt.appendChild(rahmen);
    }
    return li;
  }

  function zeichnePfad(e, pfad) {
    // Jeder Bereich ist eine Karte: Name, Stufe, Bedeutung der Stufe, darunter die Sachverhalte
    // zum Aufklappen.
    var abschnitt = el("section", "pfad pfad-" + pfad.toLowerCase());
    abschnitt.setAttribute("data-pfad", pfad);
    var kopf = el("div", "pfad-kopf");
    anhaengen(kopf, el("h2", "", I.PFADE[pfad]), stufenMarke(e[pfad]));
    var erklaerung = pfad === "S" ? T.shadowStufe[e.S] : I.STUFEN[e[pfad]].bedeutung;
    anhaengen(abschnitt, kopf, el("p", "pfad-erklaerung", erklaerung));
    var treffer = e.treffer.filter(function (t) { return t.pfad === pfad; });
    zeichnePfadInhalt(e, pfad, treffer, abschnitt);
    return abschnitt;
  }

  function zeichnePfadInhalt(e, pfad, treffer, abschnitt) {

    // S-Pfad: die vier Risikofelder untereinander. Ein Feld mit greifender Regel lässt sich
    // aufklappen und zeigt dort Hinweis und Auslöser. Ein Feld ohne Regel steht als einfache Zeile.
    if (pfad === "S") {
      var felder = el("ul", "felder");
      R.FELDER.forEach(function (f) {
        var t = treffer.filter(function (x) { return x.kennung === f; })[0];
        if (t) { felder.appendChild(zeichneRegel(t)); return; }
        var li = el("li", "feld-zeile");
        li.setAttribute("data-kennung", f);
        anhaengen(li, el("span", "feld-name", I.REGELNAMEN[f]), stufenMarke(e.felder[f], "klein"));
        felder.appendChild(li);
      });
      abschnitt.appendChild(felder);
      // Kombinationsregeln gehören zu keinem einzelnen Feld und folgen unter den Feldern.
      treffer = treffer.filter(function (x) { return R.FELDER.indexOf(x.kennung) === -1; });
      if (treffer.length) {
        var kombi = el("ul", "regeln regeln-kombination");
        treffer.forEach(function (t) { kombi.appendChild(zeichneRegel(t)); });
        abschnitt.appendChild(kombi);
      }
      return abschnitt;
    }

    // Ohne greifende Regel genügen Stufe und Erklärung. Ein eigener Hinweis entfällt.
    if (treffer.length) {
      // EU AI Act und Datenschutz: die Sachverhalte gesammelt zum Aufklappen
      var klapp = el("details", "pfad-klapp");
      klapp.appendChild(el("summary", "pfad-klapp-kopf", fuelle(T.sachverhalteAnzahl, { anzahl: treffer.length })));
      var liste = el("ul", "regeln");
      treffer.forEach(function (t) { liste.appendChild(zeichneRegel(t)); });
      klapp.appendChild(liste);
      abschnitt.appendChild(klapp);
    }
    return abschnitt;
  }

  /**
   * Info-Schaltfläche mit Erklärung der zuständigen Stelle. Ein Klick blendet den Text ein
   * und wieder aus. Rückgabe: [Schaltfläche, Textabsatz].
   */
  var infoZaehler = 0;
  function infoStelle() {
    var id = "info-" + (++infoZaehler);
    var b = el("button", "info-knopf", T.infoZeichen);
    b.type = "button";
    b.setAttribute("aria-label", T.infoStelle);
    b.setAttribute("title", T.infoStelle);
    b.setAttribute("aria-expanded", "false");
    b.setAttribute("aria-controls", id);
    var text = el("p", "info-text", I.FEST.zustaendigeStelle);
    text.id = id; text.hidden = true;
    b.addEventListener("click", function () {
      text.hidden = !text.hidden;
      b.setAttribute("aria-expanded", text.hidden ? "false" : "true");
    });
    return [b, text];
  }

  /** Satz dazu, welcher Bereich das Gesamtergebnis bestimmt (Tabelle B.1). */
  function herkunftGesamt(e) {
    // Stufe 1: Kein Bereich hebt das Ergebnis an (Tabelle B.1).
    if (!e.bestimmend.length) return I.FEST.gesamtKeinBereich;
    var namen = e.bestimmend.map(function (p) { return I.BEREICHE[p]; });
    if (namen.length === 1) return fuelle(I.FEST.gesamtEinBereich, { bereiche: namen[0] });
    var liste = namen.slice(0, -1).join(", ") + T.aufzaehlungUnd + namen[namen.length - 1];
    return fuelle(I.FEST.gesamtMehrereBereiche, { bereiche: liste });
  }

  /** Wortlaut einer Handlungsempfehlung je nach Stand der Schutzmaßnahme (Tabelle B.5). */
  function empfehlungsText(name, zustand) {
    var texte = I.EMPFEHLUNGEN[name];
    if (zustand === null) return texte.text;
    return zustand === R.ZUSTAND.VORHANDEN ? texte.vorhanden : texte.fehlt;
  }

  function zeichneErgebnis() {
    var e;
    try {
      e = R.auswerten(antworten);
    } catch (fehler) {
      // Sollte nicht eintreten, weil jeder Block seine Pflichtfelder prüft.
      anhaengen(haupt, el("h1", "block-titel", T.ergebnis), el("p", "sammelmeldung", String(fehler.message)));
      haupt.appendChild(knopf(T.aendern, "neben", function () { geheZu(ERSTER_BLOCK); }));
      return;
    }
    if (e.abschluss) { geheZu("abschluss"); return; }

    // Reihenfolge: Nutzungsfall, Gesamtergebnis, offene Angaben, nächste Schritte,
    // organisatorische Einordnung, Begründung je Bewertungspfad, Aktionen
    anhaengen(haupt,
      zeichneErgebnisKopf(), zeichneErgebnisDatum(), el("p", "vorbehalt", I.FEST.kopf),
      zeichneGesamt(e), zeichneOffeneAngaben(e), zeichneEmpfehlungen(e), zeichneEinordnung(e), zeichneWarum(e),
      zeichneErgebnisAktionen(), el("p", "fuss", T.fuss));
  }

  /** „Warum dieses Ergebnis?“: die drei Bewertungspfade, Risikofaktoren zuerst. */
  function zeichneWarum(e) {
    var warum = el("section", "warum");
    var nebenbereiche = el("div", "nebenbereiche");
    anhaengen(nebenbereiche, zeichnePfad(e, "R"), zeichnePfad(e, "D"));
    anhaengen(warum, el("h2", "", T.warumTitel), el("p", "regelbasis-hinweis", T.regelbasisHinweis),
      zeichnePfad(e, "S"), nebenbereiche);
    return warum;
  }

  /** Widersprüche und Wissenslücken gemeinsam. Ohne beides entfällt der Abschnitt. */
  function zeichneOffeneAngaben(e) {
    var teile = [zeichneWidersprueche(e), zeichneLuecken(e)].filter(function (t) { return t; });
    if (!teile.length) return null;
    var offen = el("section", "offene" + (e.widersprueche.length ? " mit-widerspruch" : ""));
    offen.appendChild(el("h2", "", T.offeneTitel));
    teile.forEach(function (t) { offen.appendChild(t); });
    return offen;
  }

  function zeichneErgebnisKopf() {
    var kopf = el("div", "block-kopf");
    anhaengen(kopf, zeichneFall(false, true), el("h1", "block-titel", T.ergebnisTitel));
    return kopf;
  }

  function zeichneErgebnisDatum() {
    var jetzt = new Date();
    return el("p", "datum", fuelle(T.erstellt, {
      datum: jetzt.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }),
      zeit: jetzt.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
      stand: I.STAND
    }));
  }

  function zeichneGesamt(e) {
    var gesamt = el("section", "gesamt stufe-rahmen-" + e.gesamt + " gesamt-farbe-" + e.gesamt);
    var gesamtText = el("div", "gesamt-text");
    var bedeutung = el("p", "gesamt-bedeutung", I.STUFEN[e.gesamt].bedeutung);
    anhaengen(gesamtText,
      el("h2", "gesamt-titel", T.gesamtTitel),
      zeichneGesamtStufe(e),
      bedeutung);
    // Nennt die Bedeutung der Stufe die zuständige Stelle, erklärt die Info-Schaltfläche sie.
    if (I.ERKLAERUNG_STELLE.stufen.indexOf(e.gesamt) !== -1) {
      var info = infoStelle();
      anhaengen(bedeutung, document.createTextNode(" "), info[0]);
      gesamtText.appendChild(info[1]);
    }
    gesamtText.appendChild(el("p", "gesamt-regel", herkunftGesamt(e)));
    anhaengen(gesamt, gesamtText, zeichneMatrix(e));
    return gesamt;
  }

  /** „Stufe 4 von 4: Eskalation“, der Name der Stufe in ihrer Farbe. */
  function zeichneGesamtStufe(e) {
    var text = fuelle(T.gesamtStufe, { stufe: e.gesamt, name: I.STUFEN[e.gesamt].name });
    var trenner = text.lastIndexOf(": ");
    var p = el("p", "gesamt-stufe", text.slice(0, trenner + 2));
    p.appendChild(el("span", "gesamt-stufe-name", text.slice(trenner + 2)));
    return p;
  }

  function zeichneEinordnung(e) {
    // Organisatorische Einordnung: Status als Stempel neben der Überschrift, darunter die Begründung
    var ein = el("section", "einordnung einordnung-" + ({ "Shadow AI": "shadow", "keine Shadow AI": "keine", "unklar": "unklar" }[e.einordnung] || "pruefung"));
    var text = I.EINORDNUNG[e.einordnung];
    var kopf = el("div", "einordnung-kopf");
    anhaengen(kopf, el("h2", "", T.einordnungTitel), el("p", "einordnung-titel", text.titel));
    anhaengen(ein, kopf, el("p", "einordnung-text", text.text));
    if (text.hinweis) ein.appendChild(el("p", "einordnung-hinweis", text.hinweis));
    if (e.freigabezusatz || e.shadowzusatz) {
      var wichtig = el("div", "wichtig");
      wichtig.appendChild(el("p", "wichtig-titel", T.wichtig));
      if (e.freigabezusatz) wichtig.appendChild(el("p", "zusatz zusatz-freigabe", I.FEST.freigabezusatz));
      // Bei jeder Einordnung als Shadow AI: Hinweis, dass die Stufe keine Freigabe ersetzt.
      if (e.shadowzusatz) wichtig.appendChild(el("p", "zusatz zusatz-shadow", I.FEST.shadowZusatz));
      ein.appendChild(wichtig);
    }
    return ein;
  }

  function zeichneLuecken(e) {
    // Ohne Wissenslücken entfällt der Abschnitt.
    if (!e.luecken.length) return null;
    var luecken = el("section", "luecken");
    luecken.appendChild(el("h3", "", T.lueckenTitel));
    luecken.appendChild(el("p", "", I.FEST.luecken));
    var ul = el("ul", "luecken-liste");
    e.luecken.forEach(function (f) {
      var li = el("li");
      anhaengen(li, el("span", "frage-nr", f), document.createTextNode(" " + I.FRAGEN[f].frage));
      ul.appendChild(li);
    });
    luecken.appendChild(ul);
    return luecken;
  }

  /** Widersprüchliche Angaben (Abschnitt 5.3.4). Erscheinen nur, wenn welche vorliegen. */
  function zeichneWidersprueche(e) {
    if (!e.widersprueche.length) return null;
    var abschnitt = el("section", "widersprueche");
    abschnitt.appendChild(el("h3", "", T.widerspruecheTitel));
    abschnitt.appendChild(el("p", "", I.FEST.widersprueche));
    var ul = el("ul", "widerspruch-liste");
    e.widersprueche.forEach(function (kennung) {
      var w = I.WIDERSPRUECHE[kennung];
      var li = el("li", "widerspruch");
      li.setAttribute("data-kennung", kennung);
      w.fragen.forEach(function (f) { anhaengen(li, el("span", "frage-nr", f), document.createTextNode(" ")); });
      li.appendChild(document.createTextNode(w.text));
      ul.appendChild(li);
    });
    abschnitt.appendChild(ul);
    return abschnitt;
  }

  /**
   * Text zum Anlass einer Empfehlung. Den Anlass selbst bestimmt regeln.js (Tabelle 18).
   * Platzhalter {stufe} steht für den Namen des Gesamtergebnisses.
   */
  function anlassText(anlass, e) {
    return fuelle(I.EMPFEHLUNG_GRUND[anlass.grund], { stufe: I.STUFEN[e.gesamt].name });
  }

  function zeichneEmpfehlung(m, e) {
    var li = el("li", "empfehlung");
    var kopfzeile = el("div", "empfehlung-kopf");
    li.setAttribute("data-kennung", m.kennung);
    var titel = I.EMPFEHLUNG_TITEL[m.kennung];
    kopfzeile.appendChild(el("h3", "empfehlung-titel", m.zustand === null ? titel.text : m.zustand === R.ZUSTAND.VORHANDEN ? titel.vorhanden : titel.fehlt));
    if (m.zustand !== null) {
      var marke = el("span", "zustand zustand-" + m.zustand,
        fuelle(T.etikett, { massnahme: I.MASSNAHMEN[m.kennung], zustand: I.ZUSTAENDE[m.zustand] }));
      marke.setAttribute("data-zustand", m.zustand);
      kopfzeile.appendChild(marke);
    } else {
      // Empfehlung ohne Schutzmaßnahme (E7): Das Etikett nennt den Anlass.
      kopfzeile.appendChild(el("span", "anlass-marke", I.MASSNAHMEN[m.kennung]));
    }
    if (I.ERKLAERUNG_STELLE.empfehlungen.indexOf(m.kennung) !== -1) {
      var info = infoStelle();
      anhaengen(kopfzeile, info[0], info[1]);
    }
    anhaengen(li, kopfzeile, el("p", "empfehlung-text", empfehlungsText(m.kennung, m.zustand)));
    m.zusaetze.forEach(function (name) {
      li.appendChild(el("p", "empfehlung-zusatz", empfehlungsText(name, m.zustand)));
    });
    // Freigabe, Alternative und Unternehmenszugang: kurze Erklärung des Unterschieds
    if (I.EMPFEHLUNG_ERKLAERUNG[m.kennung]) li.appendChild(el("p", "empfehlung-erklaerung", I.EMPFEHLUNG_ERKLAERUNG[m.kennung]));
    // Der Anlass ist eingeklappt und erscheint nur auf Wunsch. Er nennt die auslösenden Sachverhalte.
    var grund = el("details", "empfehlung-grund");
    anhaengen(grund, el("summary", "", T.warum), el("p", "", anlassText(m.anlass, e)));
    if (m.anlass.sachverhalte.length) {
      // Beim Gesamtergebnis und bei der zuständigen Stelle leitet ein Satz die Liste ein.
      if (m.anlass.grund === "gesamt" || m.anlass.grund === "stelle") grund.appendChild(el("p", "grund-vorspann", I.EMPFEHLUNG_GRUND.sachverhalte));
      var ul = el("ul", "grund-liste");
      m.anlass.sachverhalte.forEach(function (k) { ul.appendChild(el("li", "", I.SACHVERHALT_KURZ[k])); });
      grund.appendChild(ul);
    }
    li.appendChild(grund);
    return li;
  }

  function zeichneEmpfehlungen(e) {
    var emp = el("section", "empfehlungen");
    emp.appendChild(el("h2", "", T.empfehlungenTitel));
    if (!e.empfehlungen.length) {
      emp.appendChild(el("p", "leer", T.keineEmpfehlungen));
      return emp;
    }
    emp.appendChild(el("p", "empfehlungen-einleitung", I.FEST.empfehlungenEinleitung));
    var liste = el("ul", "empfehlungen-liste");
    e.empfehlungen.forEach(function (m) { liste.appendChild(zeichneEmpfehlung(m, e)); });
    emp.appendChild(liste);
    return emp;
  }

  function zeichneErgebnisAktionen() {
    var aktionen = el("div", "aktionen aktionen-ergebnis");
    anhaengen(aktionen,
      knopf(T.drucken, "haupt", function () { window.print(); }),
      knopf(T.aendern, "neben", function () { geheZu(ERSTER_BLOCK); }),
      knopf(T.neu, "neben", neuesAssessment));
    return aktionen;
  }

  // ------------------------------------------------------------ Druck auf eine Seite
  // Vor dem Drucken wird die Ergebnisseite in eine kompakte Anordnung gebracht (stil.css,
  // body.druck) und so verkleinert, dass sie auf eine A4-Seite passt.
  var SEITENHOEHE = (297 - 2 * 10) * 96 / 25.4;      // A4 hoch, 10 mm Rand, in CSS-Pixeln
  var KLEINSTER_MASSSTAB = 0.6;                       // darunter wäre die Schrift nicht mehr lesbar
  window.addEventListener("beforeprint", function () {
    if (schritt !== "ergebnis") return;
    document.body.classList.add("druck");
    // Im Ausdruck stehen alle Sachverhalte ausgeklappt.
    Array.prototype.forEach.call(haupt.querySelectorAll("details.regel-klapp, details.pfad-klapp, details.ausloeser-rahmen"), function (d) {
      d.dataset.warOffen = d.open ? "1" : "0"; d.open = true;
    });
    haupt.style.zoom = "";
    // Maßstab schrittweise verkleinern. Die Breite wächst im Gegenzug, damit die
    // Seite voll genutzt wird und der Text möglichst groß bleibt.
    var massstab = 1;
    while (true) {
      haupt.style.width = (190 / massstab) + "mm";
      if (haupt.scrollHeight * massstab <= SEITENHOEHE * 0.98 || massstab <= KLEINSTER_MASSSTAB) break;
      massstab = Math.round((massstab - 0.02) * 100) / 100;
    }
    if (massstab < 1) haupt.style.zoom = String(massstab);
  });
  window.addEventListener("afterprint", function () {
    document.body.classList.remove("druck");
    Array.prototype.forEach.call(haupt.querySelectorAll("details.regel-klapp, details.pfad-klapp, details.ausloeser-rahmen"), function (d) {
      if (d.dataset.warOffen) { d.open = d.dataset.warOffen === "1"; delete d.dataset.warOffen; }
    });
    haupt.style.zoom = "";
    haupt.style.width = "";
  });

  zeichne();
})();
