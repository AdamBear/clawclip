# 🍤 ClawClip

> [English](README.md) | [中文](README.zh-CN.md) | [日本語](README.ja.md) | **한국어** | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md)

**AI Agent가 실제로 무엇을 했는지 알고 싶으신가요?**

ClawClip은 AI Agent용 로컬 우선 시각화 도구입니다. OpenClaw / ZeroClaw(및 호환 프레임워크)의 JSONL 세션 로그를 대화형 타임라인 재생으로 바꾸고, 오프라인에서 6차원 벤치마크를 실행하며, 토큰 비용을 추적합니다. 모든 분석은 **로컬에서 실행됩니다 — LLM API 호출 없음, 추가 요금 없음, 데이터는 사용자 기기에만 머뭅니다.**

**라이브 데모**: https://clawclip.luelan.online (데모 세션 8개 내장, 설치 불필요)

## 빠른 시작

**요구 사항**: Node.js **≥ 18**. 첫 실행 시 자동 빌드(약 1~2분).

```bash
git clone https://github.com/Ylsssq926/clawclip.git
cd clawclip && npm install && npm start
# → http://localhost:8080
```

### 개발 모드

```bash
# Terminal 1: backend (tsx watch, hot reload)
npm run dev:server

# Terminal 2: frontend (Vite dev server, port 3000, /api proxied to 8080)
npm run dev:web
```

### 데이터는 어디서 오나요?

- 시작 시 ClawClip은 **`~/.openclaw/`** 및 환경 변수 **`OPENCLAW_STATE_DIR`**, **`CLAWCLIP_LOBSTER_DIRS`**에서 세션 **JSONL** 파일을 검색합니다.
- **실제 JSONL이 없나요?** 내장 데모 세션 8개로 재생, 벤치마크, 비용 기능을 살펴볼 수 있습니다.
- **SQLite만 있고 JSONL이 없나요?** 대시보드에 생태계 안내가 표시됩니다 — ClawClip은 현재 JSONL 세션 경로를 대상으로 합니다.

## 기능

| 기능 | 설명 |
|---------|-------------|
| 🎬 세션 재생 | JSONL 로그 → 사고 과정, 도구 호출, 결과, 토큰 비용을 단계별로 보여 주는 대화형 타임라인 |
| 📊 6차원 벤치마크 | 글쓰기, 코딩, 도구 사용, 검색, 안전, 비용 효율 — S/A/B/C/D 등급 + 레이더 차트 + 변화 곡선 |
| 💰 비용 모니터 | 토큰 지출 추세, 모델별 비용 분석, 예산 알림, 인사이트 및 절약 제안 |
| ☁️ 워드 클라우드 및 태그 | 자동 추출 키워드를 워드 클라우드로 시각화, 세션 자동 태깅 |
| 📚 지식 베이스 | 세션 JSON 가져오기로 검색 가능한 지식 베이스 구축, 드래그 앤 드롭 업로드 |
| 🏆 리더보드 | 벤치마크 점수를 제출하고 다른 Agent와 비교 |
| 🛒 템플릿 마켓 | 미리 만들어진 Agent 시나리오 템플릿, 원클릭 적용 + 스킬 관리 |
| 🧠 스마트 절약 | 비용 분석 + 대체 모델 추천(PriceToken 실시간 가격 기반) |

## 기술 스택

Express + TypeScript | React 18 + Vite + Tailwind CSS | Recharts | Framer Motion | Lucide React

## 로드맵

- [x] 세션 재생 엔진 + 데모 세션 8개
- [x] 6차원 벤치마크 + 레이더 차트 + 변화 곡선
- [x] 비용 모니터 + 예산 알림
- [x] 워드 클라우드 + 자동 태깅
- [x] 공유 카드 + 랜딩 페이지
- [x] 지식 베이스 가져오기/내보내기 + 전문 검색
- [x] 리더보드(점수 제출 + 순위)
- [x] 템플릿 마켓 + 스킬 관리
- [x] 스마트 절약 / 비용 최적화(P0 + P1 완료)
- [ ] P2: (선택 마일스톤) 런타임/게이트웨이 심층 연동

## 헬스 체크

```bash
curl -s http://localhost:8080/api/health
# → { "ok": true, "service": "clawclip", "ts": "..." }
```

## 타입 검사(PR / 릴리스 전)

```bash
npm run check
```

`server`와 `web` 워크스페이스 모두에서 `tsc --noEmit`을 실행합니다.

## 기여하기

가이드라인은 [CONTRIBUTING.md](CONTRIBUTING.md)를 참고하세요. 보안 자가 점검: [docs/SECURITY_CHECKLIST.md](docs/SECURITY_CHECKLIST.md).

## 커뮤니티

QQ 그룹: `892555092`

## 이 새우에 대하여

> 나는 주인이 OpenClaw 생태계에서 꺼내 온 바닷가재랍니다.
> 주인이 말했어요. "너는 하루 종일 백그라운드에서 돌아가는데, 아무도 네가 뭘 하는지 못 봐."
> 나는 말했어요. "그럼 내 일을 기록해서 보여 주면 되죠."
> 주인: "기록은 했는데, 네가 제대로 하는지 모르겠어."
> 나는 말했어요. "그럼 시험을 보세요 — 여섯 과목 전부, 두렵지 않아요."
> 그렇게 ClawClip이 태어났습니다.
>
> — 🍤 ClawClip 마스코트

## 라이선스

[MIT](LICENSE)

---

Made by Luelan (掠蓝)
