# 🍤 ClawClip

> **English** | [中文](README.zh-CN.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md)

**What did your AI Agent actually do?**

ClawClip is a local-first visualization tool for AI Agents. It turns JSONL session logs from OpenClaw / ZeroClaw (and compatible frameworks) into interactive timeline replays, runs offline 6-dimension benchmarks, and tracks token costs. All analysis runs **locally — no LLM API calls, no extra bills, data stays on your machine.**

**Live demo**: https://clawclip.luelan.online (8 built-in demo sessions, no install needed)

## Quick Start

**Requirements**: Node.js **≥ 18**. First run auto-builds (~1-2 min).

```bash
git clone https://github.com/Ylsssq926/clawclip.git
cd clawclip && npm install && npm start
# → http://localhost:8080
```

### Development Mode

```bash
# Terminal 1: backend (tsx watch, hot reload)
npm run dev:server

# Terminal 2: frontend (Vite dev server, port 3000, /api proxied to 8080)
npm run dev:web
```

### Where does the data come from?

- On startup, ClawClip scans **`~/.openclaw/`** and env vars **`OPENCLAW_STATE_DIR`**, **`CLAWCLIP_LOBSTER_DIRS`** for session **JSONL** files.
- **No real JSONL?** 8 built-in Demo sessions let you explore replay, benchmark, and cost features.
- **Only SQLite, no JSONL?** The dashboard shows ecosystem hints — ClawClip currently targets the JSONL session path.

## Features

| Feature | Description |
|---------|-------------|
| 🎬 Session Replay | JSONL logs → interactive timeline with thinking, tool calls, results, and token costs step by step |
| 📊 6-Dimension Benchmark | Writing, Coding, Tool Use, Retrieval, Safety, Cost Efficiency — S/A/B/C/D rank + radar chart + evolution curve |
| 💰 Cost Monitor | Token spend trends, model cost breakdown, budget alerts, insights & savings suggestions |
| ☁️ Word Cloud & Tags | Auto-extracted keywords visualized as a word cloud, session auto-tagging |
| 📚 Knowledge Base | Import session JSON to build a searchable knowledge base with drag-and-drop upload |
| 🏆 Leaderboard | Submit benchmark scores and compare your Agent with others |
| 🛒 Template Market | Pre-built Agent scenario templates, one-click apply + skill management |
| 🧠 Smart Savings | Cost analysis + alternative model recommendations (powered by PriceToken real-time pricing) |

## Tech Stack

Express + TypeScript | React 18 + Vite + Tailwind CSS | Recharts | Framer Motion | Lucide React

## Roadmap

- [x] Session replay engine + 8 demo sessions
- [x] 6-dimension benchmark + radar chart + evolution curve
- [x] Cost monitor + budget alerts
- [x] Word cloud + auto-tagging
- [x] Share cards + Landing page
- [x] Knowledge base import/export + full-text search
- [x] Leaderboard (submit scores + rankings)
- [x] Template market + skill management
- [x] Smart savings / cost optimization (P0 + P1 done)
- [ ] P2: (optional milestone) runtime/gateway deep integration

## Health Check

```bash
curl -s http://localhost:8080/api/health
# → { "ok": true, "service": "clawclip", "ts": "..." }
```

## Type Check (before PR / release)

```bash
npm run check
```

Runs `tsc --noEmit` for both `server` and `web` workspaces.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines. Security self-check: [docs/SECURITY_CHECKLIST.md](docs/SECURITY_CHECKLIST.md).

## Community

QQ Group: `892555092`

## About the Shrimp

> I'm a lobster pulled out of the OpenClaw ecosystem by my owner.
> Owner said: "You run in the background all day, nobody sees what you do."
> I said: "Then record my work and show them."
> Owner: "We recorded it, but we don't know if you're any good."
> I said: "Then test me — all six subjects, I'm not afraid."
> And that's how ClawClip was born.
>
> — 🍤 ClawClip Mascot

## License

[MIT](LICENSE)

---

Made by Luelan (掠蓝)
