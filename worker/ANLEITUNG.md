# KI-Chat einrichten (Schritt für Schritt)

Der Chat läuft auch **ohne** diese Anleitung: Dann nutzt er nur die Textsuche in `js/chat-data.js` (ohne KI).
Mit dem Worker beantwortet zusätzlich eine kostenlose KI die Frage in einem Satz, und fällt eine KI aus oder ist ihr Tageslimit voll, springt automatisch die nächste ein. Sind alle erschöpft, zeigt der Chat wieder die Textsuche.

Die Bezeichnungen im Cloudflare-Dashboard ändern sich ab und zu, die Schritte bleiben aber gleich.

## 1. Cloudflare-Konto
1. Auf cloudflare.com ein kostenloses Konto anlegen.

## 2. Worker anlegen
1. Im Dashboard: **Workers & Pages** → **Create** → **Create Worker**.
2. Name: `origins2-chat` → **Deploy**.
3. Dann **Edit code**: den ganzen Beispielcode löschen und den **gesamten Inhalt von `worker/chat-worker.js`** einfügen → **Deploy**.

## 3. Erste KI einschalten (Cloudflare Workers AI, kostenlos)
1. Beim Worker: **Settings** → **Bindings** → **Add** → **Workers AI**.
2. Variablenname: `AI` → speichern.

## 4. Weitere KIs als Reserve (optional, aber empfohlen)
Schlüssel bekommst du kostenlos bei den Anbietern:
- **Google Gemini:** aistudio.google.com → „Get API key“
- **Groq:** console.groq.com → „API Keys“
- **Mistral:** console.mistral.ai → „API Keys“

Beim Worker: **Settings** → **Variables and Secrets** → **Add** → Typ **Secret**:

| Name | Wert |
|---|---|
| `GEMINI_API_KEY` | dein Gemini-Schlüssel |
| `GROQ_API_KEY` | dein Groq-Schlüssel |
| `MISTRAL_API_KEY` | dein Mistral-Schlüssel |

Es müssen nicht alle sein. Anbieter ohne Schlüssel werden übersprungen. Die Reihenfolge ist: Workers AI, Gemini, Groq, Mistral.

**Schlüssel niemals** in den Chat, in eine Datei der Seite oder nach GitHub schreiben. Sie gehören nur hier als „Secret“ hin.

## 5. Erlaubte Seite eintragen
1. Dieselbe Stelle, Typ **Text**: Name `ALLOWED_ORIGINS`, Wert `https://society-origins2.github.io`
2. Zum lokalen Testen mit einem kleinen Webserver kann man mit Komma etwas ergänzen, z. B. `https://society-origins2.github.io,http://localhost:8080`. Mit einem direkt geöffneten `file://`-Link funktioniert der Worker nicht (der Browser schickt dann keine Herkunft mit).

## 6. Worker mit der Seite verbinden
1. Oben beim Worker die Adresse kopieren (endet auf `.workers.dev`).
2. In `js/chat.js` bei `CHAT_API_URL` eintragen (in Anführungszeichen).
3. Test: Seite mit `…/index.html?chat=1` öffnen und eine Frage stellen, die in `js/chat-data.js` vorkommt.

## 7. Livegang (erst wenn alles stimmt)
1. Echte Wiki-Daten in `js/chat-data.js` eintragen, **alle Einträge mit `isTest: true` löschen**.
2. In `js/chat.js`: `CHAT_ENABLED = true`.
3. Changelog-Eintrag (de + en), `?v=` in der `index.html` hochzählen, hochladen.

## Wichtig zu wissen
- Alle Gratis-Tarife haben Tageslimits und ändern sich manchmal. Prüfe sie ab und zu bei den Anbietern.
- Modellnamen (oben in `chat-worker.js` unter `MODELS`) werden gelegentlich ersetzt. Wenn eine KI plötzlich nie antwortet, dort den aktuellen Namen eintragen.
- Der Worker begrenzt Fragen pro Besucher und pro Tag (`RATE_PER_10_MIN`, `DAILY_LIMIT`). Die Zähler gelten je Worker-Instanz und sind eine einfache Bremse, kein harter Schutz.
- Die KI bekommt nur die zur Frage passenden Einträge aus `js/chat-data.js` und soll nur daraus antworten. Was dort nicht steht, beantwortet sie mit „Das weiß ich noch nicht“.
