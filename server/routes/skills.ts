import { Router } from 'express';
import { openclawBridge } from '../services/openclaw-bridge.js';

const router = Router();

/** 已安装 Skill 列表 */
router.get('/', async (_req, res) => {
  try {
    const skills = await openclawBridge.getInstalledSkills();
    res.json(skills);
  } catch (e) {
    res.status(500).json({ error: '获取 Skill 列表失败 / Failed to get skills', detail: String(e) });
  }
});

/** 安装 Skill */
router.post('/install', async (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string') {
    res.status(400).json({ error: '缺少 name 参数 / Missing name parameter' });
    return;
  }
  try {
    const result = await openclawBridge.installSkill(name.trim());
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: '安装 Skill 失败 / Failed to install skill', detail: String(e) });
  }
});

/** 卸载 Skill */
router.post('/uninstall', async (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string') {
    res.status(400).json({ error: '缺少 name 参数 / Missing name parameter' });
    return;
  }
  try {
    const result = await openclawBridge.uninstallSkill(name.trim());
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: '卸载 Skill 失败 / Failed to uninstall skill', detail: String(e) });
  }
});

export default router;
