import { Router } from 'express';
import { AIService } from '../services/aiService';
import { LlamaService } from '../services/llamaService';

const router = Router();

router.post('/generate', async (req, res) => {
  try {
    const { provider, model, apiKey, prompt, context, thinking } = req.body;

    if (!provider || !prompt) {
      return res.status(400).json({ error: 'Provider and prompt are required' });
    }

    let response;

    if (provider.toLowerCase() === 'llama.cpp') {
      response = await LlamaService.generateCompletion({
        prompt,
        context,
        temperature: 0.7
      });
    } else {
      if (!apiKey) {
        return res.status(400).json({ error: 'API key is required for cloud providers' });
      }

      response = await AIService.generateCompletion({
        provider,
        model,
        apiKey,
        prompt,
        context,
        thinking
      });
    }

    res.json(response);
  } catch (error: any) {
    console.error('AI generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate AI response' });
  }
});

router.get('/llama/health', async (req, res) => {
  try {
    const isHealthy = await LlamaService.checkHealth();
    res.json({ healthy: isHealthy });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
