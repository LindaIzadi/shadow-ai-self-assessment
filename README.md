# Shadow-AI-Self-Assessment (Prototyp)

Webbasierter Prototyp zur Masterarbeit „Entwicklung eines Self-Assessment-Tools zur
Bewertung von Shadow AI-Risiken unter Berücksichtigung des EU AI Acts“.

## 1 Zweck und Funktionsweise 
Das Self-Assessment erfasst einen einzelnen Nutzungsfall eines KI-Dienstes anhand von bis zu 30 Fragen. 
Eine regelbasierte, nicht kompensatorische Bewertungslogik führt regulatorische Sachverhalte nach dem EU AI Act, datenschutzrechtliche Sachverhalte und Shadow-AI-Risikofaktoren zu einer von vier Reaktionsstufen zusammen. 

Bei ausschließlich privater Nutzung endet das Assessment nach der Vorprüfung ohne Reaktionsstufe. 
Das Ergebnis dient der ersten Orientierung und trifft keine Aussage über die Rechtskonformität der Nutzung.


- **Art der Software:** statische Webanwendung (HTML, CSS, JavaScript) ohne Server und ohne
  Laufzeitbibliotheken, dazu Prüfskripte in JavaScript (Node.js)
- **Sprache:** Oberfläche, Bezeichner und Kommentare auf Deutsch
- **Wissenschaftliche Methode:** Design Science Research. Das Artefakt umfasst das Bewertungsmodell und dessen Umsetzung als webbasierten Prototyp. 
  Fragenkatalog und Regelbasis werden in Kapitel 5 hergeleitet.
- **Forschungsdaten:** Das Repository enthält keine empirisch erhobenen Forschungsdaten. Die Testfälle in `test/`
  sind konstruierte Nutzungsfälle und in Anhang C sowie im Begleitdokument zur Testdokumentation dokumentiert.

## 2 Urheberschaft (Wer?)

- **Autorin:** Linda Izadi, Masterstudiengang Wirtschaftsinformatik, HTW Berlin
- **Erstgutachterin:** Prof. Dr. Olga Willner
- **Zweitgutachter:** Mattheo Brajko
- **Hilfsmittel:** Der Programmcode wurde mit Unterstützung eines KI-Werkzeugs (Claude,
  Anthropic) erstellt. Art und Umfang sind im KI-Verzeichnis der Arbeit angegeben.

## 3 Zeitraum (Wann?)
- **Entwicklung des Prototyps:** September bis Oktober 2026
- **Stand der Regelbasis:** Oktober 2026 (Verordnung (EU) 2024/1689 in der Fassung der
  Verordnung (EU) 2026/1744)

## 4 Anwendung starten

Doppelklick auf `SA-Tool.html`. Die Seite öffnet sich im Browser und funktioniert ohne
Internetverbindung. Es ist keine Installation nötig.

Online ist der Prototyp über GitHub Pages abrufbar:
https://lindaizadi.github.io/shadow-ai-self-assessment/


## 5 Ablage und Ordnerstruktur

Die Anwendung ist in drei Schichten getrennt. `regeln.js` enthält ausschließlich die
Bewertungslogik. `inhalte.js` enthält die Fragen, Antwortmöglichkeiten, Hilfetexte und Ausgabetexte.
`app.js` verarbeitet die Eingaben, steuert die Navigation und stellt die Ergebnisse dar. Die fachliche Bewertung erfolgt über die Regelbasis.

| Datei oder Ordner | Aufgabe |
|---|---|
| `SA-Tool.html` | Grundgerüst der Webseite |
| `js/regeln.js` | Zulässige Antworten, Sichtbarkeitsbedingungen, Bewertungsregeln und Empfehlungsanlässe |
| `js/inhalte.js` | Fragen, Antwortoptionen, Hilfetexte und Ausgabetexte |
| `js/app.js` | Eingaben, Navigation, Ergebnisdarstellung und Druck |
| `css/stil.css` | Gestaltung für Bildschirm und Druck |
| `css/schriften/` | Lokale Schriftdateien und Lizenztexte |
| `test/testfaelle.json` | Dreizehn Testfälle mit unabhängig festgelegten Erwartungswerten |
| `test/einzelpruefungen.json` | 18 ergänzende Einzelprüfungen |
| `test/regeln.test.js` | Regeltests, Abgleich der Antwortcodes und ungültige Eingaben |
| `test/konsistenz.test.js` | Systematische Prüfung der Bewertungslogik |
| `test/browser.test.js` | Prüfung der Anwendung über die Browseroberfläche in Chromium, Firefox und WebKit |
| `package.json`, `package-lock.json` | Prüfabhängigkeiten und Testbefehle |
| `.nvmrc`, `eslint.config.js` | Node.js-Hauptversion und Linter-Konfiguration |
| `.github/workflows/pipeline.yml` | Automatische Prüfung und Veröffentlichung |
| `.gitignore`, `.gitattributes`, `.editorconfig` | Einstellungen für Git und Dateiformatierung |
| `LICENSE` | Nutzungsbedingungen des eigenen Codes |
| Testdokumentation | Enthält die Testdokumentation der Testfälle |


## 6 Werkzeuge
Für die Anwendung genügt ein aktueller Webbrowser. Die folgenden Werkzeuge dienen der Prüfung, Versionsverwaltung und Veröffentlichung. Direkte Prüfabhängigkeiten sind in `package.json` auf genaue Versionen festgelegt. `package-lock.json` legt auch die Versionen der indirekten Abhängigkeiten fest. `.nvmrc` bestimmt die Node.js-Hauptversion.

| Zweck | Werkzeug | Version oder Festlegung |
|---|---|---|
| Laufzeit der Prüfskripte | Node.js | 22 laut `.nvmrc`, mindestens 22.13.0 laut `package.json` |
| Browsertests | Playwright mit Chromium, Firefox und WebKit (Engine von Safari) | Playwright 1.56.0 |
| Statische Codeprüfung | ESLint | 10.12.0 |
| Linter-Regelsatz | `@eslint/js` | 10.0.1 |
| Globale Namen für den Linter | `globals` | 17.13.0 |
| Versionsverwaltung | Git | Keine Version im Projekt festgelegt |
| Automatisierung und Hosting | GitHub Actions, GitHub Pages | Konfiguration in `pipeline.yml` |

## 7 Datenschutz

- Fragenführung, Auswertung und Ergebnisdarstellung laufen vollständig im Browser.
- Die Seite überträgt keine Eingaben und legt nichts im Browser ab (kein Cookie, kein
  lokaler Speicher). Nach dem Neuladen oder Schließen der Seite sind alle Angaben weg.
- Die Seite lädt nur ihre eigenen Dateien: fünf Dateien der Anwendung und die Schriften aus
  `css/schriften/`. Eine Sicherheitsrichtlinie in `SA-Tool.html` (Content Security Policy)
  untersagt Verbindungen zu anderen Adressen.
- Verweise auf der Startseite und im Ergebnis führen zu externen Seiten, vor allem zu den
  Rechtstexten auf EUR-Lex. Sie öffnen sich nur auf Klick in einem neuen Fenster.




