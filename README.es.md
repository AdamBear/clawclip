# 🍤 ClawClip

> [English](README.md) | [中文](README.zh-CN.md) | [日本語](README.ja.md) | [한국어](README.ko.md) | **Español** | [Français](README.fr.md) | [Deutsch](README.de.md)

**¿Qué hizo realmente tu agente de IA?**

ClawClip es una herramienta de visualización local-first para agentes de IA. Convierte registros de sesión JSONL de OpenClaw / ZeroClaw (y marcos compatibles) en reproducciones interactivas en la línea de tiempo, ejecuta benchmarks offline en 6 dimensiones y hace seguimiento del coste en tokens. Todo el análisis se ejecuta **en local — sin llamadas a la API de un LLM, sin facturas extra; los datos permanecen en tu máquina.**

**Demo en vivo**: https://clawclip.luelan.online (8 sesiones de demostración integradas, sin instalación)

## Inicio rápido

**Requisitos**: Node.js **≥ 18**. La primera ejecución compila automáticamente (~1–2 min).

```bash
git clone https://github.com/Ylsssq926/clawclip.git
cd clawclip && npm install && npm start
# → http://localhost:8080
```

### Modo desarrollo

```bash
# Terminal 1: backend (tsx watch, hot reload)
npm run dev:server

# Terminal 2: frontend (Vite dev server, port 3000, /api proxied to 8080)
npm run dev:web
```

### ¿De dónde salen los datos?

- Al iniciar, ClawClip escanea **`~/.openclaw/`** y las variables de entorno **`OPENCLAW_STATE_DIR`**, **`CLAWCLIP_LOBSTER_DIRS`** en busca de archivos **JSONL** de sesión.
- **¿No hay JSONL real?** 8 sesiones demo integradas permiten explorar reproducción, benchmark y costes.
- **¿Solo SQLite y sin JSONL?** El panel muestra pistas del ecosistema — ClawClip se centra actualmente en la ruta de sesión JSONL.

## Características

| Característica | Descripción |
|---------|-------------|
| 🎬 Reproducción de sesión | Registros JSONL → línea de tiempo interactiva con razonamiento, llamadas a herramientas, resultados y costes de tokens paso a paso |
| 📊 Benchmark en 6 dimensiones | Escritura, código, uso de herramientas, recuperación, seguridad, eficiencia de coste — rango S/A/B/C/D + gráfico radar + curva de evolución |
| 💰 Monitor de costes | Tendencias de gasto en tokens, desglose por modelo, alertas de presupuesto, ideas y sugerencias de ahorro |
| ☁️ Nube de palabras y etiquetas | Palabras clave extraídas automáticamente como nube de palabras, etiquetado automático de sesiones |
| 📚 Base de conocimiento | Importa JSON de sesión para construir una base de conocimiento buscable con arrastrar y soltar |
| 🏆 Clasificación | Envía puntuaciones de benchmark y compara tu agente con otros |
| 🛒 Mercado de plantillas | Plantillas de escenarios de agente predefinidas, aplicación en un clic + gestión de skills |
| 🧠 Ahorro inteligente | Análisis de costes + recomendaciones de modelos alternativos (con precios en tiempo real de PriceToken) |

## Stack tecnológico

Express + TypeScript | React 18 + Vite + Tailwind CSS | Recharts | Framer Motion | Lucide React

## Hoja de ruta

- [x] Motor de reproducción de sesión + 8 sesiones demo
- [x] Benchmark en 6 dimensiones + gráfico radar + curva de evolución
- [x] Monitor de costes + alertas de presupuesto
- [x] Nube de palabras + etiquetado automático
- [x] Tarjetas para compartir + página de aterrizaje
- [x] Importar/exportar base de conocimiento + búsqueda de texto completo
- [x] Clasificación (enviar puntuaciones + rankings)
- [x] Mercado de plantillas + gestión de skills
- [x] Ahorro inteligente / optimización de costes (P0 + P1 hecho)
- [ ] P2: (hito opcional) integración profunda con runtime/gateway

## Comprobación de salud

```bash
curl -s http://localhost:8080/api/health
# → { "ok": true, "service": "clawclip", "ts": "..." }
```

## Comprobación de tipos (antes de PR / release)

```bash
npm run check
```

Ejecuta `tsc --noEmit` en los workspaces `server` y `web`.

## Contribuir

Consulta [CONTRIBUTING.md](CONTRIBUTING.md). Autocomprobación de seguridad: [docs/SECURITY_CHECKLIST.md](docs/SECURITY_CHECKLIST.md).

## Comunidad

Grupo QQ: `892555092`

## Sobre la gamba

> Soy una langosta sacada del ecosistema OpenClaw por mi dueño.
> Mi dueño dijo: «Corres en segundo plano todo el día y nadie ve lo que haces.»
> Yo dije: «Entonces registren mi trabajo y muéstrenlo.»
> Dueño: «Lo registramos, pero no sabemos si de verdad vales.»
> Yo dije: «Pues pónganme a prueba — las seis asignaturas, no tengo miedo.»
> Así nació ClawClip.
>
> — 🍤 Mascota de ClawClip

## Licencia

[MIT](LICENSE)

---

Made by Luelan (掠蓝)
