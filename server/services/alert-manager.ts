import * as fs from 'fs';
import * as path from 'path';
import { log } from './logger.js';

interface AlertConfig {
  webhookUrl: string;
  enabled: boolean;
  rules: {
    budgetExceed: boolean;
    highCostSession: boolean;
    highCostThreshold: number;
  };
}

interface AlertRecord {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  delivered: boolean;
}

const DEFAULT_CONFIG: AlertConfig = {
  webhookUrl: '',
  enabled: false,
  rules: {
    budgetExceed: true,
    highCostSession: true,
    highCostThreshold: 1.0,
  },
};

function getStateDir(): string {
  const dir = process.env.CLAWCLIP_STATE_DIR || path.join(process.cwd(), '.clawclip');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function configPath(): string {
  return path.join(getStateDir(), 'alert-config.json');
}

function historyPath(): string {
  return path.join(getStateDir(), 'alert-history.json');
}

export class AlertManager {
  getConfig(): AlertConfig {
    try {
      const raw = fs.readFileSync(configPath(), 'utf-8');
      return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    } catch {
      return { ...DEFAULT_CONFIG };
    }
  }

  saveConfig(partial: Partial<AlertConfig>): AlertConfig {
    const current = this.getConfig();
    const merged: AlertConfig = {
      ...current,
      ...partial,
      rules: { ...current.rules, ...(partial.rules || {}) },
    };
    fs.writeFileSync(configPath(), JSON.stringify(merged, null, 2), 'utf-8');
    return merged;
  }

  getHistory(limit: number = 50): AlertRecord[] {
    try {
      const raw = fs.readFileSync(historyPath(), 'utf-8');
      const records: AlertRecord[] = JSON.parse(raw);
      return Array.isArray(records) ? records.slice(-limit) : [];
    } catch {
      return [];
    }
  }

  async sendAlert(type: string, message: string): Promise<boolean> {
    const config = this.getConfig();
    const record: AlertRecord = {
      id: `alert-${Date.now()}`,
      type,
      message,
      timestamp: new Date().toISOString(),
      delivered: false,
    };

    if (!config.enabled || !config.webhookUrl) {
      this.appendHistory(record);
      return false;
    }

    try {
      const body = JSON.stringify({
        msgtype: 'text',
        text: { content: `[ClawClip Alert] ${message}` },
        msg_type: 'text',
        content: { text: `[ClawClip Alert] ${message}` },
      });

      const res = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        signal: AbortSignal.timeout(10000),
      });

      record.delivered = res.ok;
      if (!res.ok) log.warn(`[alert] webhook returned ${res.status}`);
    } catch (e) {
      log.warn('[alert] webhook failed:', (e as Error).message);
    }

    this.appendHistory(record);
    return record.delivered;
  }

  async checkBudgetAlert(totalCost: number, budget: number): Promise<void> {
    const config = this.getConfig();
    if (!config.rules.budgetExceed) return;
    if (totalCost >= budget * 0.8) {
      const pct = Math.round((totalCost / budget) * 100);
      await this.sendAlert('budget', `Monthly cost $${totalCost.toFixed(2)} has reached ${pct}% of budget $${budget.toFixed(2)}`);
    }
  }

  async checkHighCostSession(sessionLabel: string, cost: number): Promise<void> {
    const config = this.getConfig();
    if (!config.rules.highCostSession) return;
    if (cost >= config.rules.highCostThreshold) {
      await this.sendAlert('high_cost', `Session "${sessionLabel}" cost $${cost.toFixed(4)}, exceeding threshold $${config.rules.highCostThreshold}`);
    }
  }

  private appendHistory(record: AlertRecord): void {
    const records = this.getHistory(200);
    records.push(record);
    const trimmed = records.slice(-200);
    try {
      fs.writeFileSync(historyPath(), JSON.stringify(trimmed, null, 2), 'utf-8');
    } catch {
      log.warn('[alert] failed to write history');
    }
  }
}

export const alertManager = new AlertManager();
