# 🍤 虾片 (ClawClip)

**你的 AI Agent 到底干了什么？**

虾片是一个本地部署的 AI Agent 可视化工具——把 OpenClaw / ZeroClaw 的日志变成可交互的时间轴回放，给你的 Agent 做六维能力评测，追踪费用消耗。不需要联网，不调 API，数据完全在你手里。

**在线体验**: https://clawclip.luelan.online （内置 8 条 Demo 会话，无需安装）

## 这是给谁用的？

- 你装了 OpenClaw / ZeroClaw，想知道 Agent 每一步在干嘛
- 你想评估 Agent 的中文写作、代码、工具调用、检索、安全性和性价比
- 你想监控 Token 花了多少钱、花在了哪个模型上
- 你想通过词云和标签快速回顾 Agent 的工作内容

## 怎么用？

```bash
# 1. 克隆
git clone https://github.com/Ylsssq926/clawclip.git
cd clawclip

# 2. 安装
npm install

# 3. 构建并启动
npm run build && npm start

# 打开 http://localhost:8080
```

启动后，虾片会自动读取 `~/.openclaw/` 目录下的 Agent 会话日志。没有日志？内置 8 条 Demo 数据让你先看看效果。

## 核心功能

### 会话回放

把 JSONL 日志解析成时间轴——Agent 每一步的思考、工具调用、返回结果、Token 消耗，逐步展开。支持自动播放模式，像看视频一样回顾 Agent 执行过程。

### 六维评测

离线分析历史会话，从中文写作、代码能力、工具调用、信息检索、安全合规、性价比六个维度打分。输出 S/A/B/C/D 等级 + 雷达图 + 进化曲线。

### 成本监控

Token 消耗趋势图、模型费用对比、预算告警、高消耗任务排行。

### 词云与标签

自动提取会话关键词生成词云，按频率和类别着色。会话自动标签，支持筛选。

## 技术栈

Express + TypeScript | React 18 + Vite + Tailwind CSS | Recharts | Framer Motion | Lucide React

## 路线图

- [x] 会话回放引擎 + 8 条 Demo 会话
- [x] 六维评测 + 雷达图 + 进化曲线
- [x] 成本监控 + 预算告警
- [x] 词云可视化 + 自动标签
- [x] 分享卡片 + Landing Page
- [ ] 知识库导入导出
- [ ] 排行榜
- [ ] 智能路由省钱

## 交流

QQ 群: `892555092`

## 许可证

[MIT](LICENSE)

---

制作: 掠蓝 (Luelan)
