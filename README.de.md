# 🍤 ClawClip

> [English](README.md) | [中文](README.zh-CN.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | [Español](README.es.md) | [Français](README.fr.md) | **Deutsch**

**Was hat dein KI-Agent wirklich getan?**

ClawClip ist ein lokal-first-Visualisierungstool für KI-Agenten. Es verwandelt JSONL-Sitzungsprotokolle von OpenClaw / ZeroClaw (und kompatiblen Frameworks) in interaktive Zeitachsen-Wiedergaben, führt Offline-Benchmarks in sechs Dimensionen aus und verfolgt Token-Kosten. Die gesamte Analyse läuft **lokal — keine LLM-API-Aufrufe, keine zusätzlichen Kosten, Daten bleiben auf deinem Rechner.**

**Live-Demo**: https://clawclip.luelan.online (8 integrierte Demo-Sessions, keine Installation nötig)

## Schnellstart

**Voraussetzungen**: Node.js **≥ 18**. Beim ersten Start automatischer Build (~1–2 Min.).

```bash
git clone https://github.com/Ylsssq926/clawclip.git
cd clawclip && npm install && npm start
# → http://localhost:8080
```

### Entwicklungsmodus

```bash
# Terminal 1: backend (tsx watch, hot reload)
npm run dev:server

# Terminal 2: frontend (Vite dev server, port 3000, /api proxied to 8080)
npm run dev:web
```

### Woher kommen die Daten?

- Beim Start durchsucht ClawClip **`~/.openclaw/`** sowie die Umgebungsvariablen **`OPENCLAW_STATE_DIR`**, **`CLAWCLIP_LOBSTER_DIRS`** nach **JSONL**-Sitzungsdateien.
- **Kein echtes JSONL?** 8 integrierte Demo-Sessions ermöglichen Wiedergabe, Benchmark und Kostenfunktionen.
- **Nur SQLite, kein JSONL?** Das Dashboard zeigt Hinweise zum Ökosystem — ClawClip zielt derzeit auf den JSONL-Sitzungspfad.

## Funktionen

| Funktion | Beschreibung |
|---------|-------------|
| 🎬 Sitzungswiedergabe | JSONL-Logs → interaktive Zeitachse mit Denken, Tool-Aufrufen, Ergebnissen und Token-Kosten Schritt für Schritt |
| 📊 6-Dimensionen-Benchmark | Schreiben, Programmieren, Tool-Nutzung, Abruf, Sicherheit, Kosteneffizienz — Rang S/A/B/C/D + Radardiagramm + Entwicklungskurve |
| 💰 Kostenmonitor | Token-Ausgaben-Trends, Modellkosten-Aufschlüsselung, Budgetwarnungen, Einblicke und Spartipps |
| ☁️ Wortwolke & Tags | Automatisch extrahierte Schlüsselwörter als Wortwolke, automatische Sitzungs-Tags |
| 📚 Wissensbasis | Sitzungs-JSON importieren, durchsuchbare Wissensbasis per Drag-and-Drop |
| 🏆 Bestenliste | Benchmark-Ergebnisse einreichen und deinen Agenten mit anderen vergleichen |
| 🛒 Vorlagenmarkt | Vorgefertigte Agent-Szenario-Vorlagen, Ein-Klick-Anwendung + Skill-Verwaltung |
| 🧠 Smart Savings | Kostenanalyse + Alternativmodell-Empfehlungen (basierend auf Echtzeitpreisen von PriceToken) |

## Tech-Stack

Express + TypeScript | React 18 + Vite + Tailwind CSS | Recharts | Framer Motion | Lucide React

## Roadmap

- [x] Sitzungswiedergabe-Engine + 8 Demo-Sessions
- [x] 6-Dimensionen-Benchmark + Radardiagramm + Entwicklungskurve
- [x] Kostenmonitor + Budgetwarnungen
- [x] Wortwolke + automatische Tags
- [x] Share-Karten + Landing Page
- [x] Wissensbasis Import/Export + Volltextsuche
- [x] Bestenliste (Scores einreichen + Rankings)
- [x] Vorlagenmarkt + Skill-Verwaltung
- [x] Smart Savings / Kostenoptimierung (P0 + P1 erledigt)
- [ ] P2: (optionaler Meilenstein) tiefe Runtime/Gateway-Integration

## Erreichbarkeitsprüfung

```bash
curl -s http://localhost:8080/api/health
# → { "ok": true, "service": "clawclip", "ts": "..." }
```

## Typprüfung (vor PR / Release)

```bash
npm run check
```

Führt `tsc --noEmit` für die Workspaces `server` und `web` aus.

## Mitwirken

Siehe [CONTRIBUTING.md](CONTRIBUTING.md). Sicherheits-Selbstcheck: [docs/SECURITY_CHECKLIST.md](docs/SECURITY_CHECKLIST.md).

## Community

QQ-Gruppe: `892555092`

## Über den Shrimp

> Ich bin ein Hummer, den mein Besitzer aus dem OpenClaw-Ökosystem gezogen hat.
> Der Besitzer sagte: „Du läufst den ganzen Tag im Hintergrund, niemand sieht, was du tust.“
> Ich sagte: „Dann zeichne meine Arbeit auf und zeigt sie.“
> Besitzer: „Wir haben aufgezeichnet, aber wir wissen nicht, ob du wirklich gut bist.“
> Ich sagte: „Dann testet mich — alle sechs Fächer, ich habe keine Angst.“
> So entstand ClawClip.
>
> — 🍤 ClawClip-Maskottchen

## Lizenz

[MIT](LICENSE)

---

Made by Luelan (掠蓝)
