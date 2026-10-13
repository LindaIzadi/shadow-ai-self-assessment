/*
 * inhalte.js – alle Texte des Self-Assessments
 *
 * Die Datei enthält keine Logik. Fragen, Antwortoptionen, Auswahllisten und
 * Hilfetexte entsprechen Anhang A der Arbeit, die Ausgabetexte Anhang B und
 * die Bedeutung der Reaktionsstufen Tabelle 13. Wer einen Wortlaut ändern
 * will, ändert ihn nur hier.
 *
 * „wert“ ist der interne Code einer Antwort, den regeln.js auswertet.
 * „text“ ist der Wortlaut, den die ausfüllende Person sieht.
 * Welche Codes zulässig sind, legt regeln.js fest (ANTWORTEN). test/regeln.test.js
 * prüft, dass beide Dateien dieselben Codes verwenden.
 */
(function (wurzel) {
  "use strict";

  var JA_NEIN_UNKLAR = [
    { wert: "Ja", text: "Ja" },
    { wert: "Nein", text: "Nein" },
    { wert: "Unklar", text: "Unklar" }
  ];

  var STAND = "Oktober 2026";

  // Definition von Shadow AI. Sie steht nur hier und erscheint in „Wissenswertes vor dem Start“,
  // auf der Abschlussseite und hinter „Was ist Shadow AI?“ im Ergebnis.
  var DEFINITION_SHADOW_AI = "Shadow AI bezeichnet die berufliche Nutzung von KI-Diensten, die vom Unternehmen nicht freigegeben ist und sich seiner Steuerung und Aufsicht entzieht.";

  // ------------------------------------------------------------ Anhang A: Einleitung
  var EINLEITUNG = {
    // Die beiden Angaben legen den Nutzungsfall fest. Sie dienen der Orientierung und gehen in keine Regel ein.
    fallTitel: "Ihr KI-Nutzungsfall",
    // Kurzanleitung im Kasten „Ihr Nutzungsfall“ auf der Startseite
    fallAnleitung: "Beschreiben Sie kurz, welche KI Sie wofür einsetzen.",
    // Hinweis, wenn KI-Dienst oder Aufgabe geändert werden, nachdem schon Fragen beantwortet sind
    fallWechsel: "Sie haben den Nutzungsfall geändert. Mit „Assessment beginnen“ startet ein neues Assessment, Ihre bisherigen Antworten werden dabei verworfen.",
    dienstTitel: "Welchen KI-Dienst nutzen Sie?",
    // Auswahlliste: Vorschläge in dieser Reihenfolge, danach „Sonstiger KI-Dienst“ mit Textfeld
    dienstBitteWaehlen: "Bitte auswählen",
    dienstVorschlaege: [
      "ChatGPT", "Microsoft Copilot", "Google Gemini", "Claude", "DeepL", "Perplexity",
      "Mistral Le Chat", "GitHub Copilot"
    ],
    dienstSonstiger: "Sonstiger KI-Dienst",
    dienstHinweis: "Fehlt der KI-Dienst? Wählen Sie „Sonstiger KI-Dienst“.",
    dienstFehlt: "Bitte wählen Sie den KI-Dienst aus.",
    dienstNameTitel: "Name des KI-Dienstes",
    dienstNamePlatzhalter: "Name des KI-Dienstes eingeben",
    dienstNameHinweis: "Der Name erscheint auf jeder Fragenseite und im Ergebnis.",
    dienstNameFehlt: "Bitte nennen Sie den KI-Dienst.",
    aufgabeTitel: "Wofür nutzen Sie den KI-Dienst?",
    // Beispiel als Platzhalter im Feld. Der Hinweis wird nur vorgelesen.
    aufgabePlatzhalter: "z. B. Kundenmails zusammenfassen",
    aufgabeHinweis: "Zum Beispiel: „Kundenmails zusammenfassen“.",
    aufgabeFehlt: "Bitte beschreiben Sie die Nutzung.",
    fallHinweis: "Beide Angaben dienen nur der Orientierung und beeinflussen die Bewertung nicht."
  };

  // ------------------------------------------------------------ Tabelle 7: Blöcke
  var BLOECKE = [
    // beschreibung: Satz unter der Blocküberschrift
    { id: "1", titel: "Nutzungsfall und Vorprüfung", fragen: ["F1", "F2", "F3", "F4", "F5"],
      beschreibung: "Hier geht es darum, wofür Sie den KI-Dienst einsetzen, ob die Nutzung beruflich ist, über welchen Zugang sie läuft und ob Ihr Unternehmen sie freigegeben hat." },
    { id: "2", titel: "Regulatorische Sachverhalte", fragen: ["F6", "F7", "F8", "F9", "F10", "F11"],
      beschreibung: "Hier geht es darum, ob die Nutzung unter Verbote, Hochrisiko-Bereiche oder Transparenzpflichten des EU AI Act fallen kann." },
    { id: "3", titel: "Datenschutz", fragen: ["F12", "F13", "F14", "F15", "F16", "F17"],
      beschreibung: "Hier geht es darum, ob personenbezogene Daten verarbeitet werden, um welche Daten es sich handelt, wer sie verarbeitet und wo." },
    { id: "4", titel: "Risikofaktoren der KI-Nutzung", fragen: ["F18", "F19", "F20", "F21", "F22", "F23", "F24"],
      beschreibung: "Hier geht es darum, welche Informationen Sie eingeben, wie Sie die Ergebnisse prüfen und verwenden und wie der KI-Dienst eingebunden ist." },
    { id: "5", titel: "Governance und Schutzmaßnahmen", fragen: ["F25", "F26", "F27", "F28", "F29", "F30"],
      beschreibung: "Hier geht es darum, welche Regeln, Schulungen, Zuständigkeiten und Schutzmaßnahmen Ihr Unternehmen für KI-Dienste vorsieht." }
  ];

  // ------------------------------------------------------------ Auswahllisten zu F6 und F7
  var LISTE_F6 = [
    "Emotionen von Beschäftigten oder Lernenden erkennen",
    "Personen anhand ihres Sozialverhaltens oder persönlicher Eigenschaften bewerten, mit Nachteilen in anderen Zusammenhängen",
    "Verhalten durch unterschwellige, manipulative oder täuschende Techniken beeinflussen",
    "Schutzbedürftigkeit wegen Alter, Behinderung oder sozialer oder wirtschaftlicher Lage ausnutzen",
    "Personen anhand biometrischer Daten sensiblen Merkmalen zuordnen",
    "Gesichtsdatenbanken aus Internetbildern oder Überwachungsaufnahmen aufbauen",
    "Straftaten einzelner Personen allein aus Persönlichkeitsmerkmalen vorhersagen",
    "Sexualisierte Darstellungen realer Personen ohne deren Zustimmung oder Missbrauchsdarstellungen von Kindern erzeugen"
  ];
  var LISTE_F7 = [
    "Biometrie: Personen aus der Ferne biometrisch identifizieren",
    "Biometrie: Personen nach sensiblen Merkmalen kategorisieren",
    "Biometrie: Emotionen von Personen erkennen",
    "Kritische Infrastruktur: Einsatz als Sicherheitsbauteil bei kritischer digitaler Infrastruktur, im Straßenverkehr oder in der Wasser-, Gas-, Wärme- oder Stromversorgung",
    "Bildung: über Zugang, Zulassung oder Zuweisung entscheiden, Lernergebnisse oder das Bildungsniveau bewerten, Prüfungen überwachen",
    "Beschäftigung: Stellenanzeigen gezielt schalten, Bewerbungen sichten oder Bewerbende bewerten, über Arbeitsbedingungen, Beförderung oder Kündigung entscheiden, Aufgaben nach persönlichen Merkmalen zuweisen, Leistung und Verhalten beobachten und bewerten",
    "Grundlegende Dienste: Anspruch auf öffentliche Leistungen beurteilen, Kreditwürdigkeit prüfen, Risiken und Preise bei Lebens- und Krankenversicherungen bestimmen, Notrufe bewerten und priorisieren",
    "Strafverfolgung: Aufgaben von Strafverfolgungsbehörden unterstützen",
    "Migration, Asyl und Grenzkontrolle: Aufgaben der zuständigen Behörden unterstützen",
    "Rechtspflege und demokratische Prozesse: Justizbehörden oder eine alternative Streitbeilegung bei der Ermittlung und Auslegung von Sachverhalten und Recht unterstützen, das Ergebnis einer Wahl oder das Wahlverhalten beeinflussen"
  ];
  function nummeriert(liste) {
    return liste.map(function (t, i) { return { wert: i + 1, text: t }; });
  }

  // ------------------------------------------------------------ Tabelle A.1: Fragenkatalog
  // typ: "einfach" (Einfachauswahl) oder "mehrfach" (Mehrfachauswahl)
  // keine: Wortlaut der ausschließenden Option, etwa „Keine der genannten Aussagen trifft zu“
  var FRAGEN = {
    F1: {
      typ: "einfach", frage: "Wobei unterstützt Sie der KI-Dienst?",
      optionen: [
        { wert: "Texte", text: "Texte erstellen oder überarbeiten" },
        { wert: "Uebersetzen", text: "Übersetzen" },
        { wert: "Recherchieren", text: "Recherchieren und zusammenfassen" },
        { wert: "Programmcode", text: "Programmcode erstellen oder prüfen" },
        { wert: "Daten", text: "Daten auswerten" },
        { wert: "Medien", text: "Bilder, Audio oder Video erzeugen" },
        { wert: "Sonstiges", text: "Sonstiges" }
      ]
    },
    F2: {
      typ: "einfach", frage: "Wird der KI-Dienst für diese Aufgabe beruflich genutzt?",
      hilfe: "Gemeint sind der KI-Dienst und die Nutzung, die Sie für dieses Assessment angegeben haben. Eine berufliche Nutzung bleibt auch dann beruflich, wenn dafür ein privates Konto verwendet wird oder keine Anmeldung nötig ist.",
      optionen: [
        { wert: "Ja", text: "Ja" },
        { wert: "Nein", text: "Nein, ausschließlich privat" },
        { wert: "Unklar", text: "Unklar" }
      ]
    },
    F3: {
      typ: "einfach", frage: "Mit welchem Konto oder Zugang wird der KI-Dienst genutzt?",
      hilfe: [
        "Vom Unternehmen bereitgestellter Zugang: Das Unternehmen stellt das Konto oder den Zugriff bereit, zum Beispiel über eine Unternehmenslizenz.",
        "Privater Zugang: Die Person nutzt ein selbst eingerichtetes Konto. Das gilt auch dann, wenn dafür die dienstliche E-Mail-Adresse verwendet wurde.",
        "Ohne Anmeldung oder Benutzerkonto: Die Person nutzt den KI-Dienst, ohne sich anzumelden, zum Beispiel über die frei zugängliche Webseite des Anbieters.",
        "Die Frage betrifft den Zugang zum KI-Dienst, nicht die Internetverbindung."
      ],
      optionen: [
        { wert: "Unternehmen", text: "Vom Unternehmen bereitgestellter Zugang" },
        { wert: "privat", text: "Privater Zugang" },
        { wert: "ohne Anmeldung", text: "Ohne Anmeldung oder Benutzerkonto" },
        { wert: "Unklar", text: "Unklar" }
      ]
    },
    F4: {
      typ: "einfach", frage: "Hat Ihr Unternehmen diese Nutzung des KI-Dienstes freigegeben?",
      hilfe: [
        "Achtung: Ist nur der KI-Dienst allgemein freigegeben, gilt das nicht automatisch für jede Nutzung oder jeden Zugang.",
        "Bekannt, aber nicht freigegeben oder abgelehnt: Die zuständige Stelle oder Unternehmensleitung weiß bereits von dieser konkreten Nutzung. Eine Prüfung läuft jedoch nicht, oder die Nutzung wurde ausdrücklich abgelehnt.",
        "Dem Unternehmen nicht bekannt: Die konkrete Nutzung wurde der zuständigen Stelle oder Unternehmensleitung bisher nicht mitgeteilt und ist ihr nach Ihrem Wissen auch sonst nicht bekannt."
      ],
      optionen: [
        { wert: "freigegeben", text: "Ja, nach einem Prüf- oder Freigabeverfahren" },
        { wert: "in Pruefung", text: "Noch nicht, die Prüfung oder Freigabe läuft" },
        { wert: "bekannt, nicht freigegeben", text: "Bekannt, aber nicht freigegeben oder abgelehnt" },
        { wert: "nicht bekannt", text: "Dem Unternehmen nicht bekannt" },
        { wert: "Unklar", text: "Unklar" }
      ]
    },
    F5: {
      typ: "mehrfach", frage: "Trifft eine der folgenden Aussagen auf Ihr Unternehmen und den KI-Dienst zu?", keine: "Keine der genannten Aussagen trifft zu",
      hilfe: [
        "Ihr Unternehmen kann unter bestimmten Voraussetzungen selbst als Anbieter des KI-Dienstes gelten. Die Aussagen beschreiben solche Fälle.",
        "Unter eigenem Namen oder in eigenem Angebot: Ihr Unternehmen stellt den KI-Dienst anderen unter eigenem Namen oder eigener Marke zur Verfügung, zum Beispiel als Chatbot auf der eigenen Website.",
        "Wesentlich verändert: Ihr Unternehmen hat den KI-Dienst über die vom Anbieter vorgesehenen Einstellungen hinaus verändert, zum Beispiel durch eigenes Nachtrainieren.",
        "Anderer Zweck: Eine Nutzung für einen sensiblen Zweck, den der Anbieter in seinen Bedingungen nicht vorsieht oder ausschließt (z. B. Einsatz eines allgemeinen Chatbots für Personalentscheidungen). Die übliche Verwendung für Texte, Übersetzungen oder Recherchen fällt nicht darunter.",
        "Die Frage erfasst nur Hinweise auf eine Anbieterrolle und entscheidet nicht über die rechtliche Rolle."
      ],
      optionen: nummeriert([
        "Ihr Unternehmen bietet den KI-Dienst unter eigenem Namen an oder hat ihn in ein eigenes Angebot eingebaut",
        "Ihr Unternehmen hat den KI-Dienst wesentlich verändert",
        "Ihr Unternehmen setzt den KI-Dienst für einen anderen Zweck ein, als sein Anbieter vorsieht"
      ])
    },
    F6: {
      typ: "mehrfach", frage: "Wird der KI-Dienst für einen der folgenden Zwecke eingesetzt?", keine: "Keiner der genannten Zwecke trifft zu",
      optionen: nummeriert(LISTE_F6)
    },
    F7: {
      typ: "mehrfach", frage: "Wird der KI-Dienst in einem der folgenden Bereiche für einen der genannten Zwecke eingesetzt?", keine: "Keiner der genannten Bereiche trifft zu",
      hilfe: [
        "Entscheidend ist, wofür der KI-Dienst tatsächlich eingesetzt wird. Die Branche Ihres Unternehmens allein genügt nicht.",
        "Wenn keine der genannten Verwendungen zutrifft, wählen Sie „Keiner der genannten Bereiche trifft zu“. Sind Sie unsicher, wählen Sie „Unklar“."
      ],
      optionen: nummeriert(LISTE_F7)
    },
    F8: {
      typ: "einfach", frage: "Werden dabei personenbezogene Daten automatisiert ausgewertet, um persönliche Aspekte einer Person zu bewerten?",
      hilfe: [
        "Gemeint ist, dass der KI-Dienst Daten über eine Person auswertet, um etwa ihre Arbeitsleistung, wirtschaftliche Lage, Gesundheit, Interessen, Zuverlässigkeit oder ihr Verhalten einzuschätzen."
      ],
      optionen: JA_NEIN_UNKLAR
    },
    F9: {
      typ: "mehrfach", frage: "Trifft eine der folgenden Aussagen zu?", keine: "Keine der genannten Aussagen trifft zu",
      optionen: nummeriert([
        "Ihr Unternehmen ist eine öffentliche Einrichtung",
        "Ihr Unternehmen erbringt öffentliche Dienste",
        "Die Nutzung betrifft die Kreditwürdigkeit",
        "Die Nutzung betrifft Lebens- oder Krankenversicherungen"
      ])
    },
    F10: { typ: "einfach", frage: "Werden Bild-, Ton- oder Videoinhalte erzeugt oder verändert, die täuschend echt wirken?", optionen: JA_NEIN_UNKLAR },
    F11: {
      typ: "einfach", frage: "Werden mit dem KI-Dienst erstellte Texte veröffentlicht, um die Öffentlichkeit über Angelegenheiten von öffentlichem Interesse zu informieren?",
      hilfe: [
        "Gemeint sind KI-erstellte Texte, die sich an die Allgemeinheit richten, zum Beispiel auf Websites, in sozialen Medien oder in Pressemitteilungen.",
        "Ob ein Thema von öffentlichem Interesse ist, kann eine rechtliche Prüfung erfordern. Wählen Sie im Zweifel „Unklar“."
      ],
      optionen: JA_NEIN_UNKLAR
    },
    F12: {
      typ: "einfach", frage: "Werden personenbezogene Daten in den KI-Dienst eingegeben oder von ihm verarbeitet?",
      hilfe: [
        "Personenbezogene Daten sind alle Informationen, die sich auf eine identifizierte oder identifizierbare Person beziehen.",
        "Beispiele: Namen, Kontaktdaten, Kundennummern, Bewerbungsunterlagen oder E-Mails mit Angaben zu Absendern und anderen Personen."
      ],
      optionen: JA_NEIN_UNKLAR
    },
    F13: {
      typ: "einfach", frage: "Sind darunter besondere Kategorien personenbezogener Daten?",
      hilfe: [
        "Besondere Kategorien sind Daten, aus denen die rassische oder ethnische Herkunft, politische Meinungen, religiöse oder weltanschauliche Überzeugungen oder die Gewerkschaftszugehörigkeit hervorgehen.",
        "Dazu gehören außerdem genetische Daten, biometrische Daten zur eindeutigen Identifizierung einer Person, Gesundheitsdaten sowie Daten zum Sexualleben oder zur sexuellen Orientierung (Art. 9 Abs. 1 DSGVO)."
      ],
      optionen: JA_NEIN_UNKLAR
    },
    F14: { typ: "einfach", frage: "Wurde genau diese Verarbeitung datenschutzrechtlich geprüft und freigegeben?", optionen: JA_NEIN_UNKLAR },
    F15: {
      typ: "einfach", frage: "Verarbeitet eine Organisation außerhalb Ihres Unternehmens die personenbezogenen Daten?",
      hilfe: [
        "Das ist in der Regel der Fall, wenn Sie einen KI-Dienst über das Internet nutzen. Der Anbieter verarbeitet die Eingaben dann auf seinen Servern. Das gilt auch für Anbieter mit Sitz in Deutschland.",
        "Wählen Sie „Nein“ nur, wenn Ihr Unternehmen den KI-Dienst selbst auf eigenen Systemen betreibt. Wissen Sie das nicht, wählen Sie „Unklar“.",
        "_Die Frage bezieht sich auf die personenbezogenen Daten aus F12. Wo die Daten verarbeitet werden, fragt F16."
      ],
      optionen: JA_NEIN_UNKLAR
    },
    F16: {
      typ: "einfach", frage: "Können die personenbezogenen Daten bei dieser Nutzung außerhalb der EU oder des Europäischen Wirtschaftsraums verarbeitet oder zugänglich gemacht werden?",
      hilfe: [
        "Personenbezogene Daten können außerhalb der EU oder des Europäischen Wirtschaftsraums (EWR) verarbeitet oder von dort aus zugänglich werden, beispielsweise über Server oder Zugriffe aus anderen Ländern. Es kommt also nicht darauf an, wo Sie selbst den KI-Dienst nutzen.",
        "Hinweise finden Sie in den Datenschutzbedingungen und Vereinbarungen mit dem Anbieter. Sind die Verarbeitungsorte oder Zugriffsmöglichkeiten unbekannt, wählen Sie „Unklar“.",
        "_Wer die Daten verarbeitet, fragt F15."
      ],
      optionen: JA_NEIN_UNKLAR
    },
    F17: {
      typ: "mehrfach", frage: "Trifft eine der folgenden Aussagen auf die Verarbeitung personenbezogener Daten bei dieser Nutzung zu?", keine: "Keine der genannten Aussagen trifft zu",
      hilfe: [
        "Die Frage bezieht sich darauf, wofür der KI-Dienst tatsächlich eingesetzt wird, nicht darauf, wie er intern funktioniert.",
        "Strukturierte und systematische Bewertung: Beispielsweise Bewerbungen vorsortieren oder die Leistung von Beschäftigten einschätzen.",
        "Besondere Kategorien in großem Umfang: Beispielsweise regelmäßig Gesundheitsdaten vieler Personen verarbeiten.",
        "Sind Sie unsicher, wählen Sie „Unklar“."
      ],
      optionen: nummeriert([
        "Personen werden strukturiert und systematisch bewertet; die Bewertung beeinflusst Entscheidungen über diese Personen",
        "Besondere Kategorien personenbezogener Daten, etwa Gesundheitsdaten, werden in großem Umfang verarbeitet"
      ])
    },
    F18: {
      typ: "einfach", frage: "Welche Art von Informationen wird in den KI-Dienst eingegeben?",
      hilfe: [
        "Öffentlich: Informationen, die bereits veröffentlicht oder zur Veröffentlichung bestimmt sind.",
        "Intern: Informationen, die nur für Beschäftigte bestimmt sind und keinen besonderen Schutzbedarf haben.",
        "Vertraulich oder geschäftskritisch: Informationen mit besonderem Schutzbedarf, beispielsweise Verträge, Kalkulationen, Quellcode, Kundendaten oder Strategiepapiere.",
        "_Werden zum Beispiel öffentliche und vertrauliche Informationen eingegeben, wählen Sie „Vertrauliche oder geschäftskritische Informationen“. Maßgeblich ist die Information, die am besten geschützt werden muss."
      ],
      optionen: [
        { wert: "oeffentlich", text: "Öffentliche Informationen" },
        { wert: "intern", text: "Interne Informationen" },
        { wert: "vertraulich", text: "Vertrauliche oder geschäftskritische Informationen" },
        { wert: "Unklar", text: "Unklar" }
      ]
    },
    F19: {
      typ: "einfach", frage: "Wie werden die Ergebnisse des KI-Dienstes bei dieser Aufgabe verwendet?",
      optionen: [
        { wert: "Information", text: "Zur Information: Es folgt keine Entscheidung daraus" },
        { wert: "Vorschlag", text: "Als Vorschlag: Ein Mensch entscheidet selbst" },
        { wert: "massgeblich", text: "Als maßgebliche Grundlage: Die Entscheidung folgt in der Regel dem Ergebnis" },
        { wert: "automatisch", text: "Automatisch: Das Ergebnis wird ohne menschliche Entscheidung übernommen" },
        { wert: "Unklar", text: "Unklar" }
      ]
    },
    F20: {
      typ: "einfach", frage: "Welche Folgen hätte ein fehlerhaftes Ergebnis des KI-Dienstes?",
      // Liste: jeder Eintrag wird als eigener Punkt gezeigt
      hilfe: [
        "Gering: Der Fehler hätte keine Folgen über die eigene Arbeit hinaus. Beispiel: Ein fehlerhafter interner Textentwurf.",
        "Spürbar für Ihr Unternehmen: Der Fehler könnte Mehraufwand, Verzögerungen oder begrenzte Kosten verursachen, ohne einzelne Personen oder Vertragspartner zu treffen. Beispiel: Eine fehlerhafte interne Auswertung.",
        "Erheblich: Der Fehler könnte Personen benachteiligen, rechtliche oder vertragliche Folgen haben, hohe finanzielle Schäden verursachen oder die Sicherheit gefährden. Beispiel: Ein fehlerhaftes Kundenangebot."
      ],
      optionen: [
        { wert: "gering", text: "Gering" },
        { wert: "spuerbar", text: "Spürbar für Ihr Unternehmen" },
        { wert: "erheblich", text: "Erheblich" },
        { wert: "Unklar", text: "Unklar" }
      ]
    },
    F21: {
      typ: "einfach", frage: "Prüft eine fachkundige Person vor der Verwendung, ob die Ergebnisse des KI-Dienstes inhaltlich richtig und für die Aufgabe geeignet sind?",
      hilfe: [
        "Fachlich prüfen bedeutet, dass eine Person mit den erforderlichen Kenntnissen das Ergebnis auf inhaltliche Richtigkeit und Eignung für die Aufgabe kontrolliert. Bloßes Lesen oder eine Kontrolle von Rechtschreibung und Format genügt dafür nicht.",
        "Teilweise: Nur ein Teil der Ergebnisse wird so geprüft, oder die Prüfung findet nicht in jedem Fall statt."
      ],
      optionen: [
        { wert: "immer", text: "Immer" },
        { wert: "teilweise", text: "Teilweise" },
        { wert: "nie", text: "Nie" },
        { wert: "Unklar", text: "Unklar" }
      ]
    },
    F22: {
      typ: "einfach", frage: "Lässt sich später nachvollziehen, welche Inhalte in den KI-Dienst eingegeben und welche KI-Ergebnisse für die Aufgabe verwendet wurden?",
      optionen: [
        { wert: "ja", text: "Ja" },
        { wert: "teilweise", text: "Teilweise" },
        { wert: "nein", text: "Nein" },
        { wert: "Unklar", text: "Unklar" }
      ]
    },
    F23: {
      typ: "einfach", frage: "Wie werden die in den KI-Dienst eingegebenen Daten verarbeitet?",
      hilfe: [
        "Wird ein KI-Dienst über das Internet genutzt, werden die Eingaben in der Regel auf Servern des Anbieters verarbeitet.",
        "Training: Der Anbieter verwendet Eingaben, um seine KI-Modelle weiterzuentwickeln.",
        "Ob der Anbieter Eingaben speichert oder zum Training nutzt, steht in seinen Nutzungs- und Datenschutzbedingungen. Wenn Sie diese nicht kennen, wählen Sie „Unklar“."
      ],
      optionen: [
        { wert: "lokal", text: "Die Daten verlassen das Unternehmen nicht. Sie werden auf dem eigenen Gerät oder auf Servern Ihres Unternehmens verarbeitet" },
        { wert: "extern ohne", text: "Die Daten gehen an den Anbieter. Nach seinen Angaben speichert er sie nicht und nutzt sie nicht zum Training" },
        { wert: "extern mit", text: "Die Daten gehen an den Anbieter. Er kann sie speichern oder zum Training nutzen" },
        { wert: "Unklar", text: "Unklar" }
      ]
    },
    F24: {
      typ: "einfach", frage: "Wie ist der KI-Dienst technisch in die Arbeitsabläufe eingebunden?",
      hilfe: [
        "Manuelle Eingabe: Inhalte werden einzeln in den KI-Dienst eingegeben oder eingefügt.",
        "Erweiterung: Ein Browser-Plugin oder Assistent hat beispielsweise Zugriff auf E-Mails, Kalender oder Dateien.",
        "Automatisierte Anbindung: Daten werden über eine Schnittstelle übertragen, ohne dass jede einzelne Eingabe manuell ausgelöst wird."
      ],
      optionen: [
        { wert: "manuell", text: "Manuelle Eingabe" },
        { wert: "Erweiterung", text: "Erweiterung mit Zugriff auf Konten oder Dateien" },
        { wert: "automatisiert", text: "Automatisierte Anbindung an Systeme" },
        { wert: "Unklar", text: "Unklar" }
      ]
    },
    F25: { typ: "einfach", frage: "Gibt es in Ihrem Unternehmen eine KI-Richtlinie oder Nutzungsregeln, die diese Nutzung abdecken?", optionen: JA_NEIN_UNKLAR },
    F26: { typ: "einfach", frage: "Wurde die Person, die den KI-Dienst nutzt, im Umgang mit KI geschult?", optionen: JA_NEIN_UNKLAR },
    F27: {
      typ: "einfach", frage: "Bestehen in Ihrem Unternehmen technische Schutzmaßnahmen für die Nutzung von KI-Diensten?",
      hilfe: "Gemeint sind zum Beispiel Sperren für bestimmte KI-Dienste oder eine Überwachung des Datenabflusses, die erkennt, wenn sensible Daten an KI-Dienste übertragen werden.",
      optionen: JA_NEIN_UNKLAR
    },
    F28: { typ: "einfach", frage: "Schreibt Ihr Unternehmen vor, dass Ergebnisse von KI-Diensten vor der Verwendung fachlich geprüft werden?", optionen: JA_NEIN_UNKLAR },
    F29: {
      typ: "mehrfach", frage: "Welche der folgenden Zuständigkeiten und Verfahren gibt es in Ihrem Unternehmen für KI-Dienste?", keine: "Keines von beiden",
      optionen: [
        { wert: "Stelle", text: "Eine zuständige Stelle oder Person ist für Fragen zur KI-Nutzung benannt" },
        { wert: "Verfahren", text: "Ein festgelegtes Verfahren, um KI-Nutzungen prüfen und freigeben zu lassen" }
      ]
    },
    F30: { typ: "einfach", frage: "Steht in Ihrem Unternehmen für diese Aufgabe eine freigegebene KI-Alternative zur Verfügung?", optionen: JA_NEIN_UNKLAR }
  };

  // ------------------------------------------------------------ Tabelle 13: Reaktionsstufen
  var STUFEN = {
    1: { name: "Kein besonderer Handlungsbedarf", bedeutung: "Aus den erfassten Sachverhalten ergibt sich kein besonderer Prüf- oder Handlungsbedarf." },
    2: { name: "Handlungsbedarf", bedeutung: "Ihre Angaben weisen auf einen Risikofaktor hin. Der Fachbereich kann ihm mit Schutzmaßnahmen begegnen." },
    3: { name: "Prüfbedarf", bedeutung: "Ihre Angaben weisen auf einen möglichen Prüfbedarf hin. Ihre zuständige Stelle im Unternehmen sollte den Sachverhalt genauer prüfen." },
    4: { name: "Eskalation", bedeutung: "Der Fall sollte der zuständigen Stelle vorrangig vorgelegt werden." }
  };

  // ------------------------------------------------------------ Tabelle B.1: feste Texte
  var FEST = {
    kopf: "Dieses Ergebnis ist ein Prüfhinweis auf Grundlage Ihrer Angaben. Es trifft keine Aussage über die Rechtskonformität der Nutzung.",
    abschluss: "Nach Ihren Angaben wird der KI-Dienst ausschließlich privat genutzt. Das Self-Assessment endet deshalb an dieser Stelle.",
    // Begründung des Abschlusses in drei Punkten, danach ein Hinweis zur weiteren Nutzung
    abschlussGrund: [
      { titel: "Privater Nutzungskontext", text: "Das Self-Assessment bewertet KI-Nutzungen im beruflichen Zusammenhang." },
      { titel: "Keine Shadow AI", text: DEFINITION_SHADOW_AI },
      { titel: "Rechtliche Einordnung (EU AI Act)", text: "Der EU AI Act nimmt natürliche Personen von den Betreiberpflichten aus, wenn sie ein KI-System ausschließlich persönlich und nicht beruflich verwenden (Art. 2 Abs. 10 KI-VO)." }
    ],
    abschlussHinweis: { titel: "Hinweis zur weiteren Nutzung", text: "Wird der KI-Dienst auch für berufliche Aufgaben genutzt, beantworten Sie die Frage zur beruflichen Nutzung mit „Ja“. Das gilt auch dann, wenn dafür ein privater Zugang verwendet wird." },
    luecken: "Diese Fragen haben Sie mit „Unklar“ beantwortet. Bitte klären Sie die Sachverhalte und wiederholen Sie das Assessment.",
    widersprueche: "Einige Ihrer Antworten lassen sich nicht miteinander vereinbaren. Bitte überprüfen Sie die betroffenen Angaben.",
    widerspruecheVorbehalt: "Das Ergebnis berücksichtigt derzeit beide Angaben und sollte bis zur Klärung unter diesem Vorbehalt interpretiert werden.",
    freigabezusatz: "Das Gesamtergebnis bleibt davon unberührt.",
    // Zusatz bei jeder Einordnung als Shadow AI: Die Stufe ist keine Erlaubnis.
    // Erklärung des Begriffs, der in vielen Hinweisen und Empfehlungen vorkommt
    zustaendigeStelle: "Die zuständige Stelle ist die Person oder Einheit, die in Ihrem Unternehmen für Fragen zur KI-Nutzung benannt ist. Gibt es keine, wenden Sie sich an die Unternehmensleitung.",
    // Herkunft des Gesamtergebnisses. {bereiche} wird durch die Namen der Bereiche ersetzt.
    gesamtEinBereich: "Das Gesamtergebnis ergibt sich aus dem Bereich {bereiche}. Dort ist die Stufe am höchsten.",
    gesamtMehrereBereiche: "Das Gesamtergebnis ergibt sich aus den Bereichen {bereiche}. Dort ist die Stufe am höchsten.",
    empfehlungenEinleitung: "Diese Maßnahmen ergeben sich aus Ihren Angaben und berücksichtigen bereits vorhandene Schutzmaßnahmen. Ihre Reihenfolge ist keine Rangfolge.",
    empfehlungenEinleitungEins: "Diese Maßnahme ergibt sich aus Ihren Angaben und berücksichtigt bereits vorhandene Schutzmaßnahmen."
  };
  // Stufen des Gesamtergebnisses, bei denen die Oberfläche die Erklärung der zuständigen Stelle
  // anbietet (Tabelle B.1)
  var ERKLAERUNG_STELLE = { stufen: [3, 4] };

  // ------------------------------------------------------------ Tabelle B.1: widersprüchliche Angaben
  // Kennungen wie in regeln.js, widersprueche()
  var WIDERSPRUECHE = {
    "W1": { fragen: ["F12", "F8"], text: "Sie haben angegeben, dass keine personenbezogenen Daten verarbeitet werden, und zugleich, dass personenbezogene Daten automatisiert ausgewertet werden." },
    "W2 (F15)": { fragen: ["F23", "F15"], text: "Sie haben angegeben, dass die Daten das Unternehmen nicht verlassen, und zugleich, dass eine Organisation außerhalb Ihres Unternehmens die personenbezogenen Daten verarbeitet." },
    "W2 (F16)": { fragen: ["F23", "F16"], text: "Sie haben angegeben, dass die Daten das Unternehmen nicht verlassen, und zugleich, dass die personenbezogenen Daten außerhalb der EU oder des Europäischen Wirtschaftsraums verarbeitet oder zugänglich gemacht werden können." }
  };
  var EINORDNUNG = {
    "Shadow AI": { titel: "Shadow AI laut Angaben", text: "Sie haben angegeben, dass der KI-Dienst beruflich genutzt wird und die Nutzung weder freigegeben noch in Prüfung ist. Damit weist die Nutzung die Merkmale von Shadow AI auf." },
    "keine Shadow AI": { titel: "Keine Shadow AI laut Angaben", text: "Sie haben angegeben, dass Ihr Unternehmen die Nutzung des KI-Dienstes freigegeben hat. Daher wird die Nutzung im Assessment nicht als Shadow AI eingestuft.", hinweisMitZusatz: "Die Freigabe schließt andere Risiken nicht aus." },
    // hinweisMitZusatz erscheint nur zusammen mit dem Freigabezusatz, also ab Prüfbedarf.
    // Marke und Text nennen den Freigabestand.
    "keine Shadow AI, Freigabe steht aus": { titel: "Freigabe in Prüfung", text: "Sie haben angegeben, dass Ihr Unternehmen die Freigabe der Nutzung derzeit prüft. Solange ein Prüf- oder Freigabeverfahren läuft, wird die Nutzung im Assessment nicht als Shadow AI eingestuft. Wird die Nutzung abgelehnt, ändert sich diese Einordnung." },
    "unklar": { titel: "Shadow AI nicht ausgeschlossen", text: "Nach Ihren Angaben lässt sich nicht ausschließen, dass die Nutzung die Merkmale von Shadow AI aufweist. Bitte klären Sie die offenen Angaben unter „Wissenslücken“." }
  };

  // ------------------------------------------------------------ Tabellen B.2 bis B.4: Hinweise
  var HINWEISE = {
    "R1": "Für Anbieter gelten nach der KI-VO andere Pflichten als für Betreiber (Art. 25 Abs. 1 KI-VO). Bitte lassen Sie die Rolle prüfen.",
    "R2 (Eskalation)": "Die Nutzung könnte eine verbotene KI-Praktik betreffen (Art. 5 KI-VO). Bitte legen Sie den Fall umgehend der zuständigen Stelle vor.",
    "R2 Zusatz Geltungsbeginn": "Dieses Verbot gilt ab dem 2. Dezember 2026.",
    "R2 (Pruefbedarf)": "Eine verbotene KI-Praktik lässt sich nach Ihren Angaben nicht ausschließen. Bitte lassen Sie dies klären.",
    "R3": "Die Nutzung könnte in einen Bereich des Anhangs III fallen. Bitte lassen Sie die Einstufung als Hochrisiko-KI-System prüfen. Die Vorschriften gelten ab dem 2. Dezember 2027.",
    "R3 Zusatz Profiling": "Bei Profiling greift die Ausnahme nach Art. 6 Abs. 3 KI-VO nicht.",
    "R3 Zusatz Profiling unklar": "Bitte klären Sie, ob ein Profiling vorliegt. In diesem Fall greift die Ausnahme nach Art. 6 Abs. 3 KI-VO nicht.",
    "R4": "Bei einer Einstufung als Hochrisiko-KI-System gelten Betreiberpflichten nach Art. 26 KI-VO.",
    "R4 Zusatz Art. 27": "Bitte lassen Sie prüfen, ob eine Grundrechte-Folgenabschätzung nach Art. 27 KI-VO erforderlich ist.",
    "R5": "Bestimmte KI-Inhalte und KI-Anwendungen müssen gegenüber Betroffenen offengelegt werden (Art. 50 KI-VO). Bitte lassen Sie prüfen, ob für diese Nutzung eine Kennzeichnungs- oder Informationspflicht gilt.",
    "D1": "Jede Verarbeitung erfordert eine Rechtsgrundlage und einen festgelegten Zweck. Bitte lassen Sie beides prüfen.",
    "D2 (Eskalation)": "Es werden besondere Kategorien personenbezogener Daten verarbeitet, ohne dass eine Prüfung und Freigabe bekannt ist. Bitte legen Sie den Fall umgehend der zuständigen Stelle vor.",
    // D2 mit Prüfbedarf hat zwei Wortlaute, je nachdem, welche Antwort die Regel auslöst
    "D2 (Pruefbedarf) bei F14 Ja": "Nach Ihren Angaben liegt eine Prüfung und Freigabe vor. Für diese Daten gelten besondere Anforderungen (Art. 9 DSGVO). Achten Sie darauf, dass die Nutzung im Rahmen der Freigabe bleibt, und wenden Sie sich bei Änderungen an die zuständige Stelle.",
    "D2 (Pruefbedarf) bei F13 Unklar": "Bitte klären Sie, ob besondere Kategorien personenbezogener Daten betroffen sind.",
    "D3": "Bitte lassen Sie die datenschutzrechtliche Rolle des Anbieters prüfen. Liegt eine Auftragsverarbeitung vor, ist eine Vereinbarung nach Art. 28 Abs. 3 DSGVO erforderlich.",
    "D4": "Eine Übermittlung außerhalb der EU und des EWR ist nur unter zusätzlichen Voraussetzungen zulässig (Art. 44 ff. DSGVO). Bitte lassen Sie die Zulässigkeit prüfen.",
    "D5": "Bitte lassen Sie prüfen, ob eine Datenschutz-Folgenabschätzung erforderlich ist.",
    "S1": "Ihr Unternehmen kann möglicherweise nicht kontrollieren, wer die eingegebenen Informationen speichert oder weiterverwendet.",
    "S2": "Fehlerhafte KI-Ergebnisse können Folgen haben, weil sie maßgeblich in Entscheidungen einfließen oder nicht immer geprüft werden.",
    "S3": "Ohne Freigabe oder Dokumentation kann Ihr Unternehmen die Nutzung möglicherweise nicht vollständig überblicken.",
    "S4": "Was mit den Daten geschieht, richtet sich nach den Nutzungsbedingungen des Anbieters.",
    "K1": "Der Anbieter kann die Eingaben möglicherweise speichern oder zum Training nutzen.",
    "K2": "Fehler in den KI-Ergebnissen können unentdeckt bleiben, wenn die Nutzung dem Unternehmen nicht bekannt oder nicht nachvollziehbar ist."
  };

  // Bezeichnungen der Regeln und Risikofelder (Tabelle 4 und Abschnitt 5.3.2)
  var REGELNAMEN = {
    R1: "Mögliche Anbieterrolle", R2: "Verbotene KI-Praktiken", R3: "Mögliche Einstufung als Hochrisiko-KI-System",
    R4: "Betreiberpflichten", R5: "Transparenzpflichten",
    D1: "Verarbeitung personenbezogener Daten", D2: "Besondere Kategorien personenbezogener Daten",
    D3: "Verarbeitung durch einen externen Anbieter", D4: "Mögliche Drittlandübermittlung",
    D5: "Datenschutz-Folgenabschätzung",
    S1: "Weitergabe sensibler Informationen", S2: "Integrität der KI-Ergebnisse",
    S3: "Transparenz und Nachvollziehbarkeit", S4: "Abhängigkeit von den Bedingungen externer Anbieter",
    K1: "Vertrauliche Informationen beim Anbieter", K2: "Folgenreiche Ergebnisse ohne ausreichende Prüfung"
  };
  // Kurznamen der drei Bereiche in der Übersicht des Gesamtergebnisses
  var BEREICHE = { R: "EU AI Act", D: "Datenschutz", S: "Risikofaktoren der KI-Nutzung" };
  var PFADE = {
    R: "Regulatorische Einordnung (EU AI Act)",
    D: "Datenschutzrechtliche Einordnung",
    S: "Risikofaktoren der KI-Nutzung"
  };

  // ------------------------------------------------------------ Tabelle B.5: Handlungsempfehlungen
  // Bezeichnung der Schutzmaßnahme, auf die sich eine Empfehlung bezieht (Tabelle 18)
  // Stand einer Schutzmaßnahme, wie er im Etikett einer Empfehlung erscheint
  // Etikett einer Empfehlung ohne Schutzmaßnahme, je Anlass: die Angabe aus F3
  var ANLASS_MARKE = { privat: "Privater Zugang", ohneAnmeldung: "Ohne Anmeldung oder Benutzerkonto" };
  var ZUSTAENDE = { vorhanden: "vorhanden", fehlt: "nicht vorhanden", unklar: "unklar" };
  var MASSNAHMEN = {
    E1: "KI-Richtlinie", E2: "Schulung", E3: "Technische Schutzmaßnahmen", E4: "Vorgeschriebene fachliche Prüfung",
    E5a: "Zuständige Stelle", E5b: "Freigabeverfahren", E6: "Freigegebene Alternative",
    E7: "Zugang zum KI-Dienst",           // kein Stand, das Etikett nennt die Angabe aus F3 (ANLASS_MARKE)
    E8: "Transparenz und Nachvollziehbarkeit"   // kein Stand, das Etikett nennt den Risikofaktor
  };
  // vorhanden: Maßnahme vorhanden. fehlt: Maßnahme fehlt oder ist unklar.
  // text: Empfehlung ohne Schutzmaßnahme, die unabhängig von einem Stand gilt.
  // Normangaben auf der Ergebnisseite, die als Verweis auf EUR-Lex erscheinen (KI-VO in der konsolidierten Fassung)
  var NORMVERWEISE = {
    "Art. 2 Abs. 10 KI-VO": { adresse: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:02024R1689-20260727#art_2", hinweis: "Artikel 2 der KI-Verordnung, konsolidierte Fassung, öffnet EUR-Lex in einem neuen Fenster" },
    "Art. 4 KI-VO": { adresse: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:02024R1689-20260727#art_4", hinweis: "Artikel 4 der KI-Verordnung, konsolidierte Fassung, öffnet EUR-Lex in einem neuen Fenster" },
    "Art. 5 KI-VO": { adresse: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:02024R1689-20260727#art_5", hinweis: "Artikel 5 der KI-Verordnung, konsolidierte Fassung, öffnet EUR-Lex in einem neuen Fenster" },
    "Art. 6 Abs. 3 KI-VO": { adresse: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:02024R1689-20260727#art_6", hinweis: "Artikel 6 der KI-Verordnung, konsolidierte Fassung, öffnet EUR-Lex in einem neuen Fenster" },
    "Art. 25 Abs. 1 KI-VO": { adresse: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:02024R1689-20260727#art_25", hinweis: "Artikel 25 der KI-Verordnung, konsolidierte Fassung, öffnet EUR-Lex in einem neuen Fenster" },
    "Art. 26 KI-VO": { adresse: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:02024R1689-20260727#art_26", hinweis: "Artikel 26 der KI-Verordnung, konsolidierte Fassung, öffnet EUR-Lex in einem neuen Fenster" },
    "Art. 26 Abs. 2 KI-VO": { adresse: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:02024R1689-20260727#art_26", hinweis: "Artikel 26 der KI-Verordnung, konsolidierte Fassung, öffnet EUR-Lex in einem neuen Fenster" },
    "Art. 27 KI-VO": { adresse: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:02024R1689-20260727#art_27", hinweis: "Artikel 27 der KI-Verordnung, konsolidierte Fassung, öffnet EUR-Lex in einem neuen Fenster" },
    "Art. 50 KI-VO": { adresse: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:02024R1689-20260727#art_50", hinweis: "Artikel 50 der KI-Verordnung, konsolidierte Fassung, öffnet EUR-Lex in einem neuen Fenster" },
    "Art. 9 DSGVO": { adresse: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32016R0679#art_9", hinweis: "Artikel 9 der DSGVO, öffnet EUR-Lex in einem neuen Fenster" },
    "Art. 28 Abs. 3 DSGVO": { adresse: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32016R0679#art_28", hinweis: "Artikel 28 der DSGVO, öffnet EUR-Lex in einem neuen Fenster" },
    "Art. 44 ff. DSGVO": { adresse: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32016R0679#art_44", hinweis: "Artikel 44 der DSGVO, öffnet EUR-Lex in einem neuen Fenster" }
  };
  var EMPFEHLUNGEN = {
    "E1": { vorhanden: "Prüfen Sie, ob die KI-Richtlinie Ihres Unternehmens diesen KI-Dienst und diese Aufgabe abdeckt, und halten Sie sich an ihre Vorgaben.", fehlt: "Fragen Sie Ihre Führungskraft oder die zuständige Stelle, welche Regeln für diesen KI-Dienst gelten." },
    "E2": { fehlt: "Fragen Sie nach einer Schulung zum Umgang mit KI. Nach Art. 4 KI-VO unterstützen Unternehmen den Aufbau der KI-Kompetenz ihres Personals." },
    "E3": { vorhanden: "Fragen Sie bei Ihrer IT nach, ob die vorhandenen technischen Schutzmaßnahmen auch diesen KI-Dienst erfassen.", fehlt: "Lassen Sie von Ihrer IT prüfen, welche technischen Schutzmaßnahmen für diesen KI-Dienst nötig sind." },
    "E4": { vorhanden: "Lassen Sie die Ausgabe der KI wie vorgeschrieben fachlich prüfen, bevor Sie sie verwenden.", fehlt: "Legen Sie mit Ihrer Führungskraft fest, wer die Ausgabe der KI vor der Verwendung fachlich prüft." },
    "E4 Zusatz Art. 26 Abs. 2": { fehlt: "Bei einem Hochrisiko-KI-System muss diese Prüfung bei Personen liegen, die dafür geeignet sind (Art. 26 Abs. 2 KI-VO)." },
    "E5a": { vorhanden: "Legen Sie den Fall der zuständigen Stelle vor, zum Beispiel mit diesem Ergebnis als PDF.", fehlt: "Klären Sie, welche Stelle im Unternehmen für KI-Nutzungen zuständig ist, etwa über Ihre Führungskraft oder Ihre IT." },
    "E5b": { vorhanden: "Beantragen Sie für diese Nutzung eine Freigabe über das bestehende Freigabeverfahren.", fehlt: "Fragen Sie bei der zuständigen Stelle nach, wie Sie für diese Nutzung eine Freigabe erhalten." },
    "E6": { vorhanden: "Prüfen Sie, ob Sie die Aufgabe mit der freigegebenen KI-Alternative Ihres Unternehmens erledigen können.", fehlt: "Melden Sie der zuständigen Stelle, für welche Aufgabe Sie einen KI-Dienst benötigen." },
    "E7": { text: "Fragen Sie, ob es für diesen KI-Dienst einen Zugang über Ihr Unternehmen gibt, etwa eine Unternehmenslizenz, und nutzen Sie künftig diesen." },
    "E8": { text: "Halten Sie fest, welche Inhalte Sie in den KI-Dienst eingeben und welche Ergebnisse Sie für die Aufgabe verwenden. So bleibt die Nutzung für Ihr Unternehmen nachvollziehbar." }
  };

  // Kurztitel der Handlungsempfehlungen, je nach Stand der Schutzmaßnahme (Tabelle 18)
  var EMPFEHLUNG_TITEL = {
    "E1": { vorhanden: "Bestehende KI-Richtlinie anwenden", fehlt: "Nutzungsregeln klären" },
    "E2": { fehlt: "Schulung zum Umgang mit KI" },
    "E3": { vorhanden: "Technische Schutzmaßnahmen prüfen", fehlt: "Technische Schutzmaßnahmen klären" },
    "E4": { vorhanden: "Vorgeschriebene fachliche Prüfung anwenden", fehlt: "Fachliche Prüfung der Ergebnisse festlegen" },
    "E5a": { vorhanden: "Zuständige Stelle einbeziehen", fehlt: "Zuständige Stelle klären" },
    "E5b": { vorhanden: "Freigabeverfahren durchlaufen", fehlt: "Weg zur Freigabe klären" },
    "E6": { vorhanden: "Freigegebene Alternative prüfen", fehlt: "Bedarf melden" },
    "E7": { text: "Unternehmenszugang klären" },
    "E8": { text: "Nachvollziehbarkeit sicherstellen" }
  };
  // Begründung „Warum diese Empfehlung?“: nennt den Anlass nach Tabelle 18 in Alltagssprache.
  // {…} sind Platzhalter. Die genauen Regeln stehen in den aufklappbaren Sachverhalten.
  var EMPFEHLUNG_GRUND = {
    gesamt: "Bei der beschriebenen Nutzung wurde insgesamt „{stufe}“ festgestellt.",
    stelle: "Bei der beschriebenen Nutzung wurde „{stufe}“ festgestellt. Solche Fälle sollte eine zuständige Stelle prüfen.",
    sachverhalte: "Ausschlaggebend dafür:",
    sachverhalteRisiko: "Festgestellt wurde:",
    shadow: "Nach Ihren Angaben wird der KI-Dienst ohne Freigabe Ihres Unternehmens genutzt.",
    unklar: "Nach Ihren Angaben lässt sich nicht ausschließen, dass der KI-Dienst ohne Freigabe Ihres Unternehmens genutzt wird.",
    schulungNein: "Nach Ihren Angaben wurde die nutzende Person nicht im Umgang mit KI geschult.",
    schulungUnklar: "Ob die nutzende Person im Umgang mit KI geschult wurde, ist nach Ihren Angaben unklar.",
    nichtFrei: "Nach Ihren Angaben ist die Nutzung nicht freigegeben.",
    freigabeUnklar: "Ob die Nutzung freigegeben ist, ist nach Ihren Angaben unklar.",
    privat: "Nach Ihren Angaben wird der KI-Dienst über einen privaten Zugang genutzt.",
    ohneAnmeldung: "Nach Ihren Angaben wird der KI-Dienst ohne Anmeldung oder Benutzerkonto genutzt."
  };
  // Auslösende Sachverhalte in Alltagssprache, abgeleitet aus den Hinweisen der Tabellen B.2 bis B.4
  var SACHVERHALT_KURZ = {
    R1: "Ihr Unternehmen könnte als Anbieter des KI-Systems gelten.",
    R2: "Die Nutzung könnte eine verbotene KI-Praktik betreffen.",
    R3: "Die Nutzung könnte als Hochrisiko-KI-System eingestuft werden.",
    R4: "Bei einer Einstufung als Hochrisiko-KI-System gelten besondere Pflichten für Ihr Unternehmen.",
    R5: "Es könnten Kennzeichnungs- oder Informationspflichten bestehen.",
    D1: "Es werden personenbezogene Daten verarbeitet, oder dies ist unklar.",
    D2: "Besonders geschützte personenbezogene Daten sind betroffen, oder dies ist unklar.",
    D3: "Ein externer Anbieter verarbeitet die Daten, oder dies ist unklar.",
    D4: "Daten könnten in Länder außerhalb der EU gelangen.",
    D5: "Eine Datenschutz-Folgenabschätzung könnte erforderlich sein.",
    S1: "Interne oder vertrauliche Informationen können das Unternehmen verlassen.",
    S2: "Fehlerhafte KI-Ergebnisse können Folgen haben.",
    S3: "Die Nutzung ist nicht freigegeben oder für Ihr Unternehmen nicht vollständig nachvollziehbar.",
    S4: "Die Daten können den Bedingungen eines externen Anbieters unterliegen.",
    K1: "Vertrauliche Informationen können an einen Anbieter gelangen, der sie speichern oder zum Training nutzen kann.",
    K2: "Folgenreiche Ergebnisse werden möglicherweise ungeprüft verwendet."
  };
  // Kurze Erklärung, worin sich Freigabe, Alternative und Unternehmenszugang unterscheiden
  var EMPFEHLUNG_ERKLAERUNG = {
    E5b: "Freigabe: Ihr Unternehmen prüft und erlaubt genau diese Nutzung, also diesen KI-Dienst für diese Aufgabe.",
    E6: "Alternative: Sie nutzen statt dieses KI-Dienstes einen anderen, den Ihr Unternehmen bereits freigegeben hat.",
    E7: "Unternehmenszugang: Sie nutzen denselben KI-Dienst, aber über ein Konto, das Ihr Unternehmen für Sie eingerichtet oder lizenziert hat."
  };




  // ------------------------------------------------------------ Texte der Oberfläche
  // Diese Texte stehen nicht in den Anhängen der Arbeit. Sie führen durch die Seite.
  // {name} in geschweiften Klammern ist ein Platzhalter, den app.js durch einen Wert ersetzt.
  var OBERFLAECHE = {
    titel: "Self-Assessment",
    // Startseite: Überschrift in zwei Teilen, der zweite ist farbig hervorgehoben
    start: {
      vorzeile: "KI-Risiken einschätzen",
      titelAnfang: "Wie riskant ist Ihre",
      titelAkzent: "KI-Nutzung?",
      band: [
        { titel: "Bis zu 30 Fragen", text: "" },
        { titel: "Fünf Themenblöcke", text: "Schrittweise durch die Prüfung" },
        { titel: "Konkrete Empfehlungen", text: "Für Ihre nächsten Schritte" }
      ]
    },
    // Einleitung der Startseite
    startText: "Wählen Sie einen KI-Dienst, den Sie bei Ihrer Arbeit nutzen.",
    startText2: "Beantworten Sie bis zu 30 Fragen und erfahren Sie, welche Risiken sich aus Ihrer Nutzung im Hinblick auf Shadow AI, den EU AI Act und den Datenschutz ergeben können.",
    startPunkte: [
      { titel: "Nachvollziehbare Bewertung", text: "Mit Begründung und Empfehlungen." },
      { titel: "Orientierung statt Rechtsprüfung", text: "Ein Prüfhinweis, keine Rechtsberatung." },
      { titel: "Keine Speicherung", text: "Ihre Angaben bleiben im Browser." }
    ],
    beginnen: "Assessment beginnen",
    weiter: "Weiter",
    zurueck: "Zurück",
    auswerten: "Ergebnis anzeigen",
    abschliessen: "Assessment abschließen",
    pflicht: "Bitte beantworten Sie diese Frage.",
    pflichtSammel: "Bitte beantworten Sie alle Fragen dieses Blocks.",
    hinweisTitel: "Hinweis:",
    offeneAnzahl: "Es gibt {anzahl} offene Punkte, die Sie überprüfen sollten.",
    offeneAnzahlEins: "Es gibt einen offenen Punkt, den Sie überprüfen sollten.",
    erlaeuterung: "Erläuterung zur Frage",
    infoStelle: "Was ist die zuständige Stelle?",
    infoShadow: "Was ist Shadow AI?",
    mehrfachHinweis: "Mehrere Angaben möglich",
    achtung: "Achtung:",
    // Hinweis an der Stelle ausgeblendeter Fragen, damit die Lücke in der Nummerierung nicht wie ein Fehler wirkt
    entfaellt: {
      F7: "Die Fragen F8 und F9 entfallen, weil sie nur für die bei F7 genannten Bereiche gelten.",
      F12: "Die Fragen F13 bis F17 entfallen, weil sie nur bei personenbezogenen Daten gestellt werden.",
      F13: "Die Frage F14 entfällt, weil sie nur bei besonderen Kategorien personenbezogener Daten gestellt wird."
    },
    // Hinweis unter der Frage bei Mehrfachauswahl, je Frage. Fehlt ein Eintrag, gilt mehrfachHinweis.
    mehrfachHinweise: {
      F5: "Wählen Sie alle Aussagen aus, die auf Ihren konkreten KI-Einsatz zutreffen.",
      F6: "Wählen Sie alle Zwecke aus, die auf Ihren konkreten KI-Einsatz zutreffen.",
      F7: "Wählen Sie alle Verwendungen aus, die auf Ihren konkreten KI-Einsatz zutreffen.",
      F9: "Wählen Sie alle Aussagen aus, die auf Ihren konkreten KI-Einsatz zutreffen.",
      F17: "Wählen Sie alle Aussagen aus, die auf Ihren konkreten KI-Einsatz zutreffen.",
      F29: "Wählen Sie alle Zuständigkeiten und Verfahren aus, die es in Ihrem Unternehmen gibt."
    },
    pdf: "Als PDF speichern",
    pdfTitel: "Öffnet den Druckdialog. Dort können Sie das Ergebnis als PDF speichern oder drucken.",
    aendern: "Antworten ändern",
    neu: "Neues Assessment",
    ergebnis: "Ergebnis",
    unklar: "Unklar",
    standRegelbasis: "Stand der Regelbasis: {stand}",
    abschlussTitel: "Abschluss nach der Vorprüfung",
    abschlussFrage: "Warum endet das Assessment hier?",
    ergebnisTitel: "Ergebnis Ihres Self-Assessments",
    erstellt: "Erstellt am {datum} um {zeit} Uhr.",
    gesamtTitel: "Gesamtergebnis",
    gesamtStufe: "Stufe {stufe} von 4: {name}",
    matrixBeschreibung: "Gesamtergebnis Stufe {gesamt} von 4, {name}. EU AI Act Stufe {R}, Datenschutz Stufe {D}, Risikofaktoren der KI-Nutzung Stufe {S}.",
    ausloeser: "Auslösende Antworten",
    lueckenTitel: "Wissenslücken",
    einordnungTitel: "Einordnung als Shadow AI",
    offeneTitel: "Offene Angaben",
    detailTitel: "Detailergebnisse",
    detailText: "Erfahren Sie, wie Ihre KI-Nutzung in den einzelnen Bereichen bewertet wurde und welche Antworten dafür ausschlaggebend waren.",
    alleOeffnen: "Alle Bereiche öffnen",
    alleSchliessen: "Alle Bereiche schließen",
    zurFrage: "Zur Frage",
    warum: "Warum diese Empfehlung?",
    // Erklärung der Stufe im Bereich Shadow AI, je Stufe
    shadowStufe: {
      1: "Ihre Angaben weisen bei keinem der Risikofaktoren auf einen Handlungsbedarf hin.",
      2: "Ihre Angaben weisen bei mindestens einem Risikofaktor auf einen Handlungsbedarf hin.",
      3: "Mindestens ein Risikofaktor hat die Stufe „Prüfbedarf“ ausgelöst. Eine zuständige Stelle sollte den Fall prüfen.",
      4: "Eine Kombination von Risikofaktoren hat die Stufe „Eskalation“ ausgelöst. Der Fall sollte der zuständigen Stelle vorrangig vorgelegt werden."
    },
    widerspruecheTitel: "Widersprüchliche Angaben",
    empfehlungenTitel: "Empfohlene Maßnahmen",
    // Der Sticker gibt die Angabe zur Schutzmaßnahme wieder, ohne sie zu bewerten.
    etikett: "Ihre Angabe: {massnahme} {zustand}",
    etikettAnlass: { E7: "Ihre Angabe: {massnahme}", E8: "Risikofaktor: {massnahme}" },
    aufzaehlungUnd: " und ",
    eingabeLeeren: "Eingabe löschen",
    sachverhalteAnzahl: "Geprüfte Sachverhalte ({anzahl})",
    infoZeichen: "i",
    fortschritt: "{beantwortet} von {gesamt} Fragen beantwortet",
    fortschrittGesamt: "Gesamtfortschritt {prozent} %",
    blockZaehler: "Block {aktuell} von {letzter}",
    fallSchutz: "Ihre Angaben werden ausschließlich lokal in Ihrem Browser verarbeitet.",
    blockFertig: "abgeschlossen",
    fallDienst: "KI-Dienst:",
    fallAufgabe: "Nutzung:",
    fallKategorie: "Kategorie:",
    verarbeitung: "Ihre Angaben werden nur in diesem Browserfenster verarbeitet, nicht übertragen und nicht gespeichert."
  };

  // Geltungsbeginn nach Art. 113 KI-VO in der Fassung der Verordnung (EU) 2026/1744.
  // Die Übersicht dient der Orientierung auf der Startseite und geht in keine Regel ein.

  // ------------------------------------------------------------ Startseite: Wissenswertes vor dem Start
  // Drei aufklappbare Themen. Die Inhalte stammen aus den Hilfetexten und Regelnamen des Tools.
  var WISSEN = {
    titel: "Wissenswertes vor dem Start",
    einleitung: "Die wichtigsten Grundlagen zu den drei Bereichen des Assessments.",
    themen: [
      {
        id: "shadow-ai", titel: "Shadow AI", untertitel: "Ungenehmigte KI-Nutzung einordnen",
        text: [
          DEFINITION_SHADOW_AI,
          "Dadurch können vertrauliche Informationen offengelegt und Risiken durch ungeprüfte KI-Ergebnisse entstehen."
        ],
        links: []
      },
      {
        id: "eu-ai-act", titel: "EU AI Act", untertitel: "Pflichten und Fristen verstehen",
        text: [
          "Der EU AI Act (Verordnung (EU) 2024/1689) regelt KI-Systeme in der EU. Welche Pflichten gelten, hängt vom Risiko, vom Verwendungszweck und von der Rolle des Unternehmens ab, etwa als Anbieter oder Betreiber.",
          "Die Verordnung ist seit dem 1. August 2024 in Kraft und wird schrittweise anwendbar. Seit dem 2. Februar 2025 gelten unter anderem die Verbote bestimmter KI-Praktiken und die Vorschriften zur KI-Kompetenz."
        ],
        links: [
          { text: "Umsetzungszeitplan", adresse: "https://ai-act-service-desk.ec.europa.eu/en/ai-act/timeline/timeline-implementation-eu-ai-act", hinweis: "AI Act Service Desk der Europäischen Kommission, englischsprachig, öffnet in einem neuen Fenster" },
          { text: "Ursprüngliche Amtsblattfassung (2024)", adresse: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj?locale=de", hinweis: "ursprüngliche Fassung im Amtsblatt, öffnet EUR-Lex in einem neuen Fenster" },
          { text: "Konsolidierte Fassung (Stand: 27.07.2026)", adresse: "https://eur-lex.europa.eu/eli/reg/2024/1689/2026-07-27/deu", hinweis: "konsolidierte Fassung mit Änderungen durch die Verordnung (EU) 2026/1744, öffnet EUR-Lex in einem neuen Fenster" }
        ]
      },
      {
        id: "datenschutz", titel: "Datenschutz", untertitel: "Personenbezogene Daten schützen",
        text: [
          "Personenbezogene Daten sind alle Informationen, die sich auf eine identifizierte oder identifizierbare Person beziehen. Ob und wie sie in einen KI-Dienst eingegeben werden dürfen, regelt die Datenschutz-Grundverordnung (DSGVO)."
        ],
        links: [{ text: "DSGVO auf EUR-Lex", adresse: "https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=de", hinweis: "öffnet EUR-Lex in einem neuen Fenster" }]
      }
    ]
  };

  var api = {
    WISSEN: WISSEN, DEFINITION_SHADOW_AI: DEFINITION_SHADOW_AI,
    STAND: STAND, EINLEITUNG: EINLEITUNG, BLOECKE: BLOECKE, FRAGEN: FRAGEN, STUFEN: STUFEN,
    FEST: FEST, ERKLAERUNG_STELLE: ERKLAERUNG_STELLE, WIDERSPRUECHE: WIDERSPRUECHE, EINORDNUNG: EINORDNUNG, HINWEISE: HINWEISE, REGELNAMEN: REGELNAMEN, PFADE: PFADE, BEREICHE: BEREICHE,
    EMPFEHLUNGEN: EMPFEHLUNGEN, NORMVERWEISE: NORMVERWEISE, EMPFEHLUNG_TITEL: EMPFEHLUNG_TITEL, EMPFEHLUNG_GRUND: EMPFEHLUNG_GRUND, SACHVERHALT_KURZ: SACHVERHALT_KURZ, EMPFEHLUNG_ERKLAERUNG: EMPFEHLUNG_ERKLAERUNG, MASSNAHMEN: MASSNAHMEN, ANLASS_MARKE: ANLASS_MARKE, ZUSTAENDE: ZUSTAENDE, OBERFLAECHE: OBERFLAECHE
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else wurzel.Inhalte = api;
})(typeof window !== "undefined" ? window : this);
