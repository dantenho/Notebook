import { useState } from 'react';
import { Send, Settings, Loader2, Brain } from 'lucide-react';
import { useStore } from '../store';
import { aiApi } from '../services/api';
import type { Source } from '../types';

interface ChatBoxProps {
  onInsertText: (text: string) => void;
  currentContent: string;
  sources?: Source[];
}

export default function ChatBox({ onInsertText, currentContent, sources = [] }: ChatBoxProps) {
  const { aiSettings, setAISettings } = useStore();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [thinkingText, setThinkingText] = useState('');
  const [error, setError] = useState('');

  const providers = [
    { value: 'openai', label: 'OpenAI', models: ['gpt-4-turbo-preview', 'gpt-4', 'gpt-3.5-turbo'] },
    { value: 'anthropic', label: 'Anthropic', models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'] },
    { value: 'google', label: 'Google', models: ['gemini-pro', 'gemini-pro-vision'] },
    { value: 'llama.cpp', label: 'llama.cpp (Local)', models: ['local'] },
  ];

  const currentProvider = providers.find((p) => p.value === aiSettings.provider);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    setThinkingText('');

    try {
      // Build context with sources
      let context = currentContent;

      if (sources.length > 0) {
        let sourcesContext = '\n\n=== FONTES DE REFERÊNCIA ===\n\n';
        sources.forEach((source, index) => {
          sourcesContext += `Fonte ${index + 1}: ${source.title}\n`;
          if (source.content) {
            // Limit source content to avoid token overflow
            const maxLength = 2000;
            const content = source.content.length > maxLength
              ? source.content.substring(0, maxLength) + '...'
              : source.content;
            sourcesContext += `${content}\n\n`;
          }
        });
        context = currentContent + sourcesContext;
      }

      const response = await aiApi.generate(aiSettings, prompt, context);

      if (response.data.thinking) {
        setThinkingText(response.data.thinking);
      }

      onInsertText(response.data.content);
      setPrompt('');
    } catch (err: any) {
      console.error('AI generation error:', err);
      setError(err.response?.data?.error || err.message || 'Erro ao gerar resposta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white">
      {showSettings && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Settings size={16} />
            Configurações de IA
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Provider</label>
              <select
                value={aiSettings.provider}
                onChange={(e) =>
                  setAISettings({
                    ...aiSettings,
                    provider: e.target.value,
                    model: providers.find((p) => p.value === e.target.value)?.models[0] || '',
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {providers.map((provider) => (
                  <option key={provider.value} value={provider.value}>
                    {provider.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Modelo</label>
              <select
                value={aiSettings.model}
                onChange={(e) => setAISettings({ ...aiSettings, model: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {currentProvider?.models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            {aiSettings.provider !== 'llama.cpp' && (
              <div>
                <label className="block text-sm font-medium mb-1">API Key</label>
                <input
                  type="password"
                  value={aiSettings.apiKey || ''}
                  onChange={(e) => setAISettings({ ...aiSettings, apiKey: e.target.value })}
                  placeholder="Cole sua API key aqui"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {aiSettings.provider === 'anthropic' && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="thinking"
                  checked={aiSettings.thinking || false}
                  onChange={(e) => setAISettings({ ...aiSettings, thinking: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="thinking" className="text-sm font-medium">
                  Habilitar Extended Thinking
                </label>
              </div>
            )}
          </div>
        </div>
      )}

      {thinkingText && (
        <div className="p-4 bg-purple-50 border-b border-purple-200">
          <div className="flex items-start gap-2">
            <Brain size={16} className="text-purple-600 mt-1" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-purple-800 mb-1">Raciocínio do Modelo:</h4>
              <p className="text-sm text-purple-900 whitespace-pre-wrap">{thinkingText}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border-b border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="p-4">
        {sources.length > 0 && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm flex items-center gap-2">
            <Brain size={14} />
            <span>
              {sources.length} {sources.length === 1 ? 'fonte' : 'fontes'} de referência {sources.length === 1 ? 'será usada' : 'serão usadas'} pela IA
            </span>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
            title="Configurações"
          >
            <Settings size={18} />
          </button>

          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleGenerate()}
            placeholder={sources.length > 0 ? "A IA usará suas fontes como referência..." : "Digite um prompt para a IA editar/gerar texto..."}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Send size={18} />
                Gerar
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          A IA irá editar o texto atual baseado no seu prompt. Se o texto estiver vazio, irá gerar novo conteúdo.
        </p>
      </div>
    </div>
  );
}
