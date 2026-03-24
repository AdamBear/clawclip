import { Router } from 'express';
import { templateEngine } from '../services/template-engine.js';

const router = Router();

/** 模板列表 */
router.get('/', (_req, res) => {
  try {
    const templates = templateEngine.getTemplates();
    res.json(templates);
  } catch (e) {
    res.status(500).json({ error: '获取模板列表失败', detail: String(e) });
  }
});

/** 模板详情 */
router.get('/:id', (req, res) => {
  try {
    const template = templateEngine.getTemplate(req.params.id);
    if (!template) {
      res.status(404).json({ error: '模板不存在' });
      return;
    }
    res.json(template);
  } catch (e) {
    res.status(500).json({ error: '获取模板详情失败', detail: String(e) });
  }
});

/** 应用模板 */
router.post('/apply', (req, res) => {
  const { id } = req.body;
  if (!id || typeof id !== 'string') {
    res.status(400).json({ error: '缺少 id 参数' });
    return;
  }
  try {
    const result = templateEngine.applyTemplate(id.trim());
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: '应用模板失败', detail: String(e) });
  }
});

export default router;
