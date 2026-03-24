import * as fs from 'fs';
import * as path from 'path';
import type { EcosystemNote, LobsterDataRootStatus } from '../types/index.js';

/** 浅层探测：数据根下是否存在常见 SQLite/DB（非 JSONL 主存储的线索） */
function quickSqliteOrDbProbe(homeDir: string): boolean {
  const direct = [
    path.join(homeDir, 'state.sqlite'),
    path.join(homeDir, 'state.sqlite3'),
    path.join(homeDir, 'data.db'),
    path.join(homeDir, 'database.sqlite'),
    path.join(homeDir, 'data', 'state.sqlite'),
    path.join(homeDir, 'data', 'db.sqlite'),
  ];
  for (const p of direct) {
    try {
      if (fs.existsSync(p) && fs.statSync(p).isFile()) return true;
    } catch {
      /* ignore */
    }
  }
  try {
    for (const name of fs.readdirSync(homeDir)) {
      if (/\.(sqlite|sqlite3|db)$/i.test(name)) {
        const p = path.join(homeDir, name);
        try {
          if (fs.statSync(p).isFile()) return true;
        } catch {
          /* ignore */
        }
      }
    }
  } catch {
    /* ignore */
  }
  return false;
}

/**
 * 长期兼容：在「无 JSONL」时给出可操作的生态提示，避免用户误以为虾片坏了。
 */
export function buildEcosystemNotes(roots: LobsterDataRootStatus[]): EcosystemNote[] {
  const notes: EcosystemNote[] = [];
  for (const r of roots) {
    if (r.sessionJsonlFiles > 0) continue;

    if (quickSqliteOrDbProbe(r.homeDir)) {
      notes.push({
        severity: 'info',
        rootId: r.id,
        messageZh: `在「${r.label}」下发现 SQLite/DB 文件，但未扫描到 .jsonl 会话转写。虾片回放以 OpenClaw 兼容的 JSONL 为主；其他框架可导出转写或通过官方工具同步后再查看。`,
        messageEn: `SQLite/DB found under "${r.label}" but no .jsonl transcripts. ClawClip replay targets OpenClaw-style JSONL; export or sync transcripts for other stacks.`,
      });
      continue;
    }

    if (r.id === 'zeroclaw' && r.hasConfig) {
      notes.push({
        severity: 'info',
        rootId: r.id,
        messageZh:
          '检测到 ZeroClaw 配置，但当前目录下无 JSONL 会话。部分路线以 SQLite 等为主存储，虾片会随生态稳定继续扩展适配；也可关注项目是否提供 JSONL/导出能力。',
        messageEn:
          'ZeroClaw config present but no JSONL sessions. Some builds use SQLite; we will extend adapters as the ecosystem matures, or use exports if available.',
      });
      continue;
    }

    if (r.hasConfig) {
      notes.push({
        severity: 'info',
        rootId: r.id,
        messageZh: `「${r.label}」已有配置，尚未发现 .jsonl 文件。与 Gateway 对话后，转写通常出现在 agents/<代理名>/sessions/ 目录。`,
        messageEn: `"${r.label}" has config but no .jsonl yet. After chatting with the Gateway, transcripts usually appear under agents/<agent>/sessions/.`,
      });
    }
  }
  return notes;
}
