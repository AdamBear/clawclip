# 🍤 ClawClip

> [English](README.md) | [中文](README.zh-CN.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | [Español](README.es.md) | **Français** | [Deutsch](README.de.md)

**Que faisait vraiment votre agent IA ?**

ClawClip est un outil de visualisation local-first pour les agents IA. Il transforme les journaux de session JSONL d’OpenClaw / ZeroClaw (et frameworks compatibles) en lectures interactives sur la ligne du temps, exécute des benchmarks hors ligne sur 6 dimensions et suit les coûts en tokens. Toute l’analyse s’exécute **en local — pas d’appels à l’API LLM, pas de facture supplémentaire, les données restent sur votre machine.**

**Démo en ligne** : https://clawclip.luelan.online (8 sessions de démo intégrées, sans installation)

## Démarrage rapide

**Prérequis** : Node.js **≥ 18**. Au premier lancement, compilation automatique (~1–2 min).

```bash
git clone https://github.com/Ylsssq926/clawclip.git
cd clawclip && npm install && npm start
# → http://localhost:8080
```

### Mode développement

```bash
# Terminal 1: backend (tsx watch, hot reload)
npm run dev:server

# Terminal 2: frontend (Vite dev server, port 3000, /api proxied to 8080)
npm run dev:web
```

### D’où viennent les données ?

- Au démarrage, ClawClip parcourt **`~/.openclaw/`** et les variables d’environnement **`OPENCLAW_STATE_DIR`**, **`CLAWCLIP_LOBSTER_DIRS`** à la recherche de fichiers **JSONL** de session.
- **Pas de JSONL réel ?** 8 sessions de démo intégrées permettent d’explorer la lecture, le benchmark et les coûts.
- **Seulement SQLite, pas de JSONL ?** Le tableau de bord affiche des indications sur l’écosystème — ClawClip cible actuellement le chemin des sessions JSONL.

## Fonctionnalités

| Fonctionnalité | Description |
|---------|-------------|
| 🎬 Lecture de session | Journaux JSONL → ligne du temps interactive avec raisonnement, appels d’outils, résultats et coûts en tokens pas à pas |
| 📊 Benchmark 6 dimensions | Rédaction, code, usage d’outils, récupération, sécurité, efficacité des coûts — rang S/A/B/C/D + graphique radar + courbe d’évolution |
| 💰 Suivi des coûts | Tendances de dépense en tokens, ventilation par modèle, alertes budgétaires, idées et pistes d’économies |
| ☁️ Nuage de mots et tags | Mots-clés extraits automatiquement en nuage de mots, étiquetage automatique des sessions |
| 📚 Base de connaissances | Importez des JSON de session pour une base consultable avec glisser-déposer |
| 🏆 Classement | Soumettez des scores de benchmark et comparez votre agent aux autres |
| 🛒 Marché de gabarits | Gabarits de scénarios d’agent prêts à l’emploi, application en un clic + gestion des skills |
| 🧠 Économies intelligentes | Analyse des coûts + recommandations de modèles alternatifs (prix en temps réel PriceToken) |

## Pile technique

Express + TypeScript | React 18 + Vite + Tailwind CSS | Recharts | Framer Motion | Lucide React

## Feuille de route

- [x] Moteur de lecture de session + 8 sessions de démo
- [x] Benchmark 6 dimensions + graphique radar + courbe d’évolution
- [x] Suivi des coûts + alertes budgétaires
- [x] Nuage de mots + étiquetage automatique
- [x] Cartes de partage + page d’accueil
- [x] Import/export base de connaissances + recherche plein texte
- [x] Classement (soumission des scores + classements)
- [x] Marché de gabarits + gestion des skills
- [x] Économies intelligentes / optimisation des coûts (P0 + P1 terminés)
- [ ] P2 : (jalon optionnel) intégration poussée runtime / passerelle

## Vérification de santé

```bash
curl -s http://localhost:8080/api/health
# → { "ok": true, "service": "clawclip", "ts": "..." }
```

## Vérification des types (avant PR / release)

```bash
npm run check
```

Lance `tsc --noEmit` pour les espaces de travail `server` et `web`.

## Contribuer

Voir [CONTRIBUTING.md](CONTRIBUTING.md). Auto-contrôle sécurité : [docs/SECURITY_CHECKLIST.md](docs/SECURITY_CHECKLIST.md).

## Communauté

Groupe QQ : `892555092`

## À propos de la crevette

> Je suis un homard sorti de l’écosystème OpenClaw par mon propriétaire.
> Il a dit : « Tu tournes en arrière-plan toute la journée, personne ne voit ce que tu fais. »
> J’ai répondu : « Alors enregistrez mon travail et montrez-le. »
> Lui : « On l’a enregistré, mais on ne sait pas si tu es vraiment bon. »
> J’ai dit : « Alors testez-moi — les six matières, je n’ai pas peur. »
> Et c’est ainsi qu’est né ClawClip.
>
> — 🍤 Mascotte ClawClip

## Licence

[MIT](LICENSE)

---

Made by Luelan (掠蓝)
