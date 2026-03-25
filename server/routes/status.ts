import { Router } from 'express';
import { openclawBridge } from '../services/openclaw-bridge.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const status = await openclawBridge.getStatus();
    res.json(status);
  } catch (e) {
    res.status(500).json({ error: '获取状态失败 / Failed to get status', detail: String(e) });
  }
});

export default router;
