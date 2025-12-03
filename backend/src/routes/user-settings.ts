/**
 * ═══════════════════════════════════════════════════════════════
 * ROTAS: UserSettings (Configurações de Usuário)
 * ═══════════════════════════════════════════════════════════════
 *
 * Endpoints para gerenciar configurações e customizações de UI.
 *
 * Rotas:
 * - GET    /api/user-settings       → Buscar configurações
 * - PUT    /api/user-settings       → Atualizar configurações
 * - POST   /api/user-settings/reset → Resetar para padrões
 *
 * @module user-settings-routes
 */

import { Router } from 'express';
import { UserSettingsModel } from '../models/UserSettings';

const router = Router();

/**
 * GET /api/user-settings
 * Busca as configurações do usuário
 */
router.get('/', (req, res) => {
  try {
    const settings = UserSettingsModel.get();

    if (!settings) {
      return res.status(404).json({ error: 'Configurações não encontradas' });
    }

    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/user-settings
 * Atualiza as configurações do usuário
 */
router.put('/', (req, res) => {
  try {
    const settings = UserSettingsModel.update(req.body);

    if (!settings) {
      return res.status(500).json({ error: 'Erro ao atualizar configurações' });
    }

    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/user-settings/reset
 * Reseta configurações para valores padrão
 */
router.post('/reset', (req, res) => {
  try {
    const settings = UserSettingsModel.reset();

    if (!settings) {
      return res.status(500).json({ error: 'Erro ao resetar configurações' });
    }

    res.json({
      message: 'Configurações resetadas com sucesso',
      settings
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
