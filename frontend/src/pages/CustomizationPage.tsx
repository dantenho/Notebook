/**
 * ═══════════════════════════════════════════════════════════════
 * PÁGINA: Customização de Interface
 * ═══════════════════════════════════════════════════════════════
 *
 * Permite ao usuário personalizar a interface do aplicativo:
 * - Avatar
 * - Nome de exibição
 * - Tema (claro/escuro/auto)
 * - Cor de destaque
 * - Tamanho de fonte
 * - Modo compacto
 * - Exibir ícones
 *
 * @module CustomizationPage
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AvatarPicker from '../components/AvatarPicker';
import { toast } from 'react-hot-toast';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

interface UserSettings {
  id: number;
  avatar: string;
  display_name: string;
  theme: 'light' | 'dark' | 'auto';
  accent_color: string;
  font_size: 'small' | 'medium' | 'large';
  compact_mode: number;
  show_icons: number;
}

const PRESET_COLORS = [
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Roxo', value: '#8b5cf6' },
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Verde', value: '#10b981' },
  { name: 'Laranja', value: '#f59e0b' },
  { name: 'Vermelho', value: '#ef4444' },
  { name: 'Índigo', value: '#6366f1' },
  { name: 'Ciano', value: '#06b6d4' }
];

export default function CustomizationPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/user-settings`);
      setSettings(response.data);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      await axios.put(`${API_BASE}/user-settings`, settings);
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = async () => {
    if (!confirm('Tem certeza que deseja resetar todas as configurações para os valores padrão?')) {
      return;
    }

    try {
      setSaving(true);
      const response = await axios.post(`${API_BASE}/user-settings/reset`);
      setSettings(response.data.settings);
      toast.success('Configurações resetadas!');
    } catch (error) {
      console.error('Erro ao resetar configurações:', error);
      toast.error('Erro ao resetar configurações');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Erro ao carregar configurações</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Personalização</h1>
          <p className="mt-2 text-gray-600">
            Customize a interface do Study Notebook de acordo com suas preferências
          </p>
        </div>

        {/* Formulário de configurações */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Perfil */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Perfil</h2>

            <div className="space-y-6">
              {/* Avatar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Avatar
                </label>
                <div className="flex items-center gap-6">
                  <AvatarPicker
                    value={settings.avatar}
                    onChange={(avatar) => updateSetting('avatar', avatar)}
                    size="large"
                  />
                  <div>
                    <p className="text-sm text-gray-600">
                      Clique no avatar para alterar
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Escolha um emoji que representa você
                    </p>
                  </div>
                </div>
              </div>

              {/* Nome de exibição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome de Exibição
                </label>
                <input
                  type="text"
                  value={settings.display_name}
                  onChange={(e) => updateSetting('display_name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Seu nome"
                />
              </div>
            </div>
          </div>

          {/* Aparência */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Aparência</h2>

            <div className="space-y-6">
              {/* Tema */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tema
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['light', 'dark', 'auto'].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => updateSetting('theme', theme as any)}
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${
                        settings.theme === theme
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">
                          {theme === 'light' && '☀️'}
                          {theme === 'dark' && '🌙'}
                          {theme === 'auto' && '🌓'}
                        </div>
                        <div className="text-sm font-medium capitalize">
                          {theme === 'light' && 'Claro'}
                          {theme === 'dark' && 'Escuro'}
                          {theme === 'auto' && 'Automático'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cor de destaque */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Cor de Destaque
                </label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => updateSetting('accent_color', color.value)}
                      className={`h-12 rounded-lg border-4 transition-transform hover:scale-105 ${
                        settings.accent_color === color.value
                          ? 'border-gray-800 ring-2 ring-offset-2 ring-gray-400'
                          : 'border-white'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={settings.accent_color}
                  onChange={(e) => updateSetting('accent_color', e.target.value)}
                  className="w-full h-12 rounded-lg cursor-pointer"
                />
              </div>

              {/* Tamanho de fonte */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tamanho de Fonte
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => updateSetting('font_size', size)}
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${
                        settings.font_size === size
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`font-medium ${
                        size === 'small' && 'text-sm'
                      } ${
                        size === 'medium' && 'text-base'
                      } ${
                        size === 'large' && 'text-lg'
                      }`}>
                        {size === 'small' && 'Pequena'}
                        {size === 'medium' && 'Média'}
                        {size === 'large' && 'Grande'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preferências */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Preferências</h2>

            <div className="space-y-4">
              {/* Modo compacto */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Modo Compacto
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Reduz espaçamento e tamanho dos elementos
                  </p>
                </div>
                <button
                  onClick={() => updateSetting('compact_mode', settings.compact_mode ? 0 : 1)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.compact_mode ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.compact_mode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Mostrar ícones */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Mostrar Ícones
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Exibe ícones ao lado dos nomes
                  </p>
                </div>
                <button
                  onClick={() => updateSetting('show_icons', settings.show_icons ? 0 : 1)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.show_icons ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.show_icons ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={resetSettings}
            disabled={saving}
            className="px-6 py-2 text-red-600 hover:text-red-700 font-medium transition-colors disabled:opacity-50"
          >
            Resetar para Padrão
          </button>

          <button
            onClick={saveSettings}
            disabled={saving}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 font-medium shadow-sm"
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>

        {/* Preview */}
        <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Preview</h2>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white border-2 text-2xl" style={{ borderColor: settings.accent_color }}>
                {settings.avatar}
              </div>
            </div>
            <div>
              <div className="font-medium text-gray-900" style={{ color: settings.accent_color }}>
                {settings.display_name}
              </div>
              <div className="text-sm text-gray-500">
                Tema: {settings.theme === 'light' ? 'Claro' : settings.theme === 'dark' ? 'Escuro' : 'Automático'}
                {' • '}
                Fonte: {settings.font_size === 'small' ? 'Pequena' : settings.font_size === 'medium' ? 'Média' : 'Grande'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
