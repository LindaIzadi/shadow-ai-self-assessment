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

  var schliesseErlaeuterung = null;   // schließt die geöffnete Erläuterung einer Frage

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
    auge: ["M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12z", "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M4 4l16 16"],
    info: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M12 11v5", "M12 8h.01"],
    kreuz: ["M6 6l12 12", "M18 6L6 18"],
    extern: ["M14 4h6v6", "M20 4l-9 9", "M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"],
    liste: ["M9 6h11", "M9 12h11", "M9 18h11", "M4.5 6h.01", "M4.5 12h.01", "M4.5 18h.01"],
    ziel: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M12 12h.01"],
    balken: ["M5 20v-8", "M12 20V5", "M19 20v-5"],
    herunterladen: ["M12 4v11", "M7 10l5 5 5-5", "M5 20h14"],
    erneut: ["M19.5 12a7.5 7.5 0 1 1-2.2-5.3", "M19.5 4.5v4.2h-4.2"],
    plus: ["M12 5v14", "M5 12h14"],
    gebaeude: ["M3.5 20.5h17", "M5.5 20.5V4.5h9v16", "M14.5 9.5h4v11", "M8.5 8h3", "M8.5 11.5h3", "M8.5 15h3", "M16.5 13h.01", "M16.5 16.5h.01"],
    stift: ["M4 20h4L18.6 9.4a2.1 2.1 0 0 0-3-3L5 17z", "M13.8 8.2l3 3"],
    tausch: ["M4 8h15", "M15.5 4.5L19 8l-3.5 3.5", "M20 16H5", "M8.5 12.5L5 16l3.5 3.5"],
    warnung: ["M12 4.5L3 19.5h18z", "M12 10v4", "M12 17h.01"],
    zahnrad: ["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"],
    hut: ["M22 10L12 5 2 10l10 5 10-5z", "M6 12v5c3 3 9 3 12 0v-5"],
    lupe: ["M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z", "M20.5 20.5l-4.6-4.6"],
    raster: ["M4 4.5h6.5v6.5H4z", "M13.5 6h6.5", "M13.5 9.5h4.5", "M4 14h6.5v5.5H4z", "M13.5 15h6.5", "M13.5 18.5h4.5"]
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
      // Kreis ohne Nummer, bei abgeschlossenem Block mit Haken
      var kennung = el("span", "schritt-kennung");
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

  function zeichne() {
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

  /** Verweis auf eine externe Seite. Er öffnet sich nur auf Klick in einem neuen Fenster. */
  function verweisNach(link, klasse) {
    var a = el("a", klasse);
    a.href = link.adresse;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.setAttribute("aria-label", link.text + " (" + link.hinweis + ")");
    anhaengen(a, el("span", "", link.text), symbol("rechts"));
    return a;
  }

  /**
   * Startseite rechts: „Wissenswertes vor dem Start“ mit drei kompakten Themen. Ein Klick öffnet
   * die kurze Erklärung unter dem Thema. Geöffnete Themen bleiben offen, bis sie erneut angeklickt
   * werden. Zu Beginn ist keines geöffnet.
   */
  var offeneThemen = {};
  function zeichneWissen() {
    var W = I.WISSEN;
    var bereich = el("aside", "hintergrund wissen");
    bereich.setAttribute("aria-labelledby", "wissen-titel");
    var titel = el("h2", "wissen-titel", W.titel);
    titel.id = "wissen-titel";
    anhaengen(bereich, titel, el("p", "wissen-einleitung", W.einleitung));
    var symbole = { "shadow-ai": "auge", "eu-ai-act": "waage", "datenschutz": "schild" };
    var liste = el("div", "wissen-liste");
    var themen = [];
    W.themen.forEach(function (t) {
      var thema = el("section", "wissen-thema");
      var kopf = el("button", "wissen-kopf");
      kopf.type = "button";
      kopf.setAttribute("aria-controls", "wissen-" + t.id);
      var texte = el("span", "wissen-kopf-text");
      anhaengen(texte, el("span", "wissen-thema-titel", t.titel), el("span", "wissen-untertitel", t.untertitel));
      anhaengen(kopf, symbol(symbole[t.id]), texte, symbol("winkel"));
      var inhalt = el("div", "wissen-inhalt");
      inhalt.id = "wissen-" + t.id;
      t.text.forEach(function (absatz) { inhalt.appendChild(el("p", "", absatz)); });
      // Weiterführende Links untereinander, jeweils mit Symbol für einen externen Link
      if (t.links.length) {
        var verweise = el("p", "wissen-links");
        var zeile = el("span", "wissen-links-zeile");
        t.links.forEach(function (link) {
          var a = verweisNach(link, "wissen-link");
          // Symbol für einen externen Link. Es bleibt mit dem letzten Wort in einer Zeile.
          var woerter = link.text.split(" ");
          var ende = el("span", "wissen-link-ende", woerter.pop());
          ende.appendChild(symbol("extern"));
          while (a.firstChild) a.removeChild(a.firstChild);
          anhaengen(a, document.createTextNode(woerter.length ? woerter.join(" ") + " " : ""), ende);
          zeile.appendChild(a);
        });
        verweise.appendChild(zeile);
        inhalt.appendChild(verweise);
      }
      anhaengen(thema, kopf, inhalt);
      liste.appendChild(thema);
      themen.push({ id: t.id, thema: thema, kopf: kopf, inhalt: inhalt });
      kopf.addEventListener("click", function () {
        offeneThemen[t.id] = !offeneThemen[t.id];
        setze();
      });
    });
    function setze() {
      themen.forEach(function (x) {
        var offen = !!offeneThemen[x.id];
        x.inhalt.hidden = !offen;
        x.kopf.setAttribute("aria-expanded", offen ? "true" : "false");
        x.thema.classList.toggle("offen", offen);
      });
    }
    setze();
    bereich.appendChild(liste);
    return bereich;
  }

  function zeichneStart() {
    var Z = T.start;
    // Kopfzeile mit dem Namen der Anwendung (die Leiste ist auf der Startseite ausgeblendet)
    var kopfleiste = el("header", "start-leiste");
    var kopfzeile = el("div", "start-kopfzeile");
    kopfzeile.appendChild(el("span", "start-marke", T.titel));
    kopfleiste.appendChild(kopfzeile);

    var kopf = el("div", "start-kopf");
    var einleitung = el("div", "start-einleitung");
    var einleitungText = el("p", "einleitung", T.startText);
    // Der zweite Satz beginnt in einer neuen Zeile.
    einleitungText.appendChild(el("span", "einleitung-zweiter-satz", T.startText2));
    einleitung.appendChild(einleitungText);
    // Der letzte Teil der Überschrift ist farbig hervorgehoben, „KI-Nutzung“ wird nicht getrennt.
    var ueberschrift = el("h1", "start-titel", Z.titelAnfang + " ");
    ueberschrift.appendChild(el("span", "start-titel-akzent", Z.titelAkzent.replace("KI-Nutzung", "KI\u2011Nutzung")));
    kopf.appendChild(ueberschrift);

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
      // Das Namensfeld steht ohne eigene Überschrift direkt unter der Auswahl. Beschriftung und
      // Hinweis bleiben für Bildschirmleser erhalten, das Feld zeigt einen Platzhalter.
      namensfeld.querySelector(".feld-titel").classList.add("nur-vorlesen");
      namensfeld.querySelector(".feld-hinweis").classList.add("nur-vorlesen");
      namensfeld.querySelector("input").placeholder = E.dienstNamePlatzhalter;
      namensfeld.classList.add("feld-gruppe-name");

      auswahl.addEventListener("change", function () {
        dienstWahl = auswahl.value;
        namensfeld.hidden = dienstWahl !== SONSTIGER;
        if (dienstWahl) entferneMarkierung(auswahl);
        zeigeFallwechsel();
      });
      var spalte = el("div", "dienst-spalte");
      var auswahlGruppe = feldgruppe("ki-dienst", E.dienstTitel, auswahl, E.dienstHinweis, E.dienstFehlt, startFehler && !dienstWahl);
      // Der Hinweis auf „Sonstiger KI-Dienst“ entfällt, sobald dieser Eintrag gewählt ist.
      var auswahlHinweis = auswahlGruppe.querySelector(".feld-hinweis");
      auswahlHinweis.hidden = dienstWahl === SONSTIGER;
      auswahl.addEventListener("change", function () { auswahlHinweis.hidden = dienstWahl === SONSTIGER; });
      anhaengen(spalte, auswahlGruppe, namensfeld);
      return spalte;
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
    // Die Beispiele stehen als Platzhalter im Feld, der Hinweis darunter ist sichtbar.
    aufgabeFeld.querySelector("input").placeholder = E.aufgabePlatzhalter;
    anhaengen(feld,
      kartenKopf,
      dienst,
      loeschbar(aufgabeFeld),
      wechsel, start, fallHinweis);
    zeigeFallwechsel();
    vorab.appendChild(feld);

    // Vorzeile und Überschrift stehen über der linken Spalte. „Wissenswertes vor dem Start“
    // beginnt rechts auf derselben Höhe wie die Überschrift.
    var spalte = el("div", "start-spalte");
    anhaengen(spalte, einleitung, punkte, vorab);
    var buehne = el("div", "start-buehne");
    anhaengen(buehne, el("p", "start-vorzeile", Z.vorzeile), kopf, spalte, zeichneWissen());

    // Band mit den Eckdaten des Assessments
    var band = el("ul", "start-band");
    var bandSymbole = ["liste", "ziel", "balken"];
    Z.band.forEach(function (b, i) {
      var li = el("li", "");
      var text = el("span", "start-band-text");
      text.appendChild(el("strong", "", b.titel));
      if (b.text) text.appendChild(el("span", "", b.text));
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
    block.fragen.forEach(function (id) {
      formular.appendChild(zeichneFrage(id));
      if (T.entfaellt[id]) {
        var entfaellt = el("p", "frage-entfaellt");
        entfaellt.id = "entfaellt-" + id;
        entfaellt.hidden = true;
        anhaengen(entfaellt, symbol("info"), el("span", "", T.entfaellt[id]));
        formular.appendChild(entfaellt);
      }
    });
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

    // Auswahlanweisung: sagt, was zu tun ist, und bleibt unter der Frage sichtbar.
    if (f.typ === "mehrfach") satz.appendChild(el("p", "frage-art", T.mehrfachHinweise[id] || T.mehrfachHinweis));
    if (f.hilfe) {
      // Hilfetext: erklärt Begriffe und Voraussetzungen. Die Info-Schaltfläche steht rechts im
      // Kopf der Frage, der Text erscheint unter der Auswahlanweisung und schiebt die Antworten nach unten.
      var hilfe = hilfeFeld(id, f.hilfe);
      legende.appendChild(hilfe[0]);
      satz.appendChild(hilfe[1]);
    }

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
   * Inhalt eines Hilfetexts. Jeder Eintrag ist ein Absatz. Beginnt ein Eintrag mit einer
   * Kurzbezeichnung und Doppelpunkt, wird sie zur Zwischenüberschrift über dem Absatz.
   * Aufeinanderfolgende Einträge, die mit „- “ beginnen, bilden eine Aufzählung.
   */
  function hilfeAbsaetze(ziel, texte) {
    // Ein Absatz ohne Begriff nach Begriffsabsätzen ist ein Zusatzhinweis und steht kursiv.
    var nachBegriff = false;
    var liste = null;
    (Array.isArray(texte) ? texte : [texte]).forEach(function (t) {
      if (t.indexOf("- ") === 0) {
        if (!liste) liste = ziel.appendChild(el("ul", "hilfe-liste"));
        liste.appendChild(el("li", "", t.slice(2)));
        return;
      }
      liste = null;
      var pos = t.indexOf(": "), punkt = t.indexOf(". ");
      // Mit „_“ beginnender Absatz: Querverweis oder Zusatzhinweis, kursiv ohne Begriff
      if (t.charAt(0) === "_") {
        ziel.appendChild(el("p", "hilfe-zusatz", t.slice(1)));
        return;
      }
      // Warnhinweis: kursiv, „Achtung:“ fett vorangestellt
      if (t.indexOf(T.achtung + " ") === 0) {
        var warnung = el("p", "hilfe-zusatz");
        anhaengen(warnung, el("strong", "hilfe-titel", T.achtung), document.createTextNode(t.slice(T.achtung.length)));
        ziel.appendChild(warnung);
        return;
      }
      if (pos > 0 && pos <= 60 && (punkt === -1 || pos < punkt)) {
        // Begriff fett am Anfang des Absatzes, die Erklärung folgt in derselben Zeile.
        var abschnitt = el("p", "hilfe-abschnitt");
        anhaengen(abschnitt, el("strong", "hilfe-titel", t.slice(0, pos + 1)), document.createTextNode(" " + t.slice(pos + 2)));
        ziel.appendChild(abschnitt);
        nachBegriff = true;
      } else {
        ziel.appendChild(el("p", nachBegriff ? "hilfe-zusatz" : "", t));
      }
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

  /** Bedingte Fragen je auslösender Frage (Fragenführung nach Tabelle A.2). */
  // F14 entfällt über F13 nur, wenn F12 „Unklar“ ist. Bei F12 „Ja“ wird F14 immer gestellt.
  var ENTFAELLT = { F7: ["F8", "F9"], F12: ["F13", "F14", "F15", "F16", "F17"], F13: ["F14"] };

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
    // Hinweis auf entfallende Fragen: erscheint, sobald die auslösende Frage beantwortet ist
    // und alle von ihr abhängigen Fragen ausgeblendet sind.
    Object.keys(ENTFAELLT).forEach(function (ausloeser) {
      var hinweis = document.getElementById("entfaellt-" + ausloeser);
      if (!hinweis) return;
      hinweis.hidden = antworten[ausloeser] === undefined || ENTFAELLT[ausloeser].some(function (f) {
        return sichtbar.indexOf(f) !== -1;
      });
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
  /**
   * Abschluss nach der Vorprüfung bei ausschließlich privater Nutzung: Ergebnis, Begründung in
   * drei Punkten, Hinweis zur weiteren Nutzung und die beiden Aktionen.
   */
  function zeichneAbschluss() {
    var F = I.FEST;
    var kopf = el("div", "block-kopf abschluss-kopf");
    var titel = el("div", "abschluss-titel");
    anhaengen(titel, symbol("dokument"), el("h1", "block-titel", T.abschlussTitel));
    anhaengen(kopf, zeichneFall(false), titel);

    var karte = el("section", "abschluss");
    // Der erste Satz ist das Ergebnis, der zweite die Folge.
    var trenner = F.abschluss.indexOf(". ") + 1;
    var ergebnis = el("div", "abschluss-ergebnis-block");
    anhaengen(ergebnis, el("p", "abschluss-ergebnis", F.abschluss.slice(0, trenner)), el("p", "abschluss-folge", F.abschluss.slice(trenner + 1)));

    var gruende = el("ul", "abschluss-gruende");
    var symbole = ["schild", "gebaeude", "waage"];
    F.abschlussGrund.forEach(function (g, i) {
      var li = el("li", "abschluss-grund abschluss-grund-" + (i + 1));
      var texte = el("div", "");
      anhaengen(texte, el("h3", "", g.titel), textMitVerweisen("", g.text));
      anhaengen(li, symbol(symbole[i]), texte);
      gruende.appendChild(li);
    });

    var hinweis = el("div", "abschluss-hinweis");
    var hinweisText = el("div", "");
    anhaengen(hinweisText, el("p", "abschluss-hinweis-titel", F.abschlussHinweis.titel), el("p", "", F.abschlussHinweis.text));
    anhaengen(hinweis, symbol("info"), hinweisText);

    var aendern = knopf("", "haupt mit-symbol", function () { geheZu(ERSTER_BLOCK); });
    anhaengen(aendern, symbol("stift"), el("span", "", T.aendern));
    var neu = knopf("", "neben mit-symbol", neuesAssessment);
    anhaengen(neu, symbol("erneut"), el("span", "", T.neu));
    var aktionen = el("div", "aktionen abschluss-aktionen");
    anhaengen(aktionen, aendern, neu);

    anhaengen(karte, ergebnis, el("h2", "", T.abschlussFrage), gruende, hinweis, aktionen);
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

  /** Symbole der drei Bereiche, wie auf der Startseite */
  var BEREICH_SYMBOL = { S: "auge", R: "waage", D: "schild" };
  /** Reihenfolge der drei Bereiche in der Übersicht und in den Detailergebnissen */
  var BEREICH_REIHENFOLGE = ["S", "R", "D"];

  /**
   * Bewertungsmatrix: eine Zeile je Bereich (Shadow AI, EU AI Act, Datenschutz), eine Spalte
   * je Reaktionsstufe. Ein farbiger Punkt zeigt die Stufe des Bereichs.
   */
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
    BEREICH_REIHENFOLGE.forEach(function (pfad) {
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
    hinweisTexte(treffer).forEach(function (t) { texte.appendChild(textMitVerweisen("regel-text", t)); });
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

  /**
   * Detailergebnis eines Bereichs: eine aufklappbare Zeile mit Symbol, Name und Stufe. Aufgeklappt
   * folgen die Bedeutung der Stufe und die erfassten Sachverhalte mit den auslösenden Antworten.
   */
  function zeichnePfad(e, pfad) {
    var abschnitt = el("section", "pfad pfad-" + pfad.toLowerCase() + " detail detail-stufe-" + e[pfad]);
    abschnitt.setAttribute("data-pfad", pfad);
    var klapp = el("details", "pfad-detail");
    klapp.id = "detail-" + pfad;
    var kopf = el("summary", "pfad-kopf");
    anhaengen(kopf, symbol(BEREICH_SYMBOL[pfad]), el("h3", "pfad-name", I.PFADE[pfad]), stufenMarke(e[pfad]), symbol("winkel"));
    var inhalt = el("div", "detail-inhalt");
    var erklaerung = pfad === "S" ? T.shadowStufe[e.S] : I.STUFEN[e[pfad]].bedeutung;
    inhalt.appendChild(el("p", "pfad-erklaerung", erklaerung));
    var treffer = e.treffer.filter(function (t) { return t.pfad === pfad; });
    zeichnePfadInhalt(e, pfad, treffer, inhalt);
    anhaengen(klapp, kopf, inhalt);
    abschnitt.appendChild(klapp);
    return abschnitt;
  }

  /** Regeln von EU AI Act und Datenschutz in der Reihenfolge der Abschnitte 5.3.2 und 5.3.3 */
  var PFAD_REGELN = { R: ["R1", "R2", "R3", "R4", "R5"], D: ["D1", "D2", "D3", "D4", "D5"] };

  function zeichnePfadInhalt(e, pfad, treffer, abschnitt) {

    // S-Pfad: die vier Risikofelder untereinander. Ein Feld mit greifender Regel lässt sich
    // aufklappen und zeigt dort Hinweis und Auslöser. Ein Feld ohne Regel steht als einfache Zeile.
    if (pfad === "S") {
      var kombiAnzahl = treffer.filter(function (x) { return R.FELDER.indexOf(x.kennung) === -1; }).length;
      abschnitt.appendChild(el("p", "sachverhalte-titel", fuelle(T.sachverhalteAnzahl, { anzahl: R.FELDER.length + kombiAnzahl })));
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

    // EU AI Act und Datenschutz: alle geprüften Sachverhalte untereinander. Ein Sachverhalt mit
    // greifender Regel lässt sich aufklappen, einer ohne Regel steht als einfache Zeile mit Stufe 1.
    abschnitt.appendChild(el("p", "sachverhalte-titel", fuelle(T.sachverhalteAnzahl, { anzahl: PFAD_REGELN[pfad].length })));
    var liste = el("ul", "felder");
    PFAD_REGELN[pfad].forEach(function (k) {
      var t = treffer.filter(function (x) { return x.kennung === k; })[0];
      if (t) { liste.appendChild(zeichneRegel(t)); return; }
      var li = el("li", "feld-zeile");
      li.setAttribute("data-kennung", k);
      anhaengen(li, el("span", "feld-name", I.REGELNAMEN[k]), stufenMarke(1, "klein"));
      liste.appendChild(li);
    });
    abschnitt.appendChild(liste);
    return abschnitt;
  }

  /**
   * Info-Schaltfläche mit Erklärung der zuständigen Stelle. Ein Klick blendet den Text ein
   * und wieder aus. Rückgabe: [Schaltfläche, Textabsatz].
   */
  var infoZaehler = 0;
  // Die Erklärung der zuständigen Stelle erscheint auf der Ergebnisseite nur einmal, an der ersten Stelle.
  var infoStelleGezeigt = false;
  function infoStelle() { return infoKnopf(T.infoStelle, I.FEST.zustaendigeStelle); }
  /** Info-Schaltfläche mit einer kurzen Erklärung, die sich per Klick ein- und ausblendet. */
  function infoKnopf(beschriftung, erklaerung) {
    var id = "info-" + (++infoZaehler);
    var b = el("button", "info-knopf", T.infoZeichen);
    b.type = "button";
    b.setAttribute("aria-label", beschriftung);
    b.setAttribute("title", beschriftung);
    b.setAttribute("aria-expanded", "false");
    b.setAttribute("aria-controls", id);
    var text = el("p", "info-text", erklaerung);
    text.id = id; text.hidden = true;
    b.addEventListener("click", function () {
      text.hidden = !text.hidden;
      b.setAttribute("aria-expanded", text.hidden ? "false" : "true");
    });
    return [b, text];
  }

  /** Satz dazu, welcher Bereich das Gesamtergebnis bestimmt (Tabelle B.1). */
  function herkunftGesamt(e) {
    var namen = e.bestimmend.map(function (p) { return "„" + I.BEREICHE[p] + "“"; });
    if (namen.length === 1) return fuelle(I.FEST.gesamtEinBereich, { bereiche: namen[0] });
    var liste = namen.slice(0, -1).join(", ") + T.aufzaehlungUnd + namen[namen.length - 1];
    return fuelle(I.FEST.gesamtMehrereBereiche, { bereiche: liste });
  }

  /**
   * Absatz mit Text, in dem Normangaben aus I.NORMVERWEISE als externer Verweis erscheinen.
   * Gesucht wird jeweils die früheste Normangabe, bei gleichem Beginn die längste.
   * Das Symbol bleibt mit dem letzten Wort der Normangabe in einer Zeile.
   */
  function textMitVerweisen(klasse, text) {
    var p = el("p", klasse);
    var rest = text;
    var normen = Object.keys(I.NORMVERWEISE);
    for (;;) {
      var pos = -1, norm = "";
      normen.forEach(function (n) {
        var i = rest.indexOf(n);
        if (i !== -1 && (pos === -1 || i < pos || (i === pos && n.length > norm.length))) { pos = i; norm = n; }
      });
      if (pos === -1) break;
      var ziel = I.NORMVERWEISE[norm];
      var a = verweisNach({ text: norm, adresse: ziel.adresse, hinweis: ziel.hinweis }, "norm-link");
      while (a.firstChild) a.removeChild(a.firstChild);
      var woerter = norm.split(" ");
      var ende = el("span", "wissen-link-ende", woerter.pop());
      ende.appendChild(symbol("extern"));
      anhaengen(a, document.createTextNode(woerter.join(" ") + " "), ende);
      anhaengen(p, document.createTextNode(rest.slice(0, pos)), a);
      rest = rest.slice(pos + norm.length);
    }
    p.appendChild(document.createTextNode(rest));
    return p;
  }

  /**
   * Fassung je Stand der Schutzmaßnahme (Tabelle B.7). Für „unklar“ gilt eine eigene Fassung,
   * falls es sie gibt, sonst die für „fehlt“. Ohne Schutzmaßnahme (E7 bis E9) gilt die Fassung
   * zum Anlass, falls es sie gibt (E7 je Angabe in F3, E8 je Antwort auf F22), sonst „text“.
   */
  function nachZustand(texte, zustand, anlass) {
    if (zustand === null) return (anlass && (texte[anlass.fassung] || texte[anlass.grund])) || texte.text;
    if (zustand === R.ZUSTAND.VORHANDEN) return texte.vorhanden;
    return zustand === R.ZUSTAND.UNKLAR && texte.unklar ? texte.unklar : texte.fehlt;
  }
  /** Wortlaut einer Handlungsempfehlung je nach Stand der Schutzmaßnahme. */
  function empfehlungsText(name, zustand, anlass) {
    return nachZustand(I.EMPFEHLUNGEN[name], zustand, anlass);
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
    infoStelleGezeigt = false;

    // Reihenfolge: Nutzungsfall, Kopf mit Aktionen, Gesamtergebnis mit den drei Bereichen,
    // offene Angaben, empfohlene Maßnahmen, organisatorische Einordnung, Detailergebnisse
    anhaengen(haupt,
      zeichneFall(false, true), zeichneErgebnisKopf(),
      zeichneGesamt(e), zeichneOffeneAngaben(e), zeichneEmpfehlungen(e), zeichneEinordnung(e), zeichneDetails(e),
      zeichneErgebnisAktionen());
    ordneEmpfehlungen();
  }

  /**
   * Empfohlene Maßnahmen in zwei Spalten, jede Karte so hoch wie ihr Inhalt. Das Raster hat
   * sehr feine Zeilen. Jede Karte belegt so viele davon, wie ihre Höhe verlangt. Öffnet sich eine
   * Begründung, wächst nur diese Karte, die Karte daneben bleibt unverändert. Die Reihenfolge im
   * Dokument bleibt erhalten.
   */
  var ZEILE = 4;      // Höhe einer Rasterzeile in Pixeln
  function ordneEmpfehlungen() {
    var liste = haupt.querySelector(".empfehlungen-liste");
    if (!liste || document.body.classList.contains("druck")) return;
    var abstand = parseFloat(getComputedStyle(liste).getPropertyValue("--karten-abstand")) || 14;
    Array.prototype.forEach.call(liste.children, function (karte) {
      karte.style.gridRowEnd = "";
      var hoehe = karte.getBoundingClientRect().height;
      karte.style.gridRowEnd = "span " + Math.ceil((hoehe + abstand) / ZEILE);
    });
  }
  window.addEventListener("resize", function () { if (schritt === "ergebnis") ordneEmpfehlungen(); });


  /** Kopf eines Ergebnisabschnitts: Symbol, Überschrift, Einleitung und rechts optional ein Bedienelement. */
  function ergebnisAbschnittKopf(symbolName, titel, text, rechts) {
    var kopf = el("div", "abschnitt-kopf");
    var texte = el("div", "abschnitt-kopf-text");
    texte.appendChild(el("h2", "", titel));
    if (text) texte.appendChild(el("p", "abschnitt-einleitung", text));
    anhaengen(kopf, symbol(symbolName), texte);
    if (rechts) kopf.appendChild(rechts);
    return kopf;
  }

  /** Führt zu einer Frage: Block öffnen, zur Frage scrollen, erste Antwort fokussieren. */
  function zeigeFrage(f) {
    var block = I.BLOECKE.filter(function (b) { return b.fragen.indexOf(f) !== -1; })[0];
    if (!block) return;
    geheZu(block.id);
    var frage = document.getElementById("frage-" + f);
    if (!frage) return;
    frage.scrollIntoView({ block: "center" });
    var eingabe = frage.querySelector("input");
    if (eingabe) eingabe.focus({ preventScroll: true });
  }

  /** Schaltfläche „Alle Bereiche öffnen / schließen“ für die aufklappbaren Einträge eines Containers. */
  function alleOeffnenKnopf(container, auswahl) {
    var alle = el("button", "alle-oeffnen");
    alle.type = "button";
    var beschriftung = el("span", "", T.alleOeffnen);
    anhaengen(alle, beschriftung, symbol("winkel"));
    function eintraege() { return Array.prototype.slice.call(container.querySelectorAll(auswahl)); }
    function stand() {
      var offen = eintraege().every(function (d) { return d.open; });
      beschriftung.textContent = offen ? T.alleSchliessen : T.alleOeffnen;
      alle.classList.toggle("offen", offen);
      return offen;
    }
    alle.addEventListener("click", function () {
      var oeffnen = !stand();
      eintraege().forEach(function (d) { d.open = oeffnen; });
      stand();
    });
    eintraege().forEach(function (d) { d.addEventListener("toggle", stand); });
    return alle;
  }

  /** Detailergebnisse: die drei Bereiche als aufklappbare Zeilen, die Risikofaktoren zuerst. */
  function zeichneDetails(e) {
    var details = el("section", "warum details-ergebnis");
    var liste = el("div", "detail-liste");
    BEREICH_REIHENFOLGE.forEach(function (pfad) { liste.appendChild(zeichnePfad(e, pfad)); });
    anhaengen(details, ergebnisAbschnittKopf("raster", T.detailTitel, T.detailText, alleOeffnenKnopf(liste, "details.pfad-detail")), liste);
    return details;
  }

  /** Widersprüche und Wissenslücken gemeinsam. Ohne beides entfällt der Abschnitt. */
  function zeichneOffeneAngaben(e) {
    var teile = [zeichneWidersprueche(e), zeichneLuecken(e)].filter(function (t) { return t; });
    if (!teile.length) return null;
    var offen = el("section", "offene" + (e.widersprueche.length ? " mit-widerspruch" : ""));
    var anzahl = e.widersprueche.length + e.luecken.length;
    var inhalt = el("div", "offene-inhalt");
    teile.forEach(function (t) { inhalt.appendChild(t); });
    anhaengen(offen,
      ergebnisAbschnittKopf("warnung", T.offeneTitel, fuelle(anzahl === 1 ? T.offeneAnzahlEins : T.offeneAnzahl, { anzahl: anzahl }),
        alleOeffnenKnopf(inhalt, "details.offen-klapp")),
      inhalt);
    return offen;
  }

  /**
   * Erstellungsdatum. Der Stand der Regelbasis steht auf dem Bildschirm in der Seitenleiste.
   * Im Ausdruck fehlt die Seitenleiste, dort erscheint er deshalb hinter dem Datum.
   */
  function zeichneErgebnisDatum(jetzt) {
    var p = el("p", "datum", fuelle(T.erstellt, {
      datum: jetzt.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }),
      zeit: jetzt.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })
    }));
    p.appendChild(el("span", "nur-druck", " " + fuelle(T.standRegelbasis, { stand: I.STAND }) + "."));
    return p;
  }

  /** Kopf: Überschrift, Datum und Vorbehalt links, rechts Speichern und Antworten ändern. */
  function zeichneErgebnisKopf() {
    var kopf = el("div", "block-kopf ergebnis-kopf");
    var texte = el("div", "ergebnis-kopf-text");
    var jetzt = new Date();
    anhaengen(texte,
      el("h1", "block-titel", T.ergebnisTitel),
      zeichneErgebnisDatum(jetzt),
      el("p", "vorbehalt", I.FEST.kopf));
    var pdf = knopf("", "neben mit-symbol", function () { window.print(); });
    pdf.setAttribute("title", T.pdfTitel);
    anhaengen(pdf, symbol("herunterladen"), el("span", "", T.pdf));
    var aendern = knopf("", "haupt mit-symbol", function () { geheZu(ERSTER_BLOCK); });
    anhaengen(aendern, symbol("erneut"), el("span", "", T.aendern));
    var knoepfe = el("div", "aktionen ergebnis-knoepfe");
    anhaengen(knoepfe, pdf, aendern);
    anhaengen(kopf, texte, knoepfe);
    return kopf;
  }

  function zeichneGesamt(e) {
    var gesamt = el("section", "gesamt stufe-rahmen-" + e.gesamt + " gesamt-farbe-" + e.gesamt);
    var gesamtText = el("div", "gesamt-text");
    var bedeutung = el("p", "gesamt-bedeutung", I.gesamtBeschreibung(e.gesamt, antworten.F4));
    anhaengen(gesamtText,
      el("h2", "gesamt-titel", T.gesamtTitel),
      zeichneGesamtStufe(e),
      bedeutung);
    // Nennt die Bedeutung der Stufe die zuständige Stelle, erklärt die Info-Schaltfläche sie.
    if (I.ERKLAERUNG_STELLE.stufen.indexOf(e.gesamt) !== -1 && !infoStelleGezeigt) {
      infoStelleGezeigt = true;
      var info = infoStelle();
      anhaengen(bedeutung, document.createTextNode(" "), info[0]);
      gesamtText.appendChild(info[1]);
    }
    // Bei Stufe 1 bestimmt kein Bereich das Ergebnis. Die Bedeutung der Stufe sagt dann bereits alles.
    if (e.bestimmend.length) {
      var herkunft = el("p", "gesamt-regel");
      herkunft.textContent = herkunftGesamt(e);
      gesamtText.appendChild(herkunft);
    }
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
    // Überschrift und Info-Symbol stehen gemeinsam in einer Zeile, die Marke rechts.
    var titelGruppe = el("div", "einordnung-titelgruppe");
    titelGruppe.appendChild(el("h2", "", T.einordnungTitel));
    anhaengen(kopf, symbol("schild"), titelGruppe, el("p", "einordnung-titel", text.titel));
    // Aufbau: Ergebnis (Marke rechts), Begründung (Text), Einschränkung (wichtiger Hinweis)
    // Die Sätze stehen als fortlaufender Text. Nennt der Text Shadow AI, erklärt eine Info-Schaltfläche den Begriff.
    var absatz = el("p", "einordnung-text");
    var saetze = text.text.match(/[^.]+\.(\s|$)/g) || [text.text];
    saetze.forEach(function (satz) { absatz.appendChild(el("span", "satz", satz)); });
    anhaengen(ein, kopf, absatz);
    if (/Shadow AI/.test(text.text)) {
      var info = infoKnopf(T.infoShadow, I.DEFINITION_SHADOW_AI);
      titelGruppe.appendChild(info[0]);
      // Die Erklärung erscheint direkt unter der Überschrift, vor dem Text der Einordnung.
      ein.insertBefore(info[1], absatz);
    }
    // Bei freigegebener Nutzung erscheint der Hinweis nur zusammen mit dem Freigabezusatz (ab Prüfbedarf).
    var grundHinweis = (e.freigabezusatz && text.hinweisMitZusatz) || "";
    if (grundHinweis || e.freigabezusatz) {
      var hinweis = el("div", "einordnung-hinweis");
      var hinweisText = el("p", "", grundHinweis);
      // Bei einer Freigabe: Sie ändert das Gesamtergebnis nicht.
      if (e.freigabezusatz) anhaengen(hinweisText, document.createTextNode(grundHinweis ? " " : ""), el("span", "zusatz-freigabe", I.FEST.freigabezusatz));
      hinweisText.insertBefore(el("strong", "hinweis-titel", T.hinweisTitel + " "), hinweisText.firstChild);
      anhaengen(hinweis, symbol("info"), hinweisText);
      ein.appendChild(hinweis);
    }
    return ein;
  }

  /** Schaltfläche „Zur Frage“, führt zur ersten genannten Frage. */
  function zurFrageKnopf(f) {
    var b = el("button", "zur-frage");
    b.type = "button";
    b.setAttribute("aria-label", T.zurFrage + " " + f);
    anhaengen(b, el("span", "", T.zurFrage), symbol("rechts"));
    b.addEventListener("click", function () { zeigeFrage(f); });
    return b;
  }

  /**
   * Aufklappbare Gruppe offener Angaben: Symbol, Überschrift mit Anzahl und Kurzerklärung.
   * Aufgeklappt folgen die betroffenen Fragen mit „Zur Frage“.
   */
  function offeneGruppe(klasse, symbolName, titel, anzahl, erklaerung, inhalt) {
    var abschnitt = el("section", klasse);
    var klapp = el("details", "offen-klapp");
    var kopf = el("summary", "offen-kopf");
    var texte = el("div", "offen-kopf-text");
    anhaengen(texte, el("h3", "", titel + " (" + anzahl + ")"), el("p", "", erklaerung));
    anhaengen(kopf, symbol(symbolName), texte, symbol("winkel"));
    var koerper = el("div", "offen-koerper");
    inhalt.forEach(function (x) { koerper.appendChild(x); });
    anhaengen(klapp, kopf, koerper);
    abschnitt.appendChild(klapp);
    return abschnitt;
  }

  function zeichneLuecken(e) {
    // Ohne Wissenslücken entfällt der Abschnitt.
    if (!e.luecken.length) return null;
    var ul = el("ul", "luecken-liste");
    e.luecken.forEach(function (f) {
      // Die Überschrift „Wissenslücken“ nennt den Grund, eine eigene Marke je Zeile entfällt.
      var li = el("li", "offen-zeile ohne-marke");
      anhaengen(li, el("span", "frage-nr", f), el("span", "offen-text", I.FRAGEN[f].frage), zurFrageKnopf(f));
      ul.appendChild(li);
    });
    return offeneGruppe("luecken", "dokument", T.lueckenTitel, e.luecken.length, I.FEST.luecken, [ul]);
  }

  /** Widersprüchliche Angaben (Abschnitt 5.3.5). Erscheinen nur, wenn welche vorliegen. */
  function zeichneWidersprueche(e) {
    if (!e.widersprueche.length) return null;
    var ul = el("ul", "widerspruch-liste");
    e.widersprueche.forEach(function (kennung) {
      var w = I.WIDERSPRUECHE[kennung];
      var li = el("li", "widerspruch offen-zeile ohne-marke");
      li.setAttribute("data-kennung", kennung);
      var nummern = el("span", "frage-nummern");
      w.fragen.forEach(function (f) { nummern.appendChild(el("span", "frage-nr", f)); });
      anhaengen(li, nummern, el("span", "offen-text", w.text), zurFrageKnopf(w.fragen[0]));
      ul.appendChild(li);
    });
    return offeneGruppe("widersprueche", "tausch", T.widerspruecheTitel, e.widersprueche.length, I.FEST.widersprueche,
      [el("p", "offen-vorbehalt", I.FEST.widerspruecheVorbehalt), ul]);
  }

  /**
   * Text zum Anlass einer Empfehlung. Den Anlass selbst bestimmt regeln.js (Tabelle 17).
   * Platzhalter {stufe} steht für den Namen des Gesamtergebnisses.
   */
  function anlassText(anlass, e) {
    if (anlass.grund === "richtlinie") return I.begruendungE1(anlass);
    return fuelle(I.EMPFEHLUNG_GRUND[anlass.grund], { stufe: I.STUFEN[e.gesamt].name });
  }

  /** Symbol je Maßnahme */
  var EMPFEHLUNG_SYMBOL = { E1: "buch", E2: "hut", E3: "zahnrad", E4: "lupe", E5a: "gebaeude", E5b: "haken", E6: "tausch", E7: "schloss", E8: "stift", E9: "kreuz" };

  /**
   * Eine Maßnahme als Karte: Symbol, Titel, Text und Stand der Schutzmaßnahme. Rechts oben öffnet
   * ein Pfeil die Begründung, die unter einer Trennlinie über die volle Breite der Karte folgt.
   */
  function zeichneEmpfehlung(m, e, ohneListe) {
    var li = el("li", "empfehlung");
    li.setAttribute("data-kennung", m.kennung);
    var inhalt = el("div", "empfehlung-inhalt");
    var kopfzeile = el("div", "empfehlung-kopf");
    var titel = I.EMPFEHLUNG_TITEL[m.kennung];
    // Ohne Nummern: Die Maßnahmen geben keine Reihenfolge der Umsetzung vor.
    anhaengen(kopfzeile, el("h3", "empfehlung-titel", nachZustand(titel, m.zustand, m.anlass)));
    var fuss = el("div", "empfehlung-fuss");
    if (m.zustand !== null) {
      var marke = el("span", "zustand zustand-" + m.zustand,
        fuelle(T.etikett, { massnahme: I.MASSNAHMEN[m.kennung], zustand: I.ZUSTAENDE[m.zustand] }));
      marke.setAttribute("data-zustand", m.zustand);
      fuss.appendChild(marke);
    } else {
      // Empfehlung ohne Schutzmaßnahme (E7, E8): Das Etikett nennt den Anlass.
      fuss.appendChild(el("span", "anlass-marke", fuelle(T.etikettAnlass[m.kennung] || "{massnahme}", { massnahme: I.ANLASS_MARKE[m.anlass.grund] || I.MASSNAHMEN[m.kennung] })));
    }
    anhaengen(inhalt, kopfzeile, textMitVerweisen("empfehlung-text", empfehlungsText(m.kennung, m.zustand, m.anlass)));
    m.zusaetze.forEach(function (name) {
      inhalt.appendChild(textMitVerweisen("empfehlung-zusatz", empfehlungsText(name, m.zustand)));
    });
    inhalt.appendChild(fuss);

    // Begründung: eingeklappt, der Pfeil steht rechts oben in der Karte. Sie entfällt, wenn der
    // Text der Empfehlung den Anlass schon nennt oder dieselbe Begründung bei einer Karte davor steht.
    var begruendung = I.OHNE_BEGRUENDUNG.indexOf(m.kennung) === -1 ? grundAbsaetze(m.anlass, e, ohneListe) : [];
    if (!begruendung.length) {
      anhaengen(li, symbol(EMPFEHLUNG_SYMBOL[m.kennung] || "liste"), inhalt);
      return li;
    }
    var grund = el("details", "empfehlung-grund");
    grund.addEventListener("toggle", ordneEmpfehlungen);
    var zusammenfassung = el("summary", "");
    zusammenfassung.setAttribute("title", T.warum);
    anhaengen(zusammenfassung, el("span", "nur-vorlesen", T.warum), symbol("winkel"));
    anhaengen(grund, zusammenfassung, el("p", "grund-titel", T.warum));
    begruendung.forEach(function (absatz) { grund.appendChild(absatz); });
    anhaengen(li, symbol(EMPFEHLUNG_SYMBOL[m.kennung] || "liste"), inhalt, grund);
    return li;
  }

  /**
   * Sätze zu den auslösenden Sachverhalten, bezogen auf die Antworten der Person (inhalte.js).
   * Die auslösenden Fragen stammen aus den Treffern von regeln.js. Gleiche Sätze erscheinen nur
   * einmal, etwa wenn S1 und S4 beide auf F23 beruhen.
   */
  function sachverhaltSaetze(sachverhalte, e) {
    var saetze = [];
    sachverhalte.forEach(function (kennung) {
      var treffer = e.treffer.filter(function (t) { return t.kennung === kennung; })[0];
      I.sachverhaltSaetze(kennung, treffer ? treffer.fragen : [], antworten).forEach(function (satz) {
        if (saetze.indexOf(satz) === -1) saetze.push(satz);
      });
    });
    return saetze;
  }

  /**
   * Absätze der Begründung: Anlass und die ausschlaggebenden Angaben, ein Satz im selben Absatz,
   * mehrere als Liste. Beim Gesamtergebnis, bei der zuständigen Stelle und bei Risikofaktoren ist
   * der Anlass leer, die Angaben folgen direkt auf „Ausschlaggebend dafür sind Ihre Angaben:“.
   * ohneListe: Dieselbe Liste steht schon bei einer Maßnahme davor. Leer, wenn nichts zu sagen ist.
   */
  function grundAbsaetze(anlass, e, ohneListe) {
    var saetze = ohneListe ? [] : sachverhaltSaetze(anlass.sachverhalte, e);
    var text = anlassText(anlass, e);
    if (!saetze.length) return text ? [el("p", "grund-text", text)] : [];
    var einleitung = text ? text + " " + I.EMPFEHLUNG_GRUND.sachverhalte : I.EMPFEHLUNG_GRUND.sachverhalte;
    if (saetze.length === 1) return [el("p", "grund-text", einleitung + " " + saetze[0])];
    var ul = el("ul", "grund-liste");
    saetze.forEach(function (satz) { ul.appendChild(el("li", "", satz)); });
    return [el("p", "grund-text", einleitung), ul];
  }

  function zeichneEmpfehlungen(e) {
    // Ohne Empfehlungen entfällt der Abschnitt.
    if (!e.empfehlungen.length) return null;
    var emp = el("section", "empfehlungen");
    emp.appendChild(ergebnisAbschnittKopf("liste", T.empfehlungenTitel, e.empfehlungen.length === 1 ? I.FEST.empfehlungenEinleitungEins : I.FEST.empfehlungenEinleitung, null));
    var liste = el("ul", "empfehlungen-liste" + (e.empfehlungen.length === 1 ? " eine" : ""));
    // Gesamtergebnis (E1) und zuständige Stelle (E5a) nennen oft dieselben Sachverhalte. Die Liste
    // steht dann nur bei der ersten dieser Maßnahmen.
    var gezeigt = [];
    e.empfehlungen.forEach(function (m) {
      var schluessel = m.anlass.grund === "sachverhalteRisiko" || m.anlass.grund === "richtlinie" ? "" : m.anlass.sachverhalte.join(",");
      var doppelt = schluessel !== "" && gezeigt.indexOf(schluessel) !== -1;
      if (schluessel) gezeigt.push(schluessel);
      liste.appendChild(zeichneEmpfehlung(m, e, doppelt));
    });
    emp.appendChild(liste);
    return emp;
  }

  function zeichneErgebnisAktionen() {
    // Links der Hinweis zur lokalen Verarbeitung, rechts Speichern und Neues Assessment
    var leiste = el("div", "aktionen aktionen-ergebnis");
    var schutz = el("p", "aktionen-hinweis");
    anhaengen(schutz, symbol("schild"), el("span", "", T.verarbeitung));
    var pdf = knopf("", "neben mit-symbol", function () { window.print(); });
    pdf.setAttribute("title", T.pdfTitel);
    anhaengen(pdf, symbol("herunterladen"), el("span", "", T.pdf));
    var neu = knopf("", "neben mit-symbol", neuesAssessment);
    anhaengen(neu, symbol("plus"), el("span", "", T.neu));
    var knoepfe = el("div", "aktionen-knoepfe");
    anhaengen(knoepfe, pdf, neu);
    anhaengen(leiste, schutz, knoepfe);
    return leiste;
  }

  // ------------------------------------------------------------ Druck auf eine Seite
  // Vor dem Drucken wird die Ergebnisseite in eine kompakte Anordnung gebracht (stil.css,
  // body.druck) und so verkleinert, dass sie auf eine A4-Seite passt.
  var SEITENHOEHE = (297 - 2 * 10) * 96 / 25.4;      // A4 hoch, 10 mm Rand, in CSS-Pixeln
  var KLEINSTER_MASSSTAB = 0.6;                       // darunter wäre die Schrift nicht mehr lesbar
  window.addEventListener("beforeprint", function () {
    if (schritt !== "ergebnis") return;
    document.body.classList.add("druck");
    Array.prototype.forEach.call(haupt.querySelectorAll(".empfehlungen-liste > li"), function (k) { k.style.gridRowEnd = ""; });
    // Im Ausdruck stehen alle Sachverhalte ausgeklappt.
    Array.prototype.forEach.call(haupt.querySelectorAll("details.regel-klapp, details.pfad-detail, details.ausloeser-rahmen, details.offen-klapp"), function (d) {
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
    Array.prototype.forEach.call(haupt.querySelectorAll("details.regel-klapp, details.pfad-detail, details.ausloeser-rahmen, details.offen-klapp"), function (d) {
      if (d.dataset.warOffen) { d.open = d.dataset.warOffen === "1"; delete d.dataset.warOffen; }
    });
    haupt.style.zoom = "";
    haupt.style.width = "";
    ordneEmpfehlungen();
  });

  zeichne();
})();
