import { Router } from 'express';
import { alertManager } from '../services/alert-manager.js';

const router = Router();

/** GET /api/alerts/config */
router.get('/config', (_req, res) => {
  const config = alertManager.getConfig();
  res.json(config);
});

/** POST /api/alerts/config */
router.post('/config', (req, res) => {
  try {
    const saved = alertManager.saveConfig(req.body);
    res.json(saved);
  } catch (e) {
    res.status(500).json({ error: '保存配置失败 / Failed to save config', detail: String(e) });
  }
});

/** GET /api/alerts/history?limit=50 */
router.get('/history', (req, res) => {
  const rawLimit = req.query.limit;
  const limit = rawLimit ? Math.min(Math.max(parseInt(String(rawLimit), 10) || 50, 1), 200) : 50;
  res.json(alertManager.getHistory(limit));
});

/** POST /api/alerts/test — 发送测试告警 */
router.post('/test', async (_req, res) => {
  try {
    const ok = await alertManager.sendAlert('test', 'This is a test alert from ClawClip.');
    res.json({ delivered: ok });
  } catch (e) {
    res.status(500).json({ error: '发送失败 / Failed to send', detail: String(e) });
  }
});

export default router;
