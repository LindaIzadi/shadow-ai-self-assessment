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
    fallTitel: "Ihre KI-Nutzung",
    // Kurzanleitung im Kasten „Ihr Nutzungsfall“ auf der Startseite
    fallAnleitung: "Wählen Sie einen KI-Dienst und beschreiben Sie, wofür Sie ihn bei Ihrer Arbeit einsetzen.",
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
    aufgabeTitel: "Welche Aufgabe erledigen Sie mit KI?",
    // Beispiele als Platzhalter im Feld, darunter ein sichtbarer Hinweis
    aufgabePlatzhalter: "z. B. E-Mails formulieren",
    aufgabeHinweis: "Beschreiben Sie kurz, was die KI für Sie tun soll.",
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
        "Bekannt, aber nicht freigegeben: Die zuständige Stelle oder Unternehmensleitung weiß bereits von dieser konkreten Nutzung. Eine Prüfung läuft jedoch nicht.",
        "Nein, die Nutzung wurde abgelehnt: Die zuständige Stelle oder Unternehmensleitung hat diese konkrete Nutzung ausdrücklich abgelehnt oder untersagt.",
        "Dem Unternehmen nicht bekannt: Die konkrete Nutzung wurde der zuständigen Stelle oder Unternehmensleitung bisher nicht mitgeteilt und ist ihr nach Ihrem Wissen auch sonst nicht bekannt."
      ],
      optionen: [
        { wert: "freigegeben", text: "Ja, nach einem Prüf- oder Freigabeverfahren" },
        { wert: "in Pruefung", text: "Noch nicht, die Prüfung oder Freigabe läuft" },
        { wert: "bekannt, nicht freigegeben", text: "Bekannt, aber nicht freigegeben" },
        { wert: "abgelehnt", text: "Nein, die Nutzung wurde abgelehnt" },
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
      hilfe: [
        "Die genannten Verwendungen können nach Art. 5 KI-VO verboten sein. Ob ein Verbot tatsächlich greift, hängt von weiteren Voraussetzungen und Ausnahmen ab, etwa bei der Emotionserkennung aus medizinischen oder Sicherheitsgründen. Die rechtliche Einordnung übernimmt die zuständige Stelle.",
        "Unterschwellige, manipulative oder täuschende Techniken: Verfahren, die Menschen beeinflussen, ohne dass sie es bemerken oder durchschauen, sodass sie Entscheidungen treffen, die ihnen schaden können.",
        "Bewertung nach Sozialverhalten: Personen erhalten zum Beispiel eine Punktzahl, die zu Nachteilen in Bereichen führt, die mit dem ursprünglichen Anlass nichts zu tun haben.",
        "Sind Sie unsicher, wählen Sie „Unklar“."
      ],
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
      hilfe: [
        "Öffentliche Einrichtung: zum Beispiel Behörden, Kommunen, öffentliche Schulen oder Hochschulen.",
        "Öffentliche Dienste: Leistungen im Interesse der Allgemeinheit, die auch private Unternehmen erbringen können, zum Beispiel in Bildung, Gesundheitsversorgung, sozialen Diensten oder Wohnraumversorgung.",
        "Kreditwürdigkeit und Versicherungen: Die Nutzung dient dazu, die Kreditwürdigkeit von Personen zu bewerten oder Risiken und Preise bei Lebens- oder Krankenversicherungen festzulegen.",
        "Die rechtliche Einordnung müssen Sie nicht selbst vornehmen. Sind Sie unsicher, wählen Sie „Unklar“."
      ],
      optionen: nummeriert([
        "Ihr Unternehmen ist eine öffentliche Einrichtung",
        "Ihr Unternehmen erbringt öffentliche Dienste",
        "Die Nutzung betrifft die Kreditwürdigkeit",
        "Die Nutzung betrifft Lebens- oder Krankenversicherungen"
      ])
    },
    F10: {
      typ: "einfach", frage: "Werden Bild-, Ton- oder Videoinhalte erzeugt oder verändert, die täuschend echt wirken?",
      hilfe: [
        "Gemeint sind beispielsweise mit KI erzeugte oder veränderte Bilder, Stimmen oder Videos, die echten Personen, Gegenständen, Orten oder Ereignissen ähneln und wie authentische Aufnahmen wirken können.",
        "Entscheidend ist, ob der Inhalt bei anderen Personen den Eindruck erwecken könnte, dass er echt ist.",
        "Wenn Sie unsicher sind, wählen Sie „Unklar“."
      ],
      optionen: JA_NEIN_UNKLAR
    },
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
        "Personenbezogene Daten sind Informationen, die sich auf eine bestimmte oder bestimmbare Person beziehen.",
        "Beispiele sind Namen, persönliche oder geschäftliche E-Mail-Adressen, Kundennummern, Bewerbungsunterlagen sowie Informationen über Beschäftigte oder Kunden.",
        "Solche Daten können auch in hochgeladenen Dateien und Dokumenten enthalten sein oder automatisch über Schnittstellen an den KI-Dienst übermittelt werden.",
        "Auch wenn eine Person nicht namentlich genannt wird, können Informationen personenbezogen sein, wenn die Person dadurch identifiziert werden kann.",
        "Wenn Sie unsicher sind, wählen Sie „Unklar“."
      ],
      optionen: JA_NEIN_UNKLAR
    },
    F13: {
      typ: "einfach", frage: "Werden bei dieser KI-Nutzung besonders sensible personenbezogene Daten verarbeitet, beispielsweise Gesundheitsdaten oder Informationen über die religiöse Überzeugung einer Person?",
      hilfe: [
        "Nach Art. 9 Abs. 1 DSGVO gehören dazu Informationen über:",
        "- Gesundheit, beispielsweise Diagnosen oder Krankmeldungen",
        "- Religion oder Weltanschauung",
        "- politische Meinungen",
        "- Gewerkschaftszugehörigkeit",
        "- rassische oder ethnische Herkunft",
        "- genetische Daten",
        "- biometrische Daten zur eindeutigen Identifizierung",
        "- Sexualleben oder sexuelle Orientierung",
        "Auch wenn diese Informationen nur in einem hochgeladenen Dokument enthalten sind, können sie vom KI-Dienst verarbeitet werden."
      ],
      optionen: JA_NEIN_UNKLAR
    },
    F14: {
      typ: "einfach", frage: "Wurde die Verarbeitung personenbezogener Daten für diese Aufgabe mit diesem KI-Dienst durch Ihr Unternehmen datenschutzrechtlich geprüft und freigegeben?",
      hilfe: [
        "Gemeint ist, ob Ihr Unternehmen geprüft hat, dass personenbezogene Daten für diese konkrete Aufgabe mit dem KI-Dienst verarbeitet werden dürfen.",
        "Die allgemeine Freigabe eines KI-Dienstes bedeutet nicht automatisch, dass auch die Verarbeitung personenbezogener Daten für jeden Zweck erlaubt ist."
      ],
      optionen: [
        { wert: "Ja", text: "Ja, die Verarbeitung wurde geprüft und freigegeben" },
        { wert: "Nein", text: "Nein, sie wurde nicht geprüft oder nicht freigegeben" },
        { wert: "Unklar", text: "Unklar" }
      ]
    },
    F15: {
      typ: "einfach", frage: "Werden personenbezogene Daten bei dieser KI-Nutzung an einen externen Anbieter übermittelt oder von ihm verarbeitet?",
      hilfe: [
        "Ein externer Anbieter ist beispielsweise das Unternehmen, das den KI-Dienst bereitstellt.",
        "Wenn Sie personenbezogene Daten in einen externen KI-Dienst eingeben und diese an dessen Server übertragen werden, werden die Daten dort verarbeitet. Das gilt auch dann, wenn der Anbieter sie nicht zum Training seiner KI-Modelle verwendet oder dauerhaft speichert.",
        "Wählen Sie „Nein“ nur, wenn Ihr Unternehmen den KI-Dienst selbst auf eigenen Systemen betreibt. Wissen Sie das nicht, wählen Sie „Unklar“.",
        "_Die Frage bezieht sich auf die personenbezogenen Daten aus F12. Wo die Daten verarbeitet werden, fragt F16."
      ],
      optionen: JA_NEIN_UNKLAR
    },
    F16: {
      typ: "einfach", frage: "Können personenbezogene Daten bei dieser KI-Nutzung an Empfänger außerhalb der EU und des Europäischen Wirtschaftsraums (EWR) übermittelt werden oder von dort aus zugänglich sein?",
      hilfe: [
        "Auch wenn ein KI-Dienst Daten auf Servern innerhalb Europas speichert, können unter bestimmten Umständen Personen oder Organisationen außerhalb der EU und des EWR darauf zugreifen, beispielsweise im Rahmen des technischen Supports.",
        "Entscheidend ist nicht allein der Unternehmenssitz des KI-Anbieters, sondern ob personenbezogene Daten an Empfänger außerhalb der EU und des EWR übermittelt oder ihnen zugänglich gemacht werden.",
        "Zum EWR gehören neben der EU auch Island, Liechtenstein und Norwegen.",
        "Wenn Sie dies nicht sicher wissen, wählen Sie „Unklar“.",
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
        "Trifft keines der Merkmale zu, kann eine Datenschutz-Folgenabschätzung im Einzelfall dennoch erforderlich sein.",
        "Sind Sie unsicher, wählen Sie „Unklar“."
      ],
      optionen: nummeriert([
        "Personen werden strukturiert und systematisch bewertet; die Bewertung beeinflusst Entscheidungen über diese Personen",
        "Besondere Kategorien personenbezogener Daten, etwa Gesundheitsdaten, werden in großem Umfang verarbeitet",
        // weiter gefasst als Art. 35 Abs. 3 lit. c DSGVO (öffentlich zugängliche Bereiche), dient als Hinweis
        "Personen werden mithilfe des KI-Dienstes systematisch überwacht, beispielsweise durch die regelmäßige Auswertung ihres Verhaltens oder ihrer Aktivitäten"
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
        "Speichert der Anbieter die Eingaben nur zeitweise, etwa für Sicherheitsprüfungen oder zur Fehleranalyse, und nutzt sie nicht zum Training, wählen Sie die zweite Antwort.",
        "Ob der Anbieter Eingaben zum Training nutzen darf, steht in seinen Nutzungs- und Datenschutzbedingungen. Wenn Sie diese nicht kennen, wählen Sie „Unklar“."
      ],
      optionen: [
        { wert: "lokal", text: "Die Daten werden ausschließlich auf eigenen Geräten oder unternehmenseigenen Servern verarbeitet" },
        { wert: "extern ohne", text: "Die Daten werden an einen externen Anbieter übermittelt, nach seinen Angaben aber nicht zum Training seiner KI-Modelle verwendet" },
        { wert: "extern mit", text: "Die Daten werden an einen externen Anbieter übermittelt und dürfen nach den geltenden Bedingungen auch zum Training seiner KI-Modelle verwendet werden" },
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
  // bedeutung: Erklärung der Stufe eines Bereichs (EU AI Act, Datenschutz) in den Detailergebnissen
  // gesamt:    Text unter der Überschrift des Gesamtergebnisses
  var STUFEN = {
    1: { name: "Kein besonderer Handlungsbedarf", bedeutung: "Aus den erfassten Sachverhalten ergibt sich kein besonderer Prüf- oder Handlungsbedarf.",
      gesamt: "Auf Grundlage Ihrer Antworten wurde in den geprüften Bereichen kein besonderer Handlungsbedarf festgestellt. Bitte beachten Sie weiterhin die geltenden Vorgaben Ihres Unternehmens für die Nutzung von KI-Diensten. Dies stellt keine vollständige rechtliche Freigabe dar." },
    2: { name: "Handlungsbedarf", bedeutung: "Ihre Angaben weisen auf einen Risikofaktor hin. Der Fachbereich kann ihm mit Schutzmaßnahmen begegnen.",
      gesamt: "Ihre Antworten weisen auf einzelne Risiken oder Verbesserungsmöglichkeiten bei der KI-Nutzung hin. Bitte beachten Sie die empfohlenen Maßnahmen, um die Nutzung sicher und im Einklang mit den Unternehmensvorgaben zu gestalten." },
    3: { name: "Prüfbedarf", bedeutung: "Ihre Angaben weisen auf einen möglichen Prüfbedarf hin. Ihre zuständige Stelle im Unternehmen sollte den Sachverhalt genauer prüfen.",
      gesamt: "Ihre Angaben weisen auf rechtliche oder organisatorische Fragen hin, die noch zu klären sind. Bitte wenden Sie sich an die zuständige Stelle in Ihrem Unternehmen, um gemeinsam zu prüfen, unter welchen Voraussetzungen die Nutzung möglich ist." },
    4: { name: "Eskalation", bedeutung: "Der Fall sollte der zuständigen Stelle vorrangig vorgelegt werden.",
      gesamt: "Ihre Antworten weisen auf einen Sachverhalt hin, der eine besonders sorgfältige Prüfung erfordert. Die Einstufung beschreibt die Dringlichkeit dieser Prüfung und ist keine Bewertung Ihres Verhaltens. Bitte wenden Sie sich an die zuständige Stelle in Ihrem Unternehmen, um das weitere Vorgehen gemeinsam abzustimmen. Bis zur Klärung sollte die betroffene KI-Nutzung nicht fortgesetzt werden." }
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
    gesamtEinBereich: "Die höchste Bewertung wurde im Bereich {bereiche} festgestellt. Dieser Bereich ist deshalb ausschlaggebend für Ihr Gesamtergebnis.",
    gesamtMehrereBereiche: "Die höchste Bewertung wurde in den Bereichen {bereiche} festgestellt. Diese Bereiche sind deshalb ausschlaggebend für Ihr Gesamtergebnis.",
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
    "W2 (F15)": { fragen: ["F23", "F15"], text: "Sie haben angegeben, dass die Daten ausschließlich auf eigenen Geräten oder unternehmenseigenen Servern verarbeitet werden, und zugleich, dass personenbezogene Daten an einen externen Anbieter übermittelt oder von ihm verarbeitet werden." },
    "W2 (F16)": { fragen: ["F23", "F16"], text: "Sie haben angegeben, dass die Daten ausschließlich auf eigenen Geräten oder unternehmenseigenen Servern verarbeitet werden, und zugleich, dass personenbezogene Daten an Empfänger außerhalb der EU und des Europäischen Wirtschaftsraums übermittelt werden oder von dort aus zugänglich sein können." },
    "W3": { fragen: ["F12", "F23", "F15"], text: "Sie haben angegeben, dass personenbezogene Daten verarbeitet werden und die Eingaben an einen externen Anbieter übermittelt werden, und zugleich, dass kein externer Anbieter personenbezogene Daten verarbeitet. Bitte prüfen Sie Ihre Angaben." }
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
    "R1": "Nach Ihren Angaben könnte Ihr Unternehmen bei dieser Nutzung selbst als Anbieter des KI-Systems gelten. Für Anbieter gelten nach der KI-VO andere Pflichten als für Betreiber (Art. 25 Abs. 1 KI-VO). Die zuständige Stelle in Ihrem Unternehmen kann die Rolle prüfen.",
    "R1 bei F5 Unklar": "Ob Ihr Unternehmen bei dieser Nutzung selbst als Anbieter des KI-Systems gelten könnte, ist unklar. Für Anbieter gelten nach der KI-VO andere Pflichten als für Betreiber (Art. 25 Abs. 1 KI-VO). Die zuständige Stelle in Ihrem Unternehmen kann die Rolle prüfen.",
    "R2 (Eskalation)": "Die Nutzung könnte eine verbotene KI-Praktik betreffen (Art. 5 KI-VO). Bitte legen Sie den Fall umgehend der zuständigen Stelle vor.",
    "R2 Zusatz Geltungsbeginn": "Dieses Verbot gilt ab dem 2. Dezember 2026.",
    "R2 (Pruefbedarf)": "Eine verbotene KI-Praktik lässt sich nach Ihren Angaben nicht ausschließen. Die zuständige Stelle in Ihrem Unternehmen kann klären, ob eine der genannten Verwendungen vorliegt.",
    "R3": "Nach Ihren Angaben wird der KI-Dienst in einem Bereich eingesetzt, der in Anhang III der KI-VO genannt ist. Die Nutzung könnte daher als Hochrisiko-KI-System gelten. Die zuständige Stelle in Ihrem Unternehmen kann die Einstufung prüfen. Die Vorschriften für diese Systeme gelten ab dem 2. Dezember 2027.",
    "R3 bei F7 Unklar": "Es ist unklar, ob der KI-Dienst in einem Bereich nach Anhang III der KI-VO eingesetzt wird. Die zuständige Stelle in Ihrem Unternehmen kann klären, ob die Nutzung als Hochrisiko-KI-System gelten könnte. Die Vorschriften für diese Systeme gelten ab dem 2. Dezember 2027.",
    "R3 Zusatz Profiling": "Bei Profiling greift die Ausnahme nach Art. 6 Abs. 3 KI-VO nicht.",
    "R3 Zusatz Profiling unklar": "Bitte klären Sie, ob ein Profiling vorliegt. In diesem Fall greift die Ausnahme nach Art. 6 Abs. 3 KI-VO nicht.",
    "R4": "Falls die Nutzung als Hochrisiko-KI-System eingestuft wird, gelten für Ihr Unternehmen ab dem 2. Dezember 2027 besondere Betreiberpflichten nach Art. 26 KI-VO, etwa zur menschlichen Aufsicht. Die zuständige Stelle in Ihrem Unternehmen kann klären, was dafür erforderlich ist.",
    "R4 Zusatz Art. 27": "Für öffentliche Stellen, Unternehmen mit öffentlichen Diensten sowie bei der Bewertung der Kreditwürdigkeit oder von Risiken in Lebens- und Krankenversicherungen kann vor dem ersten Einsatz eine Grundrechte-Folgenabschätzung nach Art. 27 KI-VO erforderlich sein. Die zuständige Stelle in Ihrem Unternehmen kann klären, ob dies hier zutrifft.",
    "R5": "Ihre Angaben weisen darauf hin, dass bei dieser KI-Nutzung möglicherweise Informations- oder Kennzeichnungspflichten nach Art. 50 KI-VO bestehen. Die zuständige Stelle in Ihrem Unternehmen kann klären, ob und wie über die KI-Nutzung oder KI-erstellte Inhalte informiert werden muss.",
    // D1 hat drei Wortlaute: bei F12 „Unklar“, bei F12 „Ja“ mit F14 „Ja“ und mit F14 „Nein“ oder „Unklar“
    "D1 bei F12 Unklar": "Ob personenbezogene Daten verarbeitet werden, ist nach Ihren Angaben unklar. Bitte geben Sie keine weiteren Daten in den KI-Dienst ein, bis dies geklärt ist. Die zuständige Stelle in Ihrem Unternehmen kann Sie dabei unterstützen.",
    "D1 bei F14 Ja": "Nach Ihren Angaben wurde die Verarbeitung personenbezogener Daten für diesen Anwendungsfall datenschutzrechtlich geprüft und freigegeben. Achten Sie darauf, dass die Nutzung innerhalb des freigegebenen Rahmens bleibt. Bei Änderungen oder Unsicherheiten wenden Sie sich an die zuständige Stelle in Ihrem Unternehmen.",
    "D1 bei F14 Nein oder Unklar": "Eine datenschutzrechtliche Prüfung und Freigabe dieser Verarbeitung ist nach Ihren Angaben nicht bestätigt. Jede Verarbeitung erfordert eine Rechtsgrundlage und einen festgelegten Zweck. Bitte wenden Sie sich vor der weiteren Nutzung an die zuständige Stelle in Ihrem Unternehmen, die beides prüfen kann.",
    "D2 (Eskalation)": "Nach Ihren Angaben werden besondere Kategorien personenbezogener Daten verarbeitet, ohne dass eine Prüfung und Freigabe bestätigt ist. Für diese Daten gelten besondere gesetzliche Anforderungen (Art. 9 DSGVO). Bitte legen Sie den Fall umgehend der zuständigen Stelle vor und geben Sie solche Daten bis zur Klärung nicht in den KI-Dienst ein.",
    // D2 mit Prüfbedarf hat zwei Wortlaute, je nachdem, welche Antwort die Regel auslöst
    "D2 (Pruefbedarf) bei F14 Ja": "Für besondere Kategorien personenbezogener Daten gelten zusätzliche Anforderungen (Art. 9 DSGVO). Achten Sie darauf, dass die angegebene Freigabe diese Daten ausdrücklich umfasst.",
    "D2 (Pruefbedarf) bei F13 Unklar": "Bitte klären Sie, ob besondere Kategorien personenbezogener Daten betroffen sind.",
    "D3": "Nach Ihren Angaben werden personenbezogene Daten durch einen externen Anbieter verarbeitet. Die zuständige Stelle in Ihrem Unternehmen kann prüfen, welche datenschutzrechtliche Rolle der Anbieter übernimmt und ob die erforderlichen vertraglichen und datenschutzrechtlichen Voraussetzungen erfüllt sind, etwa eine Vereinbarung nach Art. 28 Abs. 3 DSGVO.",
    "D3 bei F15 Unklar": "Es ist unklar, ob personenbezogene Daten durch einen externen Anbieter verarbeitet werden. Bitte klären Sie dies mit der zuständigen Stelle in Ihrem Unternehmen. Falls eine externe Verarbeitung stattfindet, müssen die datenschutzrechtlichen Voraussetzungen geprüft werden.",
    "D4": "Nach Ihren Angaben können personenbezogene Daten an Empfänger außerhalb der EU und des EWR übermittelt oder von dort aus zugänglich gemacht werden. Die zuständige Stelle in Ihrem Unternehmen kann prüfen, ob dabei eine Drittlandübermittlung im Sinne der DSGVO vorliegt und ob die dafür erforderlichen Voraussetzungen erfüllt sind (Art. 44 ff. DSGVO).",
    "D4 bei F16 Unklar": "Es ist unklar, ob personenbezogene Daten an Empfänger außerhalb der EU und des EWR übermittelt oder von dort aus zugänglich gemacht werden. Bitte lassen Sie die Datenflüsse und Zugriffsmöglichkeiten durch die zuständige Stelle in Ihrem Unternehmen klären.",
    "D5": "Nach Ihren Angaben weist die Verarbeitung personenbezogener Daten mindestens ein Merkmal auf, das für die Prüfung einer Datenschutz-Folgenabschätzung relevant sein kann. Bitte lassen Sie durch die zuständige Stelle beurteilen, ob die Verarbeitung voraussichtlich ein hohes Risiko für die Rechte und Freiheiten betroffener Personen zur Folge hat und eine Datenschutz-Folgenabschätzung erforderlich ist.",
    "D5 bei F17 Unklar": "Sie konnten nicht sicher beurteilen, ob die genannten Risikomerkmale vorliegen. Bitte lassen Sie die Verarbeitung durch die zuständige Stelle prüfen, um zu klären, ob eine Datenschutz-Folgenabschätzung erforderlich ist.",
    "S1": "Bei dieser Nutzung werden möglicherweise interne oder vertrauliche Informationen außerhalb Ihres Unternehmens verarbeitet. Ob sie in diesen KI-Dienst eingegeben werden dürfen, richtet sich nach den Vorgaben Ihres Unternehmens.",
    "S1 bei F18 intern": "Nach Ihren Angaben werden interne Unternehmensinformationen an einen externen KI-Anbieter übermittelt. Bitte prüfen Sie, ob die Weitergabe dieser Informationen durch die Vorgaben Ihres Unternehmens abgedeckt ist. Bei Unsicherheiten unterstützt Sie die zuständige Stelle in Ihrem Unternehmen.",
    "S1 bei F18 Unklar": "Sie konnten die Vertraulichkeitsstufe der eingegebenen Informationen nicht sicher einordnen. Bitte klären Sie, welche Schutzanforderungen für diese Informationen gelten und ob sie in den KI-Dienst eingegeben werden dürfen. Die zuständige Stelle in Ihrem Unternehmen kann Sie dabei unterstützen.",
    "S1 bei F18 vertraulich": "Nach Ihren Angaben werden vertrauliche oder geschäftskritische Informationen an einen externen KI-Anbieter übermittelt. Bitte klären Sie mit der zuständigen Stelle in Ihrem Unternehmen, ob die Weitergabe dieser Informationen zulässig ist.",
    "S2": "Nach Ihren Angaben fließen die KI-Ergebnisse maßgeblich in Entscheidungen ein oder werden nicht immer geprüft. Fehlerhafte Ergebnisse können daher Folgen haben.",
    "S2 bei Unklar": "Möglicherweise fließen die KI-Ergebnisse maßgeblich in Entscheidungen ein oder werden nicht immer geprüft. Bitte klären Sie, wie die Ergebnisse verwendet und geprüft werden.",
    // S3: je Freigabestand (F4) und Nachvollziehbarkeit (F22). Bei Stufe 1 gibt es keinen Hinweis.
    "S3 bei F4 freigegeben und F22 teilweise": "Nach Ihren Angaben ist die KI-Nutzung freigegeben. Die verwendeten Eingaben und Ergebnisse sind jedoch nur teilweise nachvollziehbar. Bitte prüfen Sie, ob die Nachvollziehbarkeit für diese Aufgabe verbessert werden sollte.",
    "S3 bei F4 freigegeben und F22 nein": "Nach Ihren Angaben ist die KI-Nutzung freigegeben. Die verwendeten Eingaben und Ergebnisse lassen sich jedoch nicht nachträglich nachvollziehen. Bitte klären Sie, welche Dokumentations- oder Kontrollmöglichkeiten für diese Aufgabe sinnvoll sind.",
    "S3 bei F4 freigegeben und F22 Unklar": "Nach Ihren Angaben ist die KI-Nutzung freigegeben. Ob die verwendeten Eingaben und Ergebnisse später nachvollzogen werden können, ist jedoch unklar. Bitte klären Sie, ob hierfür geeignete Möglichkeiten bestehen.",
    "S3 bei F4 in Pruefung und F22 teilweise": "Die Prüfung oder Freigabe der KI-Nutzung läuft nach Ihren Angaben noch. Zudem sind die verwendeten Eingaben und Ergebnisse nur teilweise nachvollziehbar. Bitte klären Sie im Rahmen der Freigabe, welche Dokumentation erforderlich ist.",
    "S3 bei F4 in Pruefung und F22 nein": "Die Prüfung oder Freigabe der KI-Nutzung läuft nach Ihren Angaben noch. Die verwendeten Eingaben und Ergebnisse lassen sich nicht nachträglich nachvollziehen. Bitte besprechen Sie im Freigabeverfahren, welche Dokumentations- oder Kontrollmöglichkeiten benötigt werden.",
    "S3 bei F4 in Pruefung und F22 Unklar": "Die Prüfung oder Freigabe der KI-Nutzung läuft nach Ihren Angaben noch. Ob Eingaben und Ergebnisse später nachvollzogen werden können, ist unklar. Bitte klären Sie diesen Punkt im Rahmen des Freigabeverfahrens.",
    "S3 bei F4 bekannt, nicht freigegeben und F22 ja": "Nach Ihren Angaben liegt für die KI-Nutzung keine Freigabe vor. Die verwendeten Eingaben und Ergebnisse sind nachvollziehbar. Bitte klären Sie mit der zuständigen Stelle, ob und unter welchen Bedingungen die Nutzung erlaubt ist.",
    "S3 bei F4 bekannt, nicht freigegeben und F22 teilweise": "Nach Ihren Angaben liegt für die KI-Nutzung keine Freigabe vor. Die verwendeten Eingaben und Ergebnisse sind nur teilweise nachvollziehbar. Bitte klären Sie gemeinsam mit der zuständigen Stelle die zulässige Nutzung und die erforderliche Nachvollziehbarkeit.",
    "S3 bei F4 bekannt, nicht freigegeben und F22 nein": "Nach Ihren Angaben liegt für die KI-Nutzung keine Freigabe vor. Zudem können die verwendeten Eingaben und Ergebnisse nicht nachträglich nachvollzogen werden. Bitte wenden Sie sich an die zuständige Stelle, um die zulässige Nutzung und geeignete Dokumentationsmöglichkeiten zu klären.",
    "S3 bei F4 bekannt, nicht freigegeben und F22 Unklar": "Nach Ihren Angaben liegt für die KI-Nutzung keine Freigabe vor. Ob Eingaben und Ergebnisse später nachvollzogen werden können, ist unklar. Bitte klären Sie beide Punkte mit der zuständigen Stelle in Ihrem Unternehmen.",
    "S3 bei F4 abgelehnt und F22 ja": "Nach Ihren Angaben hat Ihr Unternehmen diese KI-Nutzung abgelehnt. Die verwendeten Eingaben und Ergebnisse sind nachvollziehbar. Bitte stimmen Sie das weitere Vorgehen mit der zuständigen Stelle ab.",
    "S3 bei F4 abgelehnt und F22 teilweise": "Nach Ihren Angaben hat Ihr Unternehmen diese KI-Nutzung abgelehnt. Die verwendeten Eingaben und Ergebnisse sind nur teilweise nachvollziehbar. Bitte stimmen Sie das weitere Vorgehen mit der zuständigen Stelle ab.",
    "S3 bei F4 abgelehnt und F22 nein": "Nach Ihren Angaben hat Ihr Unternehmen diese KI-Nutzung abgelehnt. Zudem können die verwendeten Eingaben und Ergebnisse nicht nachträglich nachvollzogen werden. Bitte stimmen Sie das weitere Vorgehen mit der zuständigen Stelle ab.",
    "S3 bei F4 abgelehnt und F22 Unklar": "Nach Ihren Angaben hat Ihr Unternehmen diese KI-Nutzung abgelehnt. Ob Eingaben und Ergebnisse später nachvollzogen werden können, ist unklar. Bitte stimmen Sie das weitere Vorgehen mit der zuständigen Stelle ab.",
    "S3 bei F4 nicht bekannt und F22 ja": "Nach Ihren Angaben ist die KI-Nutzung Ihrem Unternehmen bisher nicht bekannt. Die verwendeten Eingaben und Ergebnisse sind nachvollziehbar. Bitte wenden Sie sich an die zuständige Stelle, damit die Nutzung gemeinsam eingeordnet und geprüft werden kann.",
    "S3 bei F4 nicht bekannt und F22 teilweise": "Nach Ihren Angaben ist die KI-Nutzung Ihrem Unternehmen bisher nicht bekannt. Die verwendeten Eingaben und Ergebnisse sind nur teilweise nachvollziehbar. Bitte klären Sie gemeinsam mit der zuständigen Stelle die Nutzung und geeignete Dokumentationsmöglichkeiten.",
    "S3 bei F4 nicht bekannt und F22 nein": "Nach Ihren Angaben ist die KI-Nutzung Ihrem Unternehmen bisher nicht bekannt. Die verwendeten Eingaben und Ergebnisse sind nicht nachträglich nachvollziehbar. Bitte wenden Sie sich an die zuständige Stelle, um die Nutzung und geeignete Schutzmaßnahmen zu klären.",
    "S3 bei F4 nicht bekannt und F22 Unklar": "Nach Ihren Angaben ist die KI-Nutzung Ihrem Unternehmen bisher nicht bekannt. Ob Eingaben und Ergebnisse später nachvollzogen werden können, ist unklar. Bitte klären Sie beide Punkte gemeinsam mit der zuständigen Stelle.",
    "S3 bei F4 Unklar und F22 ja": "Sie konnten nicht sicher angeben, ob die KI-Nutzung in Ihrem Unternehmen freigegeben ist. Die verwendeten Eingaben und Ergebnisse sind nachvollziehbar. Bitte klären Sie den Freigabestatus mit der zuständigen Stelle.",
    "S3 bei F4 Unklar und F22 teilweise": "Ob die KI-Nutzung freigegeben ist, ist nach Ihren Angaben unklar. Die verwendeten Eingaben und Ergebnisse sind nur teilweise nachvollziehbar. Bitte klären Sie den Freigabestatus und prüfen Sie, ob die Nachvollziehbarkeit verbessert werden sollte.",
    "S3 bei F4 Unklar und F22 nein": "Ob die KI-Nutzung freigegeben ist, ist nach Ihren Angaben unklar. Zudem können die verwendeten Eingaben und Ergebnisse nicht nachträglich nachvollzogen werden. Bitte klären Sie beide Punkte gemeinsam mit der zuständigen Stelle.",
    "S3 bei F4 Unklar und F22 Unklar": "Ob die KI-Nutzung freigegeben ist und ob Eingaben und Ergebnisse später nachvollzogen werden können, ist nach Ihren Angaben unklar. Bitte wenden Sie sich an die zuständige Stelle, um diese Fragen gemeinsam zu klären.",
    // S4: je Verarbeitung (F23) und Einbindung (F24). Bei Stufe 1 gibt es keinen Hinweis.
    "S4 bei F23 extern ohne und F24 automatisiert": "Nach Ihren Angaben werden Daten an einen externen Anbieter übermittelt, der sie nach eigenen Angaben nicht zum Training seiner KI-Modelle verwendet. Da der KI-Dienst automatisiert mit Unternehmenssystemen verbunden ist, kann die zuständige Stelle in Ihrem Unternehmen klären, welche Daten übertragen werden und welche Zugriffsmöglichkeiten bestehen. Sie können dafür das Ergebnis dieses Assessments weitergeben.",
    "S4 bei F23 extern mit und F24 manuell": "Nach Ihren Angaben dürfen die eingegebenen Daten vom externen Anbieter auch zum Training seiner KI-Modelle verwendet werden. Bitte prüfen Sie, ob die Eingabe der vorgesehenen Informationen unter diesen Bedingungen mit den Vorgaben Ihres Unternehmens vereinbar ist.",
    "S4 bei F23 extern mit und F24 Erweiterung": "Nach Ihren Angaben darf der externe Anbieter die Daten zum Training seiner KI-Modelle verwenden. Gleichzeitig ist der KI-Dienst über eine Erweiterung mit Zugriff auf Konten oder Dateien eingebunden. Bitte prüfen Sie gemeinsam mit der zuständigen Stelle, welche Daten zugänglich sind und ob die vorhandenen Schutzmaßnahmen ausreichen.",
    "S4 bei F23 extern mit und F24 automatisiert": "Nach Ihren Angaben darf der externe Anbieter die Daten zum Training seiner KI-Modelle verwenden. Gleichzeitig ist der KI-Dienst automatisiert an Unternehmenssysteme angebunden. Bitte prüfen Sie gemeinsam mit der zuständigen Stelle, welche Daten zugänglich sind und ob die vorhandenen Schutzmaßnahmen ausreichen.",
    "S4 bei F23 extern mit und F24 Unklar": "Nach Ihren Angaben darf der externe Anbieter die eingegebenen Daten zum Training seiner KI-Modelle verwenden. Wie der KI-Dienst technisch in Ihre Arbeitsabläufe eingebunden ist, ist jedoch unklar. Bitte klären Sie gemeinsam mit der zuständigen Stelle, auf welche Unternehmensdaten und Systeme der KI-Dienst zugreifen kann.",
    "S4 bei F23 Unklar und F24 manuell": "Es ist unklar, ob Daten an einen externen Anbieter übermittelt oder zum KI-Training verwendet werden. Bitte klären Sie, wie der KI-Dienst die Daten verarbeitet und ob die bestehenden Nutzungsbedingungen für Ihre Aufgabe geeignet sind.",
    "S4 bei F23 Unklar und F24 Erweiterung": "Es ist unklar, ob Daten an einen externen Anbieter übermittelt oder zum KI-Training verwendet werden. Bitte klären Sie, wie der KI-Dienst die Daten verarbeitet und ob die bestehenden Nutzungsbedingungen für Ihre Aufgabe geeignet sind. Da der KI-Dienst nach Ihren Angaben über eine Erweiterung mit Zugriff auf Konten oder Dateien eingebunden ist, kann die zuständige Stelle auch klären, auf welche Daten er zugreifen kann.",
    "S4 bei F23 Unklar und F24 automatisiert": "Es ist unklar, ob Daten an einen externen Anbieter übermittelt oder zum KI-Training verwendet werden. Bitte klären Sie, wie der KI-Dienst die Daten verarbeitet und ob die bestehenden Nutzungsbedingungen für Ihre Aufgabe geeignet sind. Da der KI-Dienst nach Ihren Angaben automatisiert an Unternehmenssysteme angebunden ist, kann die zuständige Stelle auch klären, auf welche Daten und Systeme er zugreifen kann.",
    "S4 bei F23 Unklar und F24 Unklar": "Es ist unklar, wie der KI-Dienst Daten verarbeitet und wie er technisch in die Arbeitsabläufe eingebunden ist. Bitte klären Sie gemeinsam mit der zuständigen Stelle, welche Daten übertragen werden können und ob Zugriff auf Unternehmenssysteme besteht.",
    "K1": "Nach Ihren Angaben dürfen die eingegebenen vertraulichen oder geschäftskritischen Informationen vom externen Anbieter zum Training seiner KI-Modelle verwendet werden. Bitte wenden Sie sich an die zuständige Stelle in Ihrem Unternehmen, um gemeinsam zu klären, ob diese Nutzung unter den gegebenen Bedingungen zulässig ist.",
    "K1 bei F23 Unklar": "Nach Ihren Angaben werden vertrauliche oder geschäftskritische Informationen eingegeben. Ob diese an einen externen Anbieter übermittelt und dort möglicherweise zum Training von KI-Modellen verwendet werden, ist unklar. Bitte wenden Sie sich an die zuständige Stelle in Ihrem Unternehmen, um gemeinsam zu klären, ob die Nutzung unter den gegebenen Bedingungen zulässig ist.",
    "K2": "Ihre Angaben weisen darauf hin, dass Fehler in den KI-Ergebnissen spürbare oder erhebliche Folgen haben können. Gleichzeitig bestehen Einschränkungen bei der Prüfung der Ergebnisse, der Freigabe der KI-Nutzung oder ihrer Nachvollziehbarkeit. Bitte wenden Sie sich an die zuständige Stelle in Ihrem Unternehmen, um gemeinsam geeignete Schutzmaßnahmen und das weitere Vorgehen zu klären."
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
  // Etikett einer Empfehlung ohne Schutzmaßnahme, je Anlass: die Angabe aus F3 oder F4
  var ANLASS_MARKE = { privat: "Privater Zugang", ohneAnmeldung: "Ohne Anmeldung oder Benutzerkonto", abgelehnt: "Nutzung abgelehnt" };
  // Empfehlungen ohne „Warum diese Empfehlung?“: Ihr Text nennt den Anlass bereits.
  var OHNE_BEGRUENDUNG = ["E7", "E9"];
  var ZUSTAENDE = { vorhanden: "vorhanden", fehlt: "nicht vorhanden", unklar: "unklar" };
  var MASSNAHMEN = {
    E1: "KI-Richtlinie", E2: "Schulung", E3: "Technische Schutzmaßnahmen", E4: "Vorgeschriebene fachliche Prüfung",
    E5a: "Zuständige Stelle", E5b: "Freigabeverfahren", E6: "Freigegebene Alternative",
    E7: "Zugang zum KI-Dienst",           // kein Stand, das Etikett nennt die Angabe aus F3 (ANLASS_MARKE)
    E8: "Transparenz und Nachvollziehbarkeit",  // kein Stand, das Etikett nennt den Risikofaktor
    E9: "Freigabestand"                          // kein Stand, das Etikett nennt die Angabe aus F4 (ANLASS_MARKE)
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
    "Anhang III": { adresse: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:02024R1689-20260727#anx_III", hinweis: "Anhang III der KI-Verordnung, konsolidierte Fassung, öffnet EUR-Lex in einem neuen Fenster" },
    "Art. 9 DSGVO": { adresse: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32016R0679#art_9", hinweis: "Artikel 9 der DSGVO, öffnet EUR-Lex in einem neuen Fenster" },
    "Art. 28 Abs. 3 DSGVO": { adresse: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32016R0679#art_28", hinweis: "Artikel 28 der DSGVO, öffnet EUR-Lex in einem neuen Fenster" },
    "Art. 44 ff. DSGVO": { adresse: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32016R0679#art_44", hinweis: "Artikel 44 der DSGVO, öffnet EUR-Lex in einem neuen Fenster" }
  };
  // Wortlaut je Stand der Schutzmaßnahme: vorhanden, fehlt und optional unklar. Ohne eigene
  // Fassung für „unklar“ gilt die Fassung für „fehlt“ (app.js, empfehlungsText).
  var EMPFEHLUNGEN = {
    "E1": { vorhanden: "Prüfen Sie, ob die KI-Richtlinie Ihres Unternehmens diesen KI-Dienst und diese Aufgabe abdeckt, und halten Sie sich an ihre Vorgaben.", fehlt: "Fragen Sie Ihre Führungskraft oder die zuständige Stelle, welche Regeln für diesen KI-Dienst gelten." },
    "E2": {
      fehlt: "Bitte erkundigen Sie sich bei Ihrer Führungskraft oder der zuständigen Stelle nach geeigneten Schulungs- oder Informationsangeboten zum Umgang mit KI. Diese können Ihnen helfen, KI-Ergebnisse richtig einzuschätzen, Risiken zu erkennen und die geltenden Unternehmensvorgaben zu beachten. Nach Art. 4 KI-VO unterstützen Unternehmen den Aufbau der KI-Kompetenz ihres Personals.",
      unklar: "Es ist unklar, ob Sie bereits eine geeignete Schulung oder Unterweisung für diese KI-Nutzung erhalten haben. Bitte erkundigen Sie sich bei Ihrer Führungskraft oder der zuständigen Stelle, welche Informationen oder Schulungsangebote für Ihre Aufgabe vorgesehen sind."
    },
    "E3": {
      vorhanden: "Fragen Sie bei Ihrer IT nach, ob die vorhandenen technischen Schutzmaßnahmen auch diesen KI-Dienst erfassen.",
      fehlt: "Nach Ihren Angaben bestehen in Ihrem Unternehmen keine technischen Schutzmaßnahmen für die Nutzung von KI-Diensten. Bitte wenden Sie sich an Ihre IT oder die zuständige Stelle, um gemeinsam zu klären, welche Maßnahmen für den sicheren Umgang mit Unternehmensdaten erforderlich sind.",
      unklar: "Es ist unklar, welche technischen Schutzmaßnahmen für die Nutzung von KI-Diensten bereits bestehen. Bitte erkundigen Sie sich bei Ihrer IT oder der zuständigen Stelle, ob die erforderlichen Maßnahmen vorhanden sind und die geplante Nutzung ausreichend abgesichert ist."
    },
    "E4": {
      vorhanden: "Für diese KI-Nutzung ist nach Ihren Angaben eine fachliche Prüfung der Ergebnisse vorgeschrieben. Bitte stellen Sie sicher, dass die Ergebnisse vor ihrer Verwendung entsprechend den Vorgaben Ihres Unternehmens überprüft werden.",
      fehlt: "Nach Ihren Angaben gibt es für diese KI-Nutzung keine verbindliche Vorgabe zur fachlichen Prüfung der Ergebnisse. Bitte klären Sie mit Ihrer Führungskraft oder der zuständigen Stelle, ob und welche Kontrollen angesichts der möglichen Fehlerfolgen erforderlich sind.",
      unklar: "Es ist unklar, ob Ihr Unternehmen eine fachliche Prüfung der KI-Ergebnisse vorschreibt. Bitte erkundigen Sie sich bei Ihrer Führungskraft oder der zuständigen Stelle, welche Kontrollvorgaben für diese Aufgabe gelten."
    },
    "E4 Zusatz Art. 26 Abs. 2": { fehlt: "Bei Hochrisiko-KI-Systemen müssen Personen, die die menschliche Aufsicht übernehmen, über die dafür erforderlichen Kompetenzen, Schulungen und Befugnisse verfügen (Art. 26 Abs. 2 KI-VO). Für die hier erfassten Systeme nach Anhang III gelten diese Anforderungen ab dem 2. Dezember 2027." },
    "E5a": {
      vorhanden: "Bitte wenden Sie sich an die zuständige Stelle in Ihrem Unternehmen, um offene Fragen zur KI-Nutzung gemeinsam zu klären. Sie können dafür auch das Ergebnis dieses Assessments verwenden.",
      fehlt: "Nach Ihren Angaben ist in Ihrem Unternehmen keine zuständige Ansprechperson für KI-Nutzungen benannt. Bitte wenden Sie sich an Ihre Führungskraft oder Ihre IT, um zu klären, wer Sie bei der weiteren Prüfung unterstützen kann.",
      unklar: "Es ist unklar, wer in Ihrem Unternehmen für Fragen zur KI-Nutzung zuständig ist. Bitte erkundigen Sie sich bei Ihrer Führungskraft oder Ihrer IT nach einer geeigneten Ansprechperson, um das weitere Vorgehen gemeinsam abzustimmen."
    },
    "E5b": {
      vorhanden: "In Ihrem Unternehmen gibt es nach Ihren Angaben ein Verfahren zur Freigabe von KI-Nutzungen. Bitte nutzen Sie dieses Verfahren, um die geplante oder bereits stattfindende Nutzung prüfen und gegebenenfalls freigeben zu lassen.",
      fehlt: "Nach Ihren Angaben ist Ihnen kein festgelegtes Verfahren zur Freigabe von KI-Nutzungen bekannt. Bitte wenden Sie sich an Ihre Führungskraft oder die zuständige Stelle, um gemeinsam zu klären, unter welchen Voraussetzungen die Nutzung erlaubt werden kann.",
      unklar: "Es ist unklar, ob Ihr Unternehmen ein festgelegtes Freigabeverfahren für KI-Nutzungen hat. Bitte erkundigen Sie sich bei Ihrer Führungskraft oder der zuständigen Stelle, wie Sie die Nutzung prüfen und gegebenenfalls freigeben lassen können."
    },
    "E6": {
      vorhanden: "Nach Ihren Angaben steht in Ihrem Unternehmen eine freigegebene KI-Alternative zur Verfügung. Bitte prüfen Sie, ob Sie Ihre Aufgabe mit dieser Alternative erledigen können und ob die konkrete Nutzung von deren Freigabe abgedeckt ist.",
      fehlt: "Nach Ihren Angaben steht für diese Aufgabe keine freigegebene KI-Alternative zur Verfügung. Bitte wenden Sie sich an die zuständige Stelle und erläutern Sie, wofür Sie einen KI-Dienst benötigen. So kann gemeinsam geprüft werden, welche geeigneten Lösungen infrage kommen.",
      unklar: "Sie wissen nicht sicher, ob für Ihre Aufgabe bereits eine freigegebene KI-Alternative zur Verfügung steht. Bitte erkundigen Sie sich bei der zuständigen Stelle, welche KI-Dienste Ihr Unternehmen für diese Aufgabe erlaubt."
    },
    // E7: je Anlass aus F3 (privat, ohneAnmeldung) eine eigene Fassung
    "E7": {
      privat: "Nach Ihren Angaben nutzen Sie den KI-Dienst über einen privaten Zugang. Bitte erkundigen Sie sich bei der zuständigen Stelle, ob Ihr Unternehmen für diese Aufgabe einen freigegebenen KI-Zugang bereitstellt und welche Nutzungsmöglichkeiten und Schutzmaßnahmen dafür vorgesehen sind.",
      ohneAnmeldung: "Nach Ihren Angaben verwenden Sie den KI-Dienst ohne Anmeldung oder Benutzerkonto. Bitte erkundigen Sie sich, ob Ihr Unternehmen für diese Aufgabe einen freigegebenen Zugang vorsieht und welche Sicherheitsvorgaben dabei zu beachten sind."
    },
    // E8: je Antwort auf F22. Bei „Ja“ greift E8 nie (S3 hat dann Stufe 1 oder E8 entfällt).
    "E8": {
      teilweise: "Nach Ihren Angaben lassen sich die verwendeten KI-Eingaben und Ergebnisse nur teilweise nachvollziehen. Bitte klären Sie mit der zuständigen Stelle, wie die Nutzung bei Bedarf nachvollziehbar dokumentiert werden kann. Verwenden Sie dafür ausschließlich die von Ihrem Unternehmen vorgesehenen Verfahren.",
      nein: "Nach Ihren Angaben lassen sich die verwendeten KI-Eingaben und Ergebnisse nicht nachträglich nachvollziehen. Bitte klären Sie mit der zuständigen Stelle, welche geeigneten Dokumentationsmöglichkeiten für diese Aufgabe vorgesehen werden können.",
      Unklar: "Es ist unklar, ob die verwendeten KI-Eingaben und Ergebnisse später nachvollzogen werden können. Bitte erkundigen Sie sich bei der zuständigen Stelle, welche Möglichkeiten zur Nachvollziehbarkeit bestehen und welche Vorgaben dabei zu beachten sind."
    },
    "E9": { text: "Nach Ihren Angaben hat Ihr Unternehmen diese KI-Nutzung abgelehnt. Bitte verwenden Sie den KI-Dienst für diese Aufgabe nicht weiter." }
  };

  // Kurztitel der Handlungsempfehlungen, je nach Stand der Schutzmaßnahme (Tabelle 18)
  var EMPFEHLUNG_TITEL = {
    "E1": { vorhanden: "Bestehende KI-Richtlinie anwenden", fehlt: "Nutzungsregeln klären" },
    "E2": { fehlt: "Schulung zum Umgang mit KI", unklar: "KI-Kompetenz klären" },
    "E3": { vorhanden: "Technische Schutzmaßnahmen prüfen", fehlt: "Technische Schutzmaßnahmen prüfen lassen", unklar: "Vorhandene Schutzmaßnahmen klären" },
    "E4": { vorhanden: "Vorgeschriebene fachliche Prüfung anwenden", fehlt: "Fachliche Prüfung der KI-Ergebnisse klären", unklar: "Vorgaben zur fachlichen Prüfung klären" },
    "E5a": { vorhanden: "Zuständige Stelle einbeziehen", fehlt: "Ansprechperson für KI-Nutzung finden", unklar: "Zuständige Ansprechperson klären" },
    "E5b": { vorhanden: "Bestehendes Freigabeverfahren nutzen", fehlt: "Freigabemöglichkeit klären", unklar: "Freigabeverfahren erfragen" },
    "E6": { vorhanden: "Freigegebene KI-Alternative prüfen", fehlt: "Bedarf an einer KI-Lösung mitteilen", unklar: "Freigegebene KI-Alternative erfragen" },
    "E7": { privat: "Unternehmenszugang prüfen", ohneAnmeldung: "Geeigneten KI-Zugang klären" },
    "E8": { teilweise: "Nachvollziehbarkeit verbessern", nein: "Nachvollziehbarkeit ermöglichen", Unklar: "Nachvollziehbarkeit klären" },
    "E9": { text: "Nutzung einstellen" }
  };
  // Begründung „Warum diese Empfehlung?“: nennt den Anlass nach Tabelle 18 in Alltagssprache.
  // {…} sind Platzhalter. Die genauen Regeln stehen in den aufklappbaren Sachverhalten.
  var EMPFEHLUNG_GRUND = {
    // Gesamtergebnis, zuständige Stelle und Risikofaktoren: Es folgen nur die ausschlaggebenden
    // Angaben, eingeleitet mit „sachverhalte“.
    gesamt: "",
    stelle: "",
    sachverhalte: "Ausschlaggebend dafür sind Ihre Angaben:",
    sachverhalteRisiko: "",
    shadow: "Nach Ihren Angaben wird der KI-Dienst ohne Freigabe Ihres Unternehmens genutzt.",
    unklar: "Nach Ihren Angaben lässt sich nicht ausschließen, dass der KI-Dienst ohne Freigabe Ihres Unternehmens genutzt wird.",
    schulungNein: "Nach Ihren Angaben wurde die nutzende Person nicht im Umgang mit KI geschult.",
    schulungUnklar: "Ob die nutzende Person im Umgang mit KI geschult wurde, ist nach Ihren Angaben unklar.",
    nichtFrei: "Nach Ihren Angaben ist die Nutzung nicht freigegeben.",
    abgelehnt: "Nach Ihren Angaben hat Ihr Unternehmen die Nutzung abgelehnt.",
    freigabeUnklar: "Ob die Nutzung freigegeben ist, ist nach Ihren Angaben unklar.",
    privat: "Nach Ihren Angaben wird der KI-Dienst über einen privaten Zugang genutzt.",
    ohneAnmeldung: "Nach Ihren Angaben wird der KI-Dienst ohne Anmeldung oder Benutzerkonto genutzt.",
    // E1: Die Begründung setzt sich aus BEGRUENDUNG_E1 zusammen (begruendungE1).
    richtlinie: ""
  };
  /**
   * Begründung von E1 (KI-Richtlinie) aus bis zu drei Sätzen: Freigabe (nicht bestätigt oder
   * abgelehnt), mögliche Weitergabe an einen Anbieter (S1, S4) und ein Satz zur Richtlinie je
   * Antwort auf F25. Liegen beide Anlässe vor, steht der Satz zur Richtlinie nur einmal.
   */
  var BEGRUENDUNG_E1 = {
    offen: "Die Freigabe dieser KI-Nutzung ist nach Ihren Angaben noch nicht bestätigt.",
    abgelehnt: "Nach Ihren Angaben hat Ihr Unternehmen diese KI-Nutzung abgelehnt.",
    abfluss: "Ihre Angaben weisen darauf hin, dass bei dieser KI-Nutzung interne Informationen oder Daten an einen externen Anbieter weitergegeben werden können.",
    richtlinieUnklar: "Ob es in Ihrem Unternehmen eine KI-Richtlinie gibt, ist nach Ihren Angaben unklar.",
    // Satz zur Richtlinie: bei F25 „Ja“ „Die KI-Richtlinie …“, bei „Unklar“ „Eine solche Richtlinie …“
    inhalt: {
      offen: "kann festlegen, welche Voraussetzungen für die Nutzung gelten.",
      abgelehnt: "kann festlegen, welche KI-Dienste stattdessen genutzt werden dürfen.",
      abfluss: "kann hierzu Vorgaben enthalten.",
      beide: "kann zu beiden Punkten Vorgaben enthalten."
    },
    vorhanden: "Die KI-Richtlinie Ihres Unternehmens",
    unklar: "Eine solche Richtlinie",
    // F25 „Nein“: gibt die Angabe wieder, ohne zu behaupten, dass es keine Regeln gibt. Die
    // Handlung steht bereits im Empfehlungstext.
    fehlt: "Nach Ihren Angaben ist Ihnen keine KI-Richtlinie oder Nutzungsregel bekannt, die diese Nutzung abdeckt."
  };
  // Text unter dem Gesamtergebnis bei ausdrücklich abgelehnter Nutzung (F4) und Stufe 2 oder 3.
  // Die Texte dieser Stufen setzen eine mögliche weitere Nutzung voraus. Stufe 4 bleibt unverändert.
  var GESAMT_ABGELEHNT = "Nach Ihren Angaben hat Ihr Unternehmen diese KI-Nutzung ausdrücklich abgelehnt. Bitte verwenden Sie den KI-Dienst für diese Aufgabe nicht weiter. Wenn Sie KI-Unterstützung benötigen, können Sie sich bei der zuständigen Stelle nach einer freigegebenen Alternative erkundigen.";
  /** Text unter dem Gesamtergebnis je Stufe und Antwort auf F4. */
  function gesamtBeschreibung(stufe, f4) {
    return f4 === "abgelehnt" && (stufe === 2 || stufe === 3) ? GESAMT_ABGELEHNT : STUFEN[stufe].gesamt;
  }
  /** Begründung von E1 zum Anlass { richtlinie, freigabe, abfluss } aus regeln.js. */
  function begruendungE1(anlass) {
    var B = BEGRUENDUNG_E1;
    var saetze = [];
    if (anlass.freigabe) saetze.push(B[anlass.freigabe]);
    if (anlass.abfluss) saetze.push(B.abfluss);
    var art = anlass.freigabe && anlass.abfluss ? "beide" : anlass.freigabe || "abfluss";
    if (anlass.richtlinie === "fehlt") {
      saetze.push(B.fehlt);
    } else {
      if (anlass.richtlinie === "unklar") saetze.push(B.richtlinieUnklar);
      saetze.push(B[anlass.richtlinie] + " " + B.inhalt[art]);
    }
    return saetze.join(" ");
  }
  // Auslösende Sachverhalte unter „Warum diese Empfehlung?“, bezogen auf die Antworten der Person.
  // Regeln der Pfade R und D: „ja“ bei einer konkreten Angabe, „unklar“, wenn alle auslösenden
  // Fragen mit „Unklar“ beantwortet sind. R4 folgt aus denselben Angaben wie R3.
  var SACHVERHALT_KURZ = {
    R1: { ja: "Eine der Aussagen zur Anbieterrolle trifft auf Ihr Unternehmen zu.", unklar: "Ob Ihr Unternehmen als Anbieter des KI-Systems gelten könnte, ist unklar." },
    R2: { ja: "Der KI-Dienst wird für einen Zweck eingesetzt, der eine verbotene KI-Praktik betreffen könnte.", unklar: "Ob die Nutzung eine verbotene KI-Praktik betrifft, ist unklar." },
    R3: { ja: "Der KI-Dienst wird in einem Bereich eingesetzt, in dem er als Hochrisiko-KI-System eingestuft werden könnte.", unklar: "Ob der KI-Dienst in einem Hochrisiko-Bereich eingesetzt wird, ist unklar." },
    R4: { ja: "Der KI-Dienst wird in einem Bereich eingesetzt, in dem er als Hochrisiko-KI-System eingestuft werden könnte.", unklar: "Ob der KI-Dienst in einem Hochrisiko-Bereich eingesetzt wird, ist unklar." },
    R5: { ja: "Es werden Inhalte erzeugt oder Verfahren genutzt, für die Kennzeichnungs- oder Informationspflichten gelten können.", unklar: "Ob Kennzeichnungs- oder Informationspflichten bestehen, ist unklar." },
    D1: { ja: "Es werden personenbezogene Daten verarbeitet.", unklar: "Ob personenbezogene Daten verarbeitet werden, ist unklar." },
    D2: { ja: "Es sind besonders geschützte personenbezogene Daten betroffen.", unklar: "Ob besonders geschützte personenbezogene Daten betroffen sind, ist unklar." },
    D3: { ja: "Personenbezogene Daten werden an einen externen Anbieter übermittelt oder von ihm verarbeitet.", unklar: "Ob personenbezogene Daten an einen externen Anbieter übermittelt oder von ihm verarbeitet werden, ist unklar." },
    D4: { ja: "Personenbezogene Daten können an Empfänger außerhalb der EU und des EWR übermittelt werden oder von dort aus zugänglich sein.", unklar: "Ob personenbezogene Daten an Empfänger außerhalb der EU und des EWR übermittelt werden oder von dort aus zugänglich sein können, ist unklar." },
    D5: { ja: "Es trifft ein Anlass für eine Datenschutz-Folgenabschätzung zu.", unklar: "Ob ein Anlass für eine Datenschutz-Folgenabschätzung besteht, ist unklar." }
  };
  // Risikofelder S1 bis S4 und Kombinationsregeln K1, K2: je auslösender Frage ein Satz zur
  // gegebenen Antwort. Günstige Antworten haben keinen Satz, sie tragen nicht zum Risiko bei.
  var ANGABE_KURZ = {
    F4: { "bekannt, nicht freigegeben": "Die Nutzung ist dem Unternehmen bekannt, aber nicht freigegeben.", abgelehnt: "Ihr Unternehmen hat die Nutzung abgelehnt.", "nicht bekannt": "Die Nutzung ist dem Unternehmen nicht bekannt.", Unklar: "Ob die Nutzung freigegeben ist, ist unklar." },
    F18: { intern: "Es werden interne Informationen eingegeben.", vertraulich: "Es werden vertrauliche oder geschäftskritische Informationen in den KI-Dienst eingegeben.", Unklar: "Welche Art von Informationen eingegeben wird, ist unklar." },
    F19: { massgeblich: "Die Ergebnisse sind eine maßgebliche Grundlage für Entscheidungen.", automatisch: "Die Ergebnisse werden ohne menschliche Entscheidung übernommen.", Unklar: "Wie die Ergebnisse verwendet werden, ist unklar." },
    F20: { spuerbar: "Ein fehlerhaftes Ergebnis hätte spürbare Folgen für Ihr Unternehmen.", erheblich: "Ein fehlerhaftes Ergebnis hätte erhebliche Folgen.", Unklar: "Welche Folgen ein fehlerhaftes Ergebnis hätte, ist unklar." },
    F21: { teilweise: "Die Ergebnisse werden nur teilweise fachlich geprüft.", nie: "Die Ergebnisse werden nicht fachlich geprüft.", Unklar: "Ob die Ergebnisse fachlich geprüft werden, ist unklar." },
    F22: { teilweise: "Die Nutzung lässt sich nur teilweise nachvollziehen.", nein: "Die Nutzung lässt sich nicht nachvollziehen.", Unklar: "Ob sich die Nutzung nachvollziehen lässt, ist unklar." },
    F23: { "extern ohne": "Die Daten gehen an einen externen Anbieter, der sie nach seinen Angaben nicht zum Training nutzt.", "extern mit": "Nach den angegebenen Nutzungsbedingungen darf der externe Anbieter die Daten auch zum Training seiner KI-Modelle verwenden.", Unklar: "Es ist nicht bekannt, ob die Daten an einen externen Anbieter übermittelt oder zum KI-Training verwendet werden." },
    F24: { Erweiterung: "Der KI-Dienst ist über eine Erweiterung mit Zugriff auf Konten oder Dateien eingebunden.", automatisiert: "Der KI-Dienst ist automatisiert an Systeme angebunden.", Unklar: "Wie der KI-Dienst eingebunden ist, ist unklar." }
  };
  /**
   * Sätze zu einem auslösenden Sachverhalt für „Warum diese Empfehlung?“.
   * kennung   Kennung der Regel oder des Risikofelds, etwa D3 oder S1
   * fragen    auslösende Fragen des Treffers (aus regeln.js)
   * antworten Antworten der Person
   */
  function sachverhaltSaetze(kennung, fragen, antworten) {
    var kurz = SACHVERHALT_KURZ[kennung];
    if (kurz) {
      var unklar = fragen.length > 0 && fragen.every(function (f) { return antworten[f] === "Unklar"; });
      return [unklar ? kurz.unklar : kurz.ja];
    }
    return fragen.map(function (f) { return (ANGABE_KURZ[f] || {})[antworten[f]]; }).filter(Boolean);
  }




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
      F13: "Die Frage F14 entfällt, weil unklar ist, ob personenbezogene Daten verarbeitet werden."
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
    etikettAnlass: { E7: "Ihre Angabe: {massnahme}", E9: "Ihre Angabe: {massnahme}", E8: "Risikofaktor: {massnahme}" },
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
    EMPFEHLUNGEN: EMPFEHLUNGEN, NORMVERWEISE: NORMVERWEISE, EMPFEHLUNG_TITEL: EMPFEHLUNG_TITEL, EMPFEHLUNG_GRUND: EMPFEHLUNG_GRUND, SACHVERHALT_KURZ: SACHVERHALT_KURZ, ANGABE_KURZ: ANGABE_KURZ, sachverhaltSaetze: sachverhaltSaetze, begruendungE1: begruendungE1, gesamtBeschreibung: gesamtBeschreibung, MASSNAHMEN: MASSNAHMEN, ANLASS_MARKE: ANLASS_MARKE, OHNE_BEGRUENDUNG: OHNE_BEGRUENDUNG, ZUSTAENDE: ZUSTAENDE, OBERFLAECHE: OBERFLAECHE
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else wurzel.Inhalte = api;
})(typeof window !== "undefined" ? window : this);
