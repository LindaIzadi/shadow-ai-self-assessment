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

  // ------------------------------------------------------------ Anhang A: Einleitung
  var EINLEITUNG = {
    // Die beiden Angaben legen den Nutzungsfall fest. Sie dienen der Orientierung und gehen in keine Regel ein.
    fallTitel: "Ihr Nutzungsfall",
    // Kurzanleitung im Kasten „Ihr Nutzungsfall“ auf der Startseite
    fallAnleitung: "Wählen Sie den KI-Dienst und beschreiben Sie kurz, wofür er genutzt wird.",
    // Hinweis, wenn KI-Dienst oder Aufgabe geändert werden, nachdem schon Fragen beantwortet sind
    fallWechsel: "Sie haben den Nutzungsfall geändert. Mit „Assessment beginnen“ startet ein neues Assessment, Ihre bisherigen Antworten werden dabei verworfen.",
    dienstTitel: "KI-Dienst",
    // Auswahlliste: Vorschläge in dieser Reihenfolge, danach „Sonstiger KI-Dienst“ mit Textfeld
    dienstBitteWaehlen: "Bitte auswählen",
    dienstVorschlaege: [
      "ChatGPT", "Microsoft Copilot", "Google Gemini", "Claude", "DeepL", "Perplexity",
      "Mistral Le Chat", "GitHub Copilot"
    ],
    dienstSonstiger: "Sonstiger KI-Dienst",
    dienstHinweis: "Fehlt der KI-Dienst in der Liste, wählen Sie „Sonstiger KI-Dienst“.",
    dienstFehlt: "Bitte wählen Sie den KI-Dienst aus.",
    dienstNameTitel: "Name des KI-Dienstes",
    dienstNameHinweis: "Der Name erscheint auf jeder Fragenseite und im Ergebnis.",
    dienstNameFehlt: "Bitte nennen Sie den KI-Dienst.",
    aufgabeTitel: "Konkrete Nutzung",
    aufgabeHinweis: "Zum Beispiel: „Kundenmails zusammenfassen“.",
    aufgabeFehlt: "Bitte beschreiben Sie die Nutzung.",
    fallHinweis: "Beide Angaben dienen nur der Orientierung und gehen nicht in die Bewertung ein."
  };

  // ------------------------------------------------------------ Tabelle 7: Blöcke
  var BLOECKE = [
    { id: "1", titel: "Nutzungsfall und Vorprüfung", fragen: ["F1", "F2", "F3", "F4", "F5"] },
    { id: "2", titel: "Regulatorische Sachverhalte", fragen: ["F6", "F7", "F8", "F9", "F10", "F11"] },
    { id: "3", titel: "Datenschutz", fragen: ["F12", "F13", "F14", "F15", "F16", "F17"] },
    { id: "4", titel: "Shadow-AI-Risikofaktoren", fragen: ["F18", "F19", "F20", "F21", "F22", "F23", "F24"] },
    { id: "5", titel: "Governance und Schutzmaßnahmen", fragen: ["F25", "F26", "F27", "F28", "F29", "F30"] }
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
  // keine: Wortlaut der ausschließenden Option „Keine“ beziehungsweise „Keiner“
  var FRAGEN = {
    F1: {
      typ: "einfach", frage: "Welcher Kategorie lässt sich diese Nutzung zuordnen?",
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
      hilfe: "Gemeint ist der KI-Dienst und die Aufgabe, die Sie für dieses Assessment ausgewählt haben. Eine berufliche Nutzung bleibt beruflich, auch wenn dafür ein privates Konto verwendet wird.",
      optionen: [
        { wert: "Ja", text: "Ja" },
        { wert: "Nein", text: "Nein, ausschließlich privat" },
        { wert: "Unklar", text: "Unklar" }
      ]
    },
    F3: {
      typ: "einfach", frage: "Mit welchem Konto oder Zugang wird der KI-Dienst genutzt?",
      hilfe: [
        "Unternehmenszugang: Das Unternehmen stellt das Konto oder den Zugriff bereit, zum Beispiel über eine Unternehmenslizenz.",
        "Privater Zugang: Die Person nutzt ein selbst eingerichtetes Konto oder einen selbst gewählten Zugang.",
        "Ein eigenständig eingerichtetes Konto, das nicht vom Unternehmen bereitgestellt wird, gilt hier auch dann als privater Zugang, wenn dafür die dienstliche E-Mail-Adresse verwendet wurde.",
        "Die Frage betrifft den Zugang zum KI-Dienst, nicht die Internetverbindung."
      ],
      optionen: [
        { wert: "Unternehmen", text: "Vom Unternehmen bereitgestellter Zugang" },
        { wert: "privat", text: "Privater Zugang" },
        { wert: "Unklar", text: "Unklar" }
      ]
    },
    F4: {
      typ: "einfach", frage: "Hat Ihr Unternehmen diese Nutzung des KI-Dienstes freigegeben?",
      hilfe: [
        "Gemeint ist die Nutzung dieses KI-Dienstes für diese Aufgabe mit dem angegebenen Zugang.",
        "Bekannt: Die zuständige Stelle für KI-Nutzungen oder die Unternehmensleitung wusste schon vor dem Ausfüllen von der Nutzung.",
        "Abgelehnte oder untersagte Nutzungen gelten als bekannt, aber weder freigegeben noch in Prüfung."
      ],
      optionen: [
        { wert: "freigegeben", text: "Ja – nach einem Prüf- oder Freigabeverfahren" },
        { wert: "in Pruefung", text: "Noch nicht – Prüfung oder Freigabe läuft" },
        { wert: "bekannt, nicht freigegeben", text: "Bekannt, aber weder freigegeben noch in Prüfung" },
        { wert: "nicht bekannt", text: "Dem Unternehmen nicht bekannt" },
        { wert: "Unklar", text: "Unklar" }
      ]
    },
    F5: {
      typ: "mehrfach", frage: "Trifft eine der folgenden Aussagen auf Ihr Unternehmen und den KI-Dienst zu?", keine: "Keine",
      hilfe: [
        "Mit „Anbieter des KI-Dienstes“ ist hier die Organisation gemeint, die den Dienst bereitstellt. Ihr Unternehmen kann durch bestimmte Änderungen oder eine Bereitstellung unter eigenem Namen selbst eine Anbieterrolle übernehmen. Die Frage erfasst Hinweise darauf; sie entscheidet nicht über die rechtliche Rolle.",
        "„Anderer Zweck“ meint eine Verwendung, die der Anbieter in seinen Nutzungsbedingungen oder seiner Beschreibung nicht vorsieht oder ausschließt. Die übliche Nutzung eines allgemeinen Chat-Dienstes für Texte, Übersetzungen oder Recherchen fällt nicht darunter."
      ],
      optionen: nummeriert([
        "Ihr Unternehmen bietet den KI-Dienst unter eigenem Namen an oder hat ihn in ein eigenes Angebot eingebaut",
        "Ihr Unternehmen hat den KI-Dienst wesentlich verändert",
        "Ihr Unternehmen setzt den KI-Dienst für einen anderen Zweck ein, als sein Anbieter vorsieht"
      ])
    },
    F6: {
      typ: "mehrfach", frage: "Wird der KI-Dienst für einen der folgenden Zwecke eingesetzt?", keine: "Keiner",
      optionen: nummeriert(LISTE_F6)
    },
    F7: {
      typ: "mehrfach", frage: "Wird der KI-Dienst in einem der folgenden Bereiche für einen der genannten Zwecke eingesetzt?", keine: "Keiner",
      hilfe: "Wählen Sie nur Bereiche aus, in denen der KI-Dienst tatsächlich für einen der genannten Zwecke eingesetzt wird. Die Branche des Unternehmens allein genügt nicht. Wenn keiner der Zwecke zutrifft, wählen Sie „Keiner“. Sind Sie unsicher, wählen Sie „Unklar“.",
      optionen: nummeriert(LISTE_F7)
    },
    F8: {
      typ: "einfach", frage: "Werden dabei personenbezogene Daten automatisiert ausgewertet, um persönliche Aspekte einer Person zu bewerten?",
      hilfe: "Gemeint ist, dass der KI-Dienst Daten über eine Person auswertet, um etwa ihre Arbeitsleistung, wirtschaftliche Lage, Gesundheit, Interessen, Zuverlässigkeit oder ihr Verhalten einzuschätzen.",
      optionen: JA_NEIN_UNKLAR
    },
    F9: {
      typ: "mehrfach", frage: "Trifft eine der folgenden Aussagen zu?", keine: "Keine",
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
      hilfe: "Gemeint sind Texte, die sich an die Allgemeinheit richten, zum Beispiel auf der Website, in sozialen Medien oder in Pressemitteilungen. Ob eine Meldung Ihres Unternehmens ein Thema von öffentlichem Interesse betrifft, ist eine Rechtsfrage. Wählen Sie im Zweifel „Unklar“.",
      optionen: JA_NEIN_UNKLAR
    },
    F12: {
      typ: "einfach", frage: "Werden personenbezogene Daten in den KI-Dienst eingegeben oder von ihm verarbeitet?",
      hilfe: "Personenbezogen sind alle Angaben, die sich einer bestimmten Person zuordnen lassen, zum Beispiel Namen, Kontaktdaten, Kundennummern, Bewerbungsunterlagen oder E-Mails mit Absender.",
      optionen: JA_NEIN_UNKLAR
    },
    F13: {
      typ: "einfach", frage: "Sind darunter besondere Kategorien personenbezogener Daten?",
      hilfe: "Besondere Kategorien sind Daten, aus denen die rassische oder ethnische Herkunft, politische Meinungen, religiöse oder weltanschauliche Überzeugungen oder die Gewerkschaftszugehörigkeit hervorgehen. Dazu gehören außerdem genetische Daten, biometrische Daten zur eindeutigen Identifizierung einer Person, Gesundheitsdaten sowie Daten zum Sexualleben oder zur sexuellen Orientierung (Art. 9 Abs. 1 DSGVO).",
      optionen: JA_NEIN_UNKLAR
    },
    F14: { typ: "einfach", frage: "Wurde genau diese Verarbeitung datenschutzrechtlich geprüft und freigegeben?", optionen: JA_NEIN_UNKLAR },
    F15: {
      typ: "einfach", frage: "Verarbeitet eine externe Organisation die personenbezogenen Daten für den KI-Dienst?",
      hilfe: "Gemeint ist zum Beispiel das Unternehmen, das den KI-Dienst bereitstellt oder für ihn Daten verarbeitet. „Extern“ bedeutet hier außerhalb Ihres Unternehmens. Auch ein Anbieter mit Sitz in Deutschland kann extern sein. Die Frage bezieht sich auf die personenbezogenen Daten aus F12.",
      optionen: JA_NEIN_UNKLAR
    },
    F16: {
      typ: "einfach", frage: "Können die personenbezogenen Daten bei dieser Nutzung außerhalb der EU oder des Europäischen Wirtschaftsraums verarbeitet oder zugänglich gemacht werden?",
      hilfe: [
        "Daten können etwa auf Servern in einem anderen Land verarbeitet werden oder von dort zugänglich sein. Entscheidend ist daher nicht nur, wo die nutzende Person sitzt. Hinweise finden sich in den Datenschutzbedingungen und Vereinbarungen mit dem Anbieter. Kennen Sie die Verarbeitungsorte oder Zugriffsmöglichkeiten nicht, wählen Sie „Unklar“."
      ],
      optionen: JA_NEIN_UNKLAR
    },
    F17: {
      typ: "mehrfach", frage: "Trifft eine der folgenden Aussagen auf die Verarbeitung personenbezogener Daten bei dieser Nutzung zu?", keine: "Keine",
      hilfe: [
        "Gemeint ist, wofür Sie den KI-Dienst einsetzen, nicht wie er intern arbeitet.",
        "Systematische Bewertung: zum Beispiel Bewerbungen vorsortieren oder die Leistung von Beschäftigten einschätzen.",
        "Großer Umfang: zum Beispiel regelmäßig Gesundheitsdaten vieler Personen eingeben.",
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
        "Vertraulich oder geschäftskritisch: Informationen mit besonderem Schutzbedarf, zum Beispiel Verträge, Kalkulationen, Quellcode, Kundendaten oder Strategiepapiere.",
        "Die Einordnung bezieht sich auf die konkreten Inhalte, nicht allein auf den Dateityp."
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
        "Gering: Der Fehler hätte keine Folgen über die eigene Arbeit hinaus. Beispiel: ein interner Textentwurf.",
        "Spürbar für Ihr Unternehmen: Der Fehler hätte Nachteile für Ihr Unternehmen, etwa Mehraufwand, Verzögerungen oder begrenzte Kosten, ohne einzelne Personen oder Vertragspartner zu treffen. Beispiel: eine fehlerhafte interne Auswertung.",
        "Erheblich: Der Fehler kann einzelne Personen benachteiligen, rechtliche oder vertragliche Folgen haben, hohen finanziellen Schaden verursachen oder die Sicherheit gefährden. Beispiel: eine Absage an eine Bewerberin, ein fehlerhaftes Angebot an einen Kunden."
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
      hilfe: "Fachlich prüfen bedeutet, dass eine Person mit den erforderlichen Kenntnissen das Ergebnis auf inhaltliche Richtigkeit und Eignung für die Aufgabe kontrolliert. Bloßes Lesen oder eine Kontrolle von Rechtschreibung und Format genügt dafür nicht.",
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
      hilfe: "Wird ein KI-Dienst über das Internet genutzt, werden die Eingaben in der Regel auf Servern des Anbieters verarbeitet. Training bedeutet, dass der Anbieter Eingaben verwendet, um seine KI-Modelle weiterzuentwickeln. Ob er Eingaben speichert oder dafür nutzt, steht in seinen Nutzungs- und Datenschutzbedingungen. Wenn Sie diese nicht kennen, wählen Sie „Unklar“.",
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
        "Manuelle Eingabe: Inhalte werden einzeln eingetippt oder eingefügt.",
        "Erweiterung: zum Beispiel ein Browser-Plugin oder ein Assistent mit Zugriff auf Postfach, Kalender oder Dateien.",
        "Automatisierte Anbindung: Daten werden ohne einzelne Eingabeentscheidung über eine Schnittstelle übertragen."
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
    F27: { typ: "einfach", frage: "Bestehen in Ihrem Unternehmen technische Schutzmaßnahmen für die Nutzung von KI-Diensten, etwa Sperren oder eine Überwachung des Datenabflusses?", optionen: JA_NEIN_UNKLAR },
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
    2: { name: "Handlungsbedarf", bedeutung: "Ein Risikofaktor liegt vor oder lässt sich nicht ausschließen. Der Fachbereich kann ihm mit Schutzmaßnahmen begegnen." },
    3: { name: "Prüfbedarf", bedeutung: "Ein Sachverhalt liegt vor oder lässt sich nicht ausschließen, den eine zuständige Stelle prüfen sollte." },
    4: { name: "Eskalation", bedeutung: "Der Fall sollte der zuständigen Stelle vorrangig vorgelegt werden." }
  };

  // ------------------------------------------------------------ Tabelle B.1: feste Texte
  var FEST = {
    kopf: "Dieses Ergebnis ist ein Prüfhinweis auf Grundlage Ihrer Angaben. Es trifft keine Aussage über die Rechtskonformität der Nutzung.",
    abschluss: "Nach Ihren Angaben wird der KI-Dienst ausschließlich privat genutzt. Das Self-Assessment endet deshalb an dieser Stelle.",
    abschlussGrund: [
      "Das Self-Assessment bewertet KI-Nutzungen im beruflichen Zusammenhang. Shadow AI bezeichnet eine berufliche Nutzung ohne Freigabe des Unternehmens. Der EU AI Act nimmt natürliche Personen von den Betreiberpflichten aus, wenn sie ein KI-System ausschließlich persönlich und nicht beruflich verwenden (Art. 2 Abs. 10 KI-VO).",
      "Wird der KI-Dienst auch für berufliche Aufgaben genutzt, beantworten Sie die Frage zur beruflichen Nutzung mit „Ja“. Das gilt auch dann, wenn dafür ein privater Zugang verwendet wird."
    ],
    luecken: "Diese Fragen haben Sie mit „Unklar“ beantwortet. Bitte klären Sie die Sachverhalte und wiederholen Sie das Assessment.",
    widersprueche: "Einige Ihrer Antworten lassen sich nicht miteinander vereinbaren. Bitte überprüfen Sie die betroffenen Angaben. Das Ergebnis berücksichtigt derzeit beide Angaben und sollte bis zur Klärung unter diesem Vorbehalt interpretiert werden.",
    freigabezusatz: "Die Freigabe ändert das Gesamtergebnis nicht. Bitte klären Sie, ob bei der Freigabe die unten genannten Sachverhalte berücksichtigt wurden.",
    // Zusatz bei jeder Einordnung als Shadow AI: Die Stufe ist keine Erlaubnis.
    shadowZusatz: "Die Reaktionsstufe bewertet die erfassten Risikofaktoren. Sie ersetzt keine Freigabe und hebt eine bestehende Untersagung nicht auf.",
    // Erklärung des Begriffs, der in vielen Hinweisen und Empfehlungen vorkommt
    zustaendigeStelle: "Die zuständige Stelle ist die Person oder Einheit, die in Ihrem Unternehmen für Fragen zur KI-Nutzung benannt ist. Gibt es keine, wenden Sie sich an die Unternehmensleitung.",
    // Herkunft des Gesamtergebnisses. {bereiche} wird durch die Namen der Bereiche ersetzt.
    gesamtEinBereich: "Das Gesamtergebnis ergibt sich aus dem Bereich {bereiche}. Dort ist die Stufe am höchsten.",
    gesamtMehrereBereiche: "Das Gesamtergebnis ergibt sich aus den Bereichen {bereiche}. Dort ist die Stufe am höchsten.",
    gesamtKeinBereich: "In keinem der drei Bereiche ergibt sich ein besonderer Prüf- oder Handlungsbedarf.",
    empfehlungenEinleitung: "Auf Grundlage Ihrer Antworten wurden die folgenden nächsten Schritte ermittelt. Die Empfehlungen berücksichtigen, welche organisatorischen Schutzmaßnahmen in Ihrem Unternehmen bereits vorhanden sind."
  };
  // Stellen, an denen die Oberfläche die Erklärung der zuständigen Stelle anbietet (Tabelle B.1):
  // beim Gesamtergebnis ab „Prüfbedarf“ und bei der Empfehlung E5a.
  var ERKLAERUNG_STELLE = { stufen: [3, 4], empfehlungen: ["E5a"] };

  // ------------------------------------------------------------ Tabelle B.1: widersprüchliche Angaben
  // Kennungen wie in regeln.js, widersprueche()
  var WIDERSPRUECHE = {
    "W1": { fragen: ["F12", "F8"], text: "Sie haben angegeben, dass keine personenbezogenen Daten verarbeitet werden, und zugleich, dass personenbezogene Daten automatisiert ausgewertet werden." },
    "W2 (F15)": { fragen: ["F23", "F15"], text: "Sie haben angegeben, dass die Daten das Unternehmen nicht verlassen, und zugleich, dass eine Organisation außerhalb Ihres Unternehmens die personenbezogenen Daten verarbeitet." },
    "W2 (F16)": { fragen: ["F23", "F16"], text: "Sie haben angegeben, dass die Daten das Unternehmen nicht verlassen, und zugleich, dass die personenbezogenen Daten außerhalb der EU oder des Europäischen Wirtschaftsraums verarbeitet oder zugänglich gemacht werden können." }
  };
  var EINORDNUNG = {
    "Shadow AI": { titel: "Shadow AI", text: "Sie haben angegeben, dass der KI-Dienst beruflich genutzt wird und die Nutzung weder freigegeben noch in Prüfung ist. Damit erfüllt sie nach Ihren Angaben die Merkmale von Shadow AI." },
    "keine Shadow AI": { titel: "Keine Shadow AI", text: "Sie haben angegeben, dass die Nutzung des KI-Dienstes freigegeben ist. Auf Grundlage dieser Angabe wird sie nicht als Shadow AI eingestuft.", hinweis: "Die Freigabe wurde durch das Assessment nicht unabhängig überprüft und schließt andere Risiken nicht aus." },
    // Marke und Text nennen den Freigabestand. Der Hinweis nennt die Einordnung und ihr Kriterium.
    "keine Shadow AI, Freigabe steht aus": { titel: "Freigabe in Prüfung", text: "Sie haben angegeben, dass die Freigabe der KI-Nutzung derzeit durch Ihr Unternehmen geprüft wird. Eine abschließende Freigabe liegt nach Ihren Angaben noch nicht vor.", hinweis: "Läuft für eine Nutzung ein Prüf- oder Freigabeverfahren, gilt sie in diesem Assessment nicht als Shadow AI." },
    "unklar": { titel: "Shadow AI nicht ausgeschlossen", text: "Nach Ihren Angaben lässt sich nicht ausschließen, dass die Nutzung die Merkmale von Shadow AI erfüllt. Bitte klären Sie die offenen Angaben unter „Wissenslücken“." }
  };

  // ------------------------------------------------------------ Tabellen B.2 bis B.4: Hinweise
  var HINWEISE = {
    "R1": "Es gibt Hinweise, dass das Unternehmen als Anbieter gelten könnte (Art. 25 Abs. 1 KI-VO). Bitte lassen Sie die Rolle prüfen.",
    "R2 (Eskalation)": "Die Nutzung könnte eine verbotene KI-Praktik betreffen (Art. 5 KI-VO). Bitte legen Sie den Fall umgehend der zuständigen Stelle vor.",
    "R2 Zusatz Geltungsbeginn": "Dieses Verbot gilt ab dem 2. Dezember 2026.",
    "R2 (Pruefbedarf)": "Eine verbotene KI-Praktik lässt sich nach Ihren Angaben nicht ausschließen. Bitte lassen Sie dies klären.",
    "R3": "Die Nutzung könnte in einen Bereich des Anhangs III fallen. Bitte lassen Sie die Einstufung als Hochrisiko-KI-System prüfen. Die Vorschriften gelten ab dem 2. Dezember 2027.",
    "R3 Zusatz Profiling": "Bei Profiling greift die Ausnahme nach Art. 6 Abs. 3 KI-VO nicht.",
    "R3 Zusatz Profiling unklar": "Bitte klären Sie, ob ein Profiling vorliegt. In diesem Fall greift die Ausnahme nach Art. 6 Abs. 3 KI-VO nicht.",
    "R4": "Bei einer Einstufung als Hochrisiko-KI-System gelten Betreiberpflichten nach Art. 26 KI-VO.",
    "R4 Zusatz Art. 27": "Bitte lassen Sie prüfen, ob eine Grundrechte-Folgenabschätzung nach Art. 27 KI-VO erforderlich ist.",
    "R5": "Bitte lassen Sie prüfen, ob Transparenzpflichten nach Art. 50 Abs. 3 oder 4 KI-VO bestehen.",
    "D1": "Es werden personenbezogene Daten verarbeitet oder dies ist unklar. Bitte lassen Sie Rechtsgrundlage und Zweck prüfen.",
    "D2 (Eskalation)": "Es werden besondere Kategorien personenbezogener Daten verarbeitet, ohne dass eine Prüfung und Freigabe bekannt ist. Bitte legen Sie den Fall umgehend der zuständigen Stelle vor.",
    // D2 mit Prüfbedarf hat zwei Wortlaute, je nachdem, welche Antwort die Regel auslöst
    "D2 (Pruefbedarf) bei F14 Ja": "Es werden besondere Kategorien personenbezogener Daten verarbeitet. Eine Prüfung und Freigabe liegt nach Ihren Angaben vor.",
    "D2 (Pruefbedarf) bei F13 Unklar": "Bitte klären Sie, ob besondere Kategorien personenbezogener Daten betroffen sind.",
    "D3": "Ein externer Anbieter verarbeitet die Daten oder dies ist unklar. Bitte lassen Sie die datenschutzrechtliche Rolle des Anbieters prüfen. Falls eine Auftragsverarbeitung vorliegt, ist zu klären, ob die erforderliche Vereinbarung besteht (Art. 28 Abs. 3 DSGVO).",
    "D4": "Eine Übermittlung in Länder außerhalb der EU oder des EWR ist möglich oder unklar. Bitte lassen Sie deren Zulässigkeit prüfen.",
    "D5": "Bitte lassen Sie prüfen, ob eine Datenschutz-Folgenabschätzung erforderlich ist.",
    "S1": "Interne oder vertrauliche Informationen können das Unternehmen verlassen.",
    "S2": "Die KI-Ergebnisse haben maßgeblichen Einfluss oder werden nicht durchgehend geprüft, und ein Fehler hätte Folgen.",
    "S3": "Die Nutzung ist nicht freigegeben oder für das Unternehmen nicht vollständig nachvollziehbar.",
    "S4": "Die Daten können den Bedingungen eines externen Anbieters unterliegen.",
    "K1": "Vertrauliche Informationen können an einen Anbieter gelangen, der sie speichern oder zum Training nutzen kann oder dessen Bedingungen unklar sind.",
    "K2": "Folgenreiche Ergebnisse werden möglicherweise unzureichend geprüft in einer Nutzung verwendet, die dem Unternehmen nicht bekannt oder nicht nachvollziehbar ist."
  };

  // Bezeichnungen der Regeln und Risikofelder (Tabelle 4 und Abschnitt 5.3.2)
  var REGELNAMEN = {
    R1: "Mögliche Anbieterrolle", R2: "Verbotene KI-Praktiken", R3: "Mögliche Einstufung als Hochrisiko-KI-System",
    R4: "Betreiberpflichten", R5: "Transparenzpflichten",
    D1: "Verarbeitung personenbezogener Daten", D2: "Besondere Kategorien personenbezogener Daten",
    D3: "Verarbeitung durch einen externen Anbieter", D4: "Mögliche Drittlandübermittlung",
    D5: "Datenschutz-Folgenabschätzung",
    S1: "Externalisierung sensibler Informationen", S2: "Integrität und Verlässlichkeit der Ergebnisse",
    S3: "Transparenz und Nachvollziehbarkeit", S4: "Abhängigkeit von den Bedingungen externer Anbieter",
    K1: "Kombinationsregel K1", K2: "Kombinationsregel K2"
  };
  // Kurznamen der drei Bereiche in der Übersicht des Gesamtergebnisses
  var BEREICHE = { R: "EU AI Act", D: "Datenschutz", S: "Shadow AI" };
  var PFADE = {
    R: "Regulatorische Einordnung (EU AI Act)",
    D: "Datenschutzrechtliche Einordnung",
    S: "Shadow-AI-Risikobewertung"
  };

  // ------------------------------------------------------------ Tabelle B.5: Handlungsempfehlungen
  // Bezeichnung der Schutzmaßnahme, auf die sich eine Empfehlung bezieht (Tabelle 18)
  // Stand einer Schutzmaßnahme, wie er im Etikett einer Empfehlung erscheint
  var ZUSTAENDE = { vorhanden: "vorhanden", fehlt: "fehlt", unklar: "unklar" };
  var MASSNAHMEN = {
    E1: "KI-Richtlinie", E2: "Schulung", E3: "Technische Schutzmaßnahmen", E4: "Vorgeschriebene fachliche Prüfung",
    E5a: "Zuständige Stelle", E5b: "Freigabeverfahren", E6: "Freigegebene Alternative",
    E7: "Privater Zugang"            // kein Stand, das Etikett nennt den Anlass
  };
  // vorhanden: Maßnahme vorhanden. fehlt: Maßnahme fehlt oder ist unklar.
  // text: Empfehlung ohne Schutzmaßnahme, die unabhängig von einem Stand gilt.
  var EMPFEHLUNGEN = {
    "E1": { vorhanden: "Prüfen Sie, ob die KI-Richtlinie Ihres Unternehmens diesen KI-Dienst und diese Aufgabe abdeckt, und halten Sie sich an ihre Vorgaben.", fehlt: "Fragen Sie Ihre Führungskraft oder die zuständige Stelle, welche Regeln für diesen KI-Dienst gelten. Gibt es keine, regen Sie solche Regeln an." },
    "E2": { fehlt: "Fragen Sie nach einer Schulung zum Umgang mit KI. Nach Art. 4 KI-VO unterstützen Unternehmen den Aufbau der KI-Kompetenz ihres Personals." },
    "E3": { vorhanden: "Fragen Sie bei Ihrer IT nach, ob die vorhandenen technischen Schutzmaßnahmen auch diesen KI-Dienst erfassen.", fehlt: "Lassen Sie von Ihrer IT prüfen, welche technischen Schutzmaßnahmen für diesen KI-Dienst nötig sind." },
    "E4": { vorhanden: "Lassen Sie die Ergebnisse in diesem Nutzungsfall wie vorgeschrieben fachlich prüfen, bevor Sie sie verwenden.", fehlt: "Legen Sie mit Ihrer Führungskraft fest, wer die Ergebnisse vor der Verwendung fachlich prüft." },
    "E4 Zusatz Art. 26 Abs. 2": { fehlt: "Bei einem Hochrisiko-KI-System muss diese Prüfung bei Personen liegen, die dafür geeignet sind (Art. 26 Abs. 2 KI-VO)." },
    "E5a": { vorhanden: "Legen Sie den Fall der zuständigen Stelle vor. Geben Sie dabei dieses Ergebnis weiter, zum Beispiel als PDF.", fehlt: "Klären Sie, welche Stelle im Unternehmen für KI-Nutzungen zuständig ist, etwa über Ihre Führungskraft oder Ihre IT." },
    "E5b": { vorhanden: "Beantragen Sie für diese Nutzung eine Freigabe über das bestehende Freigabeverfahren.", fehlt: "Fragen Sie bei der zuständigen Stelle nach, wie Sie für diese Nutzung eine Freigabe erhalten." },
    "E6": { vorhanden: "Prüfen Sie, ob Sie die Aufgabe mit der freigegebenen KI-Alternative Ihres Unternehmens erledigen können.", fehlt: "Melden Sie der zuständigen Stelle, für welche Aufgabe Sie einen KI-Dienst benötigen." },
    "E7": { text: "Fragen Sie, ob Ihr Unternehmen für diesen KI-Dienst einen Unternehmenszugang bereitstellt, und nutzen Sie diesen statt des privaten Zugangs." }
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
    "E7": { text: "Unternehmenszugang klären" }
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
    privat: "Nach Ihren Angaben wird der KI-Dienst über einen privaten Zugang genutzt."
  };
  // Auslösende Sachverhalte in Alltagssprache, abgeleitet aus den Hinweisen der Tabellen B.2 bis B.4
  var SACHVERHALT_KURZ = {
    R1: "Ihr Unternehmen könnte als Anbieter des KI-Systems gelten.",
    R2: "Die Nutzung könnte eine verbotene KI-Praktik betreffen.",
    R3: "Die Nutzung könnte als Hochrisiko-KI-System eingestuft werden.",
    R4: "Bei einer Einstufung als Hochrisiko-KI-System gelten besondere Pflichten für Ihr Unternehmen.",
    R5: "Es könnten Pflichten bestehen, KI-Inhalte zu kennzeichnen.",
    D1: "Es werden personenbezogene Daten verarbeitet, oder dies ist unklar.",
    D2: "Besonders geschützte personenbezogene Daten sind betroffen, oder dies ist unklar.",
    D3: "Ein externer Anbieter verarbeitet die Daten, oder dies ist unklar.",
    D4: "Daten könnten in Länder außerhalb der EU gelangen.",
    D5: "Eine Datenschutz-Folgenabschätzung könnte erforderlich sein.",
    S1: "Interne oder vertrauliche Informationen können das Unternehmen verlassen.",
    S2: "KI-Ergebnisse werden nicht durchgehend geprüft, obwohl ein Fehler Folgen hätte.",
    S3: "Die Nutzung ist nicht freigegeben oder für Ihr Unternehmen nicht nachvollziehbar.",
    S4: "Die Daten unterliegen den Bedingungen eines externen Anbieters.",
    K1: "Vertrauliche Informationen können an einen Anbieter gelangen, der sie speichern oder zum Training nutzen kann.",
    K2: "Folgenreiche Ergebnisse werden möglicherweise ungeprüft verwendet."
  };
  // Kurze Erklärung, worin sich Freigabe, Alternative und Unternehmenszugang unterscheiden
  var EMPFEHLUNG_ERKLAERUNG = {
    E5b: "Freigabe: Ihr Unternehmen prüft und erlaubt genau diese Nutzung, also diesen KI-Dienst für diese Aufgabe.",
    E6: "Alternative: Sie nutzen statt dieses KI-Dienstes einen anderen, den Ihr Unternehmen bereits freigegeben hat.",
    E7: "Unternehmenszugang: Sie nutzen denselben KI-Dienst, aber über ein Konto, das Ihr Unternehmen bereitstellt."
  };




  // ------------------------------------------------------------ Texte der Oberfläche
  // Diese Texte stehen nicht in den Anhängen der Arbeit. Sie führen durch die Seite.
  // {name} in geschweiften Klammern ist ein Platzhalter, den app.js durch einen Wert ersetzt.
  var OBERFLAECHE = {
    titel: "Shadow-AI-Self-Assessment",
    // Startseite: Überschrift in zwei Teilen, der zweite ist farbig hervorgehoben
    start: {
      vorzeile: "Shadow-AI-Risiken einschätzen",
      titelAnfang: "Wie riskant ist Ihre",
      titelAkzent: "KI-Nutzung?",
      hintergrundVorzeile: "Regulatorischer Kontext",
      hintergrundAuf: "Regulatorischen Kontext einblenden",
      hintergrundZu: "Regulatorischen Kontext ausblenden",
      band: [
        { titel: "30 Fragen", text: "In fünf Blöcken" },
        { titel: "Drei Bereiche", text: "Shadow AI, EU AI Act und Datenschutz" },
        { titel: "Konkrete Empfehlungen", text: "Für Ihre nächsten Schritte" }
      ]
    },
    // Einleitung der Startseite: Die Info-Schaltfläche zu Shadow AI steht hinter dem ersten Satz.
    startText: "Bewerten Sie in 30 Fragen einen konkreten KI-Nutzungsfall.",
    startText2: "Im Mittelpunkt steht Shadow AI, ergänzt um EU AI Act und Datenschutz.",
    // Erklärung des Begriffs Shadow AI hinter dem Einleitungstext (Abschnitt 2.1.2, Tabelle 14)
    shadowAiFrage: "Was ist Shadow AI?",
    shadowAi: [
      "Shadow AI bezeichnet die berufliche Nutzung von KI-Diensten, die vom Unternehmen nicht freigegeben ist und sich seiner Steuerung und Aufsicht entzieht. Läuft für die Nutzung bereits ein Prüf- oder Freigabeverfahren, gilt sie hier nicht als Shadow AI. Weiß das Unternehmen von der Nutzung, ohne sie freigegeben zu haben, gilt sie dagegen als Shadow AI. Ob dafür ein privates Konto oder ein Zugang des Unternehmens verwendet wird, ist für die Einordnung nicht entscheidend.",
      "Das Self-Assessment lässt sich auch für freigegebene Nutzungen verwenden. Das Ergebnis weist dann aus, dass keine Shadow AI vorliegt."
    ],
    startPunkte: [
      { titel: "Nachvollziehbare Risikobewertung", text: "Reaktionsstufe mit Begründung und Empfehlungen." },
      { titel: "Orientierung statt Rechtsprüfung", text: "Ein Prüfhinweis, keine Aussage zur Rechtskonformität." },
      { titel: "Keine Speicherung Ihrer Angaben", text: "Ihre Angaben bleiben in diesem Browserfenster und werden nicht gespeichert." }
    ],
    beginnen: "Assessment beginnen",
    weiter: "Weiter",
    zurueck: "Zurück",
    auswerten: "Ergebnis anzeigen",
    abschliessen: "Assessment abschließen",
    pflicht: "Bitte beantworten Sie diese Frage.",
    pflichtSammel: "Bitte beantworten Sie alle Fragen dieses Blocks.",
    erlaeuterung: "Erläuterung zur Frage",
    infoStelle: "Was ist die zuständige Stelle?",
    mehrfachHinweis: "Mehrere Angaben möglich",
    drucken: "Ergebnis drucken oder als PDF sichern",
    aendern: "Antworten ändern",
    neu: "Neues Assessment",
    ergebnis: "Ergebnis",
    unklar: "Unklar",
    standRegelbasis: "Stand der Regelbasis: {stand}",
    blockZaehler: "Block {aktuell} von {letzter}",
    abschlussTitel: "Abschluss nach der Vorprüfung",
    abschlussFrage: "Warum endet das Assessment hier?",
    ergebnisTitel: "Ergebnis des Self-Assessments",
    erstellt: "Erstellt am {datum} um {zeit} Uhr. Stand der Regelbasis: {stand}.",
    gesamtTitel: "Gesamtergebnis",
    gesamtStufe: "Stufe {stufe} von 4: {name}",
    matrixBeschreibung: "Gesamtergebnis Stufe {gesamt} von 4, {name}. Regulatorischer Pfad Stufe {R}, Datenschutz Stufe {D}, Shadow-AI-Pfad Stufe {S}.",
    ausloeser: "Auslösende Antworten",
    lueckenTitel: "Wissenslücken",
    statusTitel: "Status der KI-Nutzung",
    risikofaktorenTitel: "Bewertung einzelner Risikofaktoren",
    regelbasisHinweis: "Die Einstufung beruht ausschließlich auf den abgefragten Sachverhalten und den hinterlegten Bewertungsregeln.",
    warum: "Warum diese Empfehlung?",
    // Erklärung der Stufe im Bereich Shadow AI, je Stufe
    shadowStufe: {
      1: "Die erfassten Risikofaktoren haben nach den hinterlegten Bewertungsregeln keine erhöhte Reaktionsstufe ausgelöst.",
      2: "Mindestens ein Risikofaktor hat die Stufe „Handlungsbedarf“ ausgelöst. Der Fachbereich kann ihm mit Schutzmaßnahmen begegnen.",
      3: "Mindestens ein Risikofaktor hat die Stufe „Prüfbedarf“ ausgelöst. Eine zuständige Stelle sollte den Fall prüfen.",
      4: "Eine Kombination von Risikofaktoren hat die Stufe „Eskalation“ ausgelöst. Der Fall sollte der zuständigen Stelle vorrangig vorgelegt werden."
    },
    widerspruecheTitel: "Widersprüchliche Angaben erkannt",
    empfehlungenTitel: "Empfohlene nächste Schritte",
    keineEmpfehlungen: "Aus Ihren Angaben ergeben sich keine Handlungsempfehlungen.",
    etikett: "{massnahme}: {zustand}",
    aufzaehlungUnd: " und ",
    eingabeLeeren: "Eingabe löschen",
    sachverhalteAnzahl: "Erfasste Sachverhalte ({anzahl})",
    infoZeichen: "i",
    fortschritt: "{beantwortet} von {gesamt} Fragen beantwortet",
    fallDienst: "KI-Dienst:",
    fallAufgabe: "Nutzung:",
    fallKategorie: "Kategorie:",
    fuss: "Stand der Regelbasis: " + STAND + ". Ihre Angaben werden nur in diesem Browserfenster verarbeitet, nicht übertragen und nicht gespeichert."
  };

  // Geltungsbeginn nach Art. 113 KI-VO in der Fassung der Verordnung (EU) 2026/1744.
  // Die Übersicht dient der Orientierung auf der Startseite und geht in keine Regel ein.
  var TERMINE = {
    titel: "Wichtige Meilensteine des EU AI Acts",
    einleitung: "Der EU AI Act gilt schrittweise. Hier finden Sie die wichtigsten bisherigen und kommenden Termine.",
    monate: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    // Amtliche Fassung der Verordnung (EU) 2024/1689 auf EUR-Lex. Öffnet sich nur auf Klick in einem neuen Fenster.
    link: { text: "Weitere Informationen zum EU AI Act", adresse: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj", hinweis: "öffnet EUR-Lex in einem neuen Fenster" },
    heute: "Heute",
    quelle: "Art. 113 KI-VO in der Fassung der Verordnung (EU) 2026/1744",
    eintraege: [
      { datum: "2025-02-02", anzeige: "2. Februar 2025", titel: "Verbotene Praktiken und KI-Kompetenz", text: "Kapitel I und II, darunter Art. 4 und Art. 5" },
      { datum: "2025-08-02", anzeige: "2. August 2025", titel: "KI-Modelle mit allgemeinem Verwendungszweck", text: "Pflichten der Anbieter solcher Modelle" },
      { datum: "2026-08-02", anzeige: "2. August 2026", titel: "Allgemeiner Geltungsbeginn", text: "Darunter die Transparenzpflichten nach Art. 50" },
      { datum: "2026-12-02", anzeige: "2. Dezember 2026", titel: "Weitere verbotene Praktiken", text: "Art. 5 Abs. 1 Buchst. ba und bb" },
      { datum: "2027-12-02", anzeige: "2. Dezember 2027", titel: "Hochrisiko-KI-Systeme nach Anhang III", text: "Zum Beispiel Beschäftigung, Bildung, grundlegende Dienste" },
      { datum: "2028-08-02", anzeige: "2. August 2028", titel: "Hochrisiko-KI-Systeme nach Anhang I", text: "KI in Produkten, die unter Harmonisierungsvorschriften fallen" }
    ]
  };

  var api = {
    TERMINE: TERMINE,
    STAND: STAND, EINLEITUNG: EINLEITUNG, BLOECKE: BLOECKE, FRAGEN: FRAGEN, STUFEN: STUFEN,
    FEST: FEST, ERKLAERUNG_STELLE: ERKLAERUNG_STELLE, WIDERSPRUECHE: WIDERSPRUECHE, EINORDNUNG: EINORDNUNG, HINWEISE: HINWEISE, REGELNAMEN: REGELNAMEN, PFADE: PFADE, BEREICHE: BEREICHE,
    EMPFEHLUNGEN: EMPFEHLUNGEN, EMPFEHLUNG_TITEL: EMPFEHLUNG_TITEL, EMPFEHLUNG_GRUND: EMPFEHLUNG_GRUND, SACHVERHALT_KURZ: SACHVERHALT_KURZ, EMPFEHLUNG_ERKLAERUNG: EMPFEHLUNG_ERKLAERUNG, MASSNAHMEN: MASSNAHMEN, ZUSTAENDE: ZUSTAENDE, OBERFLAECHE: OBERFLAECHE
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else wurzel.Inhalte = api;
})(typeof window !== "undefined" ? window : this);
