import { execFile } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import type { OpenClawStatus, SkillInfo } from '../types/index.js';

const execFileAsync = promisify(execFile);
const HOME_DIR = os.homedir();
const OPENCLAW_DIR = path.join(HOME_DIR, '.openclaw');

/** 校验 skill 名称，防止命令注入和路径穿越 */
function isValidSkillName(name: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(name) && name.length > 0 && name.length < 100;
}

export class OpenClawBridge {
  /** 获取 OpenClaw 运行状态 */
  async getStatus(): Promise<OpenClawStatus> {
    const configPath = path.join(OPENCLAW_DIR, 'openclaw.json');
    const configExists = fs.existsSync(configPath);

    let version = 'unknown';
    let running = false;
    let channels: string[] = [];

    try {
      const { stdout } = await execFileAsync('openclaw', ['status', '--all'], { timeout: 5000 });
      running = stdout.includes('running') || stdout.includes('Gateway');
      const versionMatch = stdout.match(/version[:\s]+([^\s\n]+)/i);
      if (versionMatch) version = versionMatch[1];
    } catch {
      // OpenClaw 未安装或未运行
    }

    if (configExists) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        if (config.channels) {
          channels = Object.keys(config.channels).filter(k => config.channels[k]?.enabled);
        }
      } catch {
        // 配置文件解析失败
      }
    }

    const skillCount = await this.getInstalledSkillCount();

    return {
      running,
      version,
      uptime: running ? '运行中' : '未运行',
      configPath: configExists ? configPath : '',
      skillCount,
      channels,
    };
  }

  /** 获取已安装 Skill 列表 */
  async getInstalledSkills(): Promise<SkillInfo[]> {
    const skillsDir = path.join(OPENCLAW_DIR, 'skills');
    if (!fs.existsSync(skillsDir)) return [];

    const skills: SkillInfo[] = [];
    const entries = fs.readdirSync(skillsDir);

    for (const entry of entries) {
      const skillPath = path.join(skillsDir, entry);
      if (!fs.statSync(skillPath).isDirectory()) continue;

      const skillMd = path.join(skillPath, 'SKILL.md');
      let description = '';
      if (fs.existsSync(skillMd)) {
        const content = fs.readFileSync(skillMd, 'utf-8');
        const descMatch = content.match(/^#\s+(.+)/m);
        if (descMatch) description = descMatch[1];
      }

      skills.push({
        name: entry,
        description: description || entry,
        installed: true,
      });
    }

    return skills;
  }

  private async getInstalledSkillCount(): Promise<number> {
    const skillsDir = path.join(OPENCLAW_DIR, 'skills');
    if (!fs.existsSync(skillsDir)) return 0;
    return fs.readdirSync(skillsDir).filter(f => {
      return fs.statSync(path.join(skillsDir, f)).isDirectory();
    }).length;
  }

  /** 安装 Skill（调用 clawhub CLI） */
  async installSkill(name: string): Promise<{ success: boolean; message: string }> {
    if (!isValidSkillName(name)) {
      return { success: false, message: '无效的 Skill 名称，只允许字母、数字、下划线和连字符' };
    }
    try {
      await execFileAsync('npx', ['clawhub', 'install', name], { timeout: 30000 });
      return { success: true, message: `${name} 安装成功` };
    } catch (e) {
      return { success: false, message: `安装失败: ${e instanceof Error ? e.message : e}` };
    }
  }

  /** 卸载 Skill */
  async uninstallSkill(name: string): Promise<{ success: boolean; message: string }> {
    if (!isValidSkillName(name)) {
      return { success: false, message: '无效的 Skill 名称' };
    }

    const skillsDir = path.join(OPENCLAW_DIR, 'skills');
    const skillPath = path.join(skillsDir, name);

    // 防止路径穿越：确认解析后的路径仍在 skills 目录下
    const resolved = path.resolve(skillPath);
    if (!resolved.startsWith(path.resolve(skillsDir))) {
      return { success: false, message: '非法路径' };
    }

    if (!fs.existsSync(skillPath)) {
      return { success: false, message: `Skill ${name} 不存在` };
    }
    try {
      fs.rmSync(skillPath, { recursive: true });
      return { success: true, message: `${name} 已卸载` };
    } catch (e) {
      return { success: false, message: `卸载失败: ${e instanceof Error ? e.message : e}` };
    }
  }
}

export const openclawBridge = new OpenClawBridge();
