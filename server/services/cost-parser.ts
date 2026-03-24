import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import {
  TokenUsage,
  DailyUsage,
  CostStats,
  BudgetConfig,
  TaskCost,
  DEFAULT_MODEL_PRICING,
  DEFAULT_BUDGET_CONFIG,
} from '../types/index.js';

const HOME_DIR = os.homedir();
const OPENCLAW_DIR = path.join(HOME_DIR, '.openclaw');
const CACHE_DIR = path.join(OPENCLAW_DIR, 'cost-monitor');

export class CostParser {
  private config: BudgetConfig;
  private modelPricing: Record<string, number>;

  constructor() {
    this.ensureDirectories();
    this.config = this.loadConfig();
    this.modelPricing = DEFAULT_MODEL_PRICING;
  }

  private ensureDirectories(): void {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
  }

  private loadConfig(): BudgetConfig {
    const configPath = path.join(CACHE_DIR, 'config.json');
    if (fs.existsSync(configPath)) {
      try {
        const content = fs.readFileSync(configPath, 'utf-8');
        const loaded = { ...DEFAULT_BUDGET_CONFIG, ...JSON.parse(content) };
        if (typeof loaded.monthly !== 'number' || loaded.monthly <= 0) {
          loaded.monthly = DEFAULT_BUDGET_CONFIG.monthly;
        }
        if (typeof loaded.alertThreshold !== 'number' || loaded.alertThreshold < 1 || loaded.alertThreshold > 100) {
          loaded.alertThreshold = DEFAULT_BUDGET_CONFIG.alertThreshold;
        }
        return loaded;
      } catch {
        // 配置文件损坏，使用默认值
      }
    }
    return DEFAULT_BUDGET_CONFIG;
  }

  saveConfig(config: Partial<BudgetConfig>): void {
    this.config = { ...this.config, ...config };
    const configPath = path.join(CACHE_DIR, 'config.json');
    fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2));
  }

  getConfig(): BudgetConfig {
    return { ...this.config };
  }

  /** 解析 OpenClaw 日志文件，提取 token 用量 */
  parseLogFiles(): TokenUsage[] {
    const usages: TokenUsage[] = [];

    // 旧格式：~/.openclaw/logs/*.log
    const logsDir = path.join(OPENCLAW_DIR, 'logs');
    if (fs.existsSync(logsDir)) {
      this.parseDirectory(logsDir, '.log', usages);
    }

    // 新格式：~/.openclaw/agents/*/sessions/*.jsonl
    const agentsDir = path.join(OPENCLAW_DIR, 'agents');
    if (fs.existsSync(agentsDir)) {
      const agents = fs.readdirSync(agentsDir).filter(f => {
        return fs.statSync(path.join(agentsDir, f)).isDirectory();
      });
      for (const agent of agents) {
        const sessionsDir = path.join(agentsDir, agent, 'sessions');
        if (fs.existsSync(sessionsDir)) {
          this.parseDirectory(sessionsDir, '.jsonl', usages);
        }
      }
    }

    return usages;
  }

  private parseDirectory(dir: string, ext: string, usages: TokenUsage[]): void {
    const files = fs.readdirSync(dir).filter(f => f.endsWith(ext));
    for (const file of files) {
      const filePath = path.join(dir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      for (const line of content.split('\n')) {
        if (!line.includes('"usage"')) continue;
        try {
          const parsed = JSON.parse(line);
          if (!parsed.usage) continue;
          const model = parsed.model || 'unknown';
          const inputTokens = parsed.usage.input_tokens || parsed.usage.prompt_tokens || 0;
          const outputTokens = parsed.usage.output_tokens || parsed.usage.completion_tokens || 0;
          const price = this.modelPricing[model] || 5.0;
          const cost = (inputTokens + outputTokens) * price / 1_000_000;

          usages.push({
            timestamp: new Date(parsed.timestamp || Date.now()),
            taskId: parsed.task_id || parsed.session_id || file,
            model,
            inputTokens,
            outputTokens,
            cost,
            sessionId: parsed.session_id || 'unknown',
          });
        } catch {
          // 跳过无效行
        }
      }
    }
  }

  getUsageStats(days: number = 30): CostStats {
    const usages = this.parseLogFiles();
    const now = Date.now();
    const cutoff = now - days * 24 * 60 * 60 * 1000;
    const filtered = usages.filter(u => u.timestamp.getTime() > cutoff);

    const totalCost = filtered.reduce((s, u) => s + u.cost, 0);
    const totalTokens = filtered.reduce((s, u) => s + u.inputTokens + u.outputTokens, 0);
    const inputTokens = filtered.reduce((s, u) => s + u.inputTokens, 0);
    const outputTokens = filtered.reduce((s, u) => s + u.outputTokens, 0);

    // 按任务聚合
    const taskMap = new Map<string, TaskCost>();
    for (const u of filtered) {
      const existing = taskMap.get(u.taskId);
      if (existing) {
        existing.tokens += u.inputTokens + u.outputTokens;
        existing.cost += u.cost;
      } else {
        taskMap.set(u.taskId, {
          taskId: u.taskId,
          taskName: u.taskId,
          tokens: u.inputTokens + u.outputTokens,
          cost: u.cost,
          timestamp: u.timestamp,
        });
      }
    }
    const topTasks = Array.from(taskMap.values()).sort((a, b) => b.cost - a.cost).slice(0, 10);

    // 环比
    const prevCutoff = now - 2 * days * 24 * 60 * 60 * 1000;
    const prevFiltered = usages.filter(u => u.timestamp.getTime() > prevCutoff && u.timestamp.getTime() <= cutoff);
    const prevCost = prevFiltered.reduce((s, u) => s + u.cost, 0);
    const trend: 'up' | 'down' | 'stable' =
      totalCost > prevCost * 1.1 ? 'up' : totalCost < prevCost * 0.9 ? 'down' : 'stable';

    return {
      totalCost,
      totalTokens,
      inputTokens,
      outputTokens,
      averageCostPerTask: taskMap.size > 0 ? totalCost / taskMap.size : 0,
      topTasks,
      trend,
      comparedToLastMonth: prevCost > 0 ? ((totalCost - prevCost) / prevCost) * 100 : 0,
    };
  }

  getDailyUsage(days: number = 7): DailyUsage[] {
    const usages = this.parseLogFiles();
    const dailyMap = new Map<string, DailyUsage>();

    for (let i = 0; i < days; i++) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      dailyMap.set(dateStr, { date: dateStr, inputTokens: 0, outputTokens: 0, totalTokens: 0, cost: 0 });
    }

    for (const u of usages) {
      const dateStr = u.timestamp.toISOString().split('T')[0];
      const daily = dailyMap.get(dateStr);
      if (daily) {
        daily.inputTokens += u.inputTokens;
        daily.outputTokens += u.outputTokens;
        daily.totalTokens += u.inputTokens + u.outputTokens;
        daily.cost += u.cost;
      }
    }

    return Array.from(dailyMap.values()).reverse();
  }

  /** 按模型分组统计费用 */
  getModelBreakdown(days: number = 30): Record<string, { tokens: number; cost: number }> {
    const usages = this.parseLogFiles();
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const filtered = usages.filter(u => u.timestamp.getTime() > cutoff);

    const models: Record<string, { tokens: number; cost: number }> = {};
    for (const u of filtered) {
      if (!models[u.model]) models[u.model] = { tokens: 0, cost: 0 };
      models[u.model].tokens += u.inputTokens + u.outputTokens;
      models[u.model].cost += u.cost;
    }
    return models;
  }

  checkBudgetAlert(): { isAlert: boolean; percentage: number; message: string } {
    if (this.config.monthly <= 0) {
      return { isAlert: false, percentage: 0, message: '未设置月预算' };
    }
    const stats = this.getUsageStats(30);
    const percentage = (stats.totalCost / this.config.monthly) * 100;
    return {
      isAlert: percentage >= this.config.alertThreshold,
      percentage,
      message: percentage >= 100
        ? `预算已超支！当前消费 ¥${stats.totalCost.toFixed(2)}，超出 ¥${(stats.totalCost - this.config.monthly).toFixed(2)}`
        : percentage >= this.config.alertThreshold
        ? `预算使用已达 ${percentage.toFixed(1)}%，剩余 ¥${(this.config.monthly - stats.totalCost).toFixed(2)}`
        : `预算状态良好，当前使用 ${percentage.toFixed(1)}%`,
    };
  }
}

export const costParser = new CostParser();
