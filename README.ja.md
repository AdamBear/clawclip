# 🍤 ClawClip

> [English](README.md) | [中文](README.zh-CN.md) | **日本語** | [한국어](README.ko.md) | [Español](README.es.md) | [Français](README.fr.md) | [Deutsch](README.de.md)

**あなたの AI Agent は本当に何をしたのか？**

ClawClip は、AI Agent 向けのローカルファーストの可視化ツールです。OpenClaw / ZeroClaw（および互換フレームワーク）の JSONL セッションログをインタラクティブなタイムライン再生に変換し、オフラインで 6 次元ベンチマークを実行し、トークンコストを追跡します。分析はすべて **ローカルで実行 — LLM API 呼び出しなし、追加請求なし、データは自分のマシンに留まります。**

**ライブデモ**: https://clawclip.luelan.online （デモセッション 8 件内蔵、インストール不要）

## クイックスタート

**要件**: Node.js **≥ 18**。初回起動時に自動ビルド（約 1〜2 分）。

```bash
git clone https://github.com/Ylsssq926/clawclip.git
cd clawclip && npm install && npm start
# → http://localhost:8080
```

### 開発モード

```bash
# Terminal 1: backend (tsx watch, hot reload)
npm run dev:server

# Terminal 2: frontend (Vite dev server, port 3000, /api proxied to 8080)
npm run dev:web
```

### データはどこから来る？

- 起動時に ClawClip は **`~/.openclaw/`** と環境変数 **`OPENCLAW_STATE_DIR`**、**`CLAWCLIP_LOBSTER_DIRS`** を走査し、セッション **JSONL** ファイルを探します。
- **本物の JSONL がない？** 内蔵の 8 件のデモセッションで再生、ベンチマーク、コスト機能を試せます。
- **SQLite だけで JSONL がない？** ダッシュボードにエコシステムのヒントが表示されます — ClawClip は現状 JSONL セッション経路を対象としています。

## 機能

| 機能 | 説明 |
|---------|-------------|
| 🎬 セッション再生 | JSONL ログ → 思考、ツール呼び出し、結果、トークンコストを段階的に表示するインタラクティブタイムライン |
| 📊 6 次元ベンチマーク | ライティング、コーディング、ツール利用、検索、安全性、コスト効率 — S/A/B/C/D ランク + レーダーチャート + 推移曲線 |
| 💰 コストモニター | トークン支出の推移、モデル別コスト内訳、予算アラート、インサイトと節約の提案 |
| ☁️ ワードクラウドとタグ | 自動抽出キーワードをワードクラウドで可視化、セッションの自動タグ付け |
| 📚 ナレッジベース | セッション JSON をインポートしてドラッグ＆ドロップで検索可能なナレッジベースを構築 |
| 🏆 リーダーボード | ベンチマークスコアを投稿し、他の Agent と比較 |
| 🛒 テンプレートマーケット | プリセットの Agent シナリオテンプレート、ワンクリック適用 + スキル管理 |
| 🧠 スマート節約 | コスト分析 + 代替モデル推奨（PriceToken のリアルタイム価格に基づく） |

## 技術スタック

Express + TypeScript | React 18 + Vite + Tailwind CSS | Recharts | Framer Motion | Lucide React

## ロードマップ

- [x] セッション再生エンジン + デモセッション 8 件
- [x] 6 次元ベンチマーク + レーダーチャート + 推移曲線
- [x] コストモニター + 予算アラート
- [x] ワードクラウド + 自動タグ付け
- [x] シェアカード + ランディングページ
- [x] ナレッジベースのインポート/エクスポート + 全文検索
- [x] リーダーボード（スコア投稿 + ランキング）
- [x] テンプレートマーケット + スキル管理
- [x] スマート節約 / コスト最適化（P0 + P1 完了）
- [ ] P2: （任意のマイルストーン）ランタイム/ゲートウェイとの深い連携

## ヘルスチェック

```bash
curl -s http://localhost:8080/api/health
# → { "ok": true, "service": "clawclip", "ts": "..." }
```

## 型チェック（PR / リリース前）

```bash
npm run check
```

`server` と `web` の両ワークスペースで `tsc --noEmit` を実行します。

## コントリビューション

ガイドラインは [CONTRIBUTING.md](CONTRIBUTING.md) を参照。セキュリティ自己チェック: [docs/SECURITY_CHECKLIST.md](docs/SECURITY_CHECKLIST.md)。

## コミュニティ

QQ グループ: `892555092`

## このエビについて

> 私は飼い主に OpenClaw のエコシステムから引き上げられたロブスターです。
> 飼い主は言いました。「お前は一日中バックグラウンドで動いてるのに、誰もお前が何をしてるか見えない。」
> 私は言いました。「じゃあ仕事を記録して見せればいい。」
> 飼い主「記録はしたけど、お前が本当にできるかどうかわからない。」
> 私は言いました。「じゃあ試せばいい — 六科目全部、怖くない。」
> そうして ClawClip が生まれました。
>
> — 🍤 ClawClip マスコット

## ライセンス

[MIT](LICENSE)

---

Made by Luelan (掠蓝)
