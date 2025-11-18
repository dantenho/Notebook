/**
 * ═══════════════════════════════════════════════════════════════
 * COMPONENTE: AvatarPicker (Seletor de Avatar)
 * ═══════════════════════════════════════════════════════════════
 *
 * Seletor visual de avatares para perfil do usuário.
 *
 * Props:
 * - value: string - Avatar atual selecionado
 * - onChange: (avatar: string) => void - Callback ao selecionar
 * - size?: 'small' | 'medium' | 'large' - Tamanho do avatar
 *
 * @module AvatarPicker
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

interface AvatarCategory {
  id: string;
  name: string;
  icons: string[];
  count: number;
}

interface AvatarPickerProps {
  value: string;
  onChange: (avatar: string) => void;
  size?: 'small' | 'medium' | 'large';
}

const SIZES = {
  small: 'w-12 h-12 text-2xl',
  medium: 'w-16 h-16 text-4xl',
  large: 'w-24 h-24 text-6xl'
};

export default function AvatarPicker({ value, onChange, size = 'medium' }: AvatarPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<AvatarCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('people');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAvatars();
  }, []);

  const loadAvatars = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/icons/avatars`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Erro ao carregar avatares:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAvatar = (avatar: string) => {
    onChange(avatar);
    setIsOpen(false);
  };

  const currentCategory = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="relative">
      {/* Botão com avatar atual */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${SIZES[size]} rounded-full border-4 border-gray-300 hover:border-blue-500 transition-all flex items-center justify-center bg-white shadow-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200`}
        title="Clique para alterar avatar"
      >
        <span>{value}</span>
      </button>

      {/* Modal de seleção */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Escolher Avatar
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Selecione um emoji para seu perfil
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Avatar atual (preview grande) */}
            <div className="px-6 py-6 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg flex items-center justify-center bg-white text-6xl">
                  {value}
                </div>
              </div>
              <p className="text-center text-sm text-gray-600 mt-3">
                Avatar atual
              </p>
            </div>

            {/* Categorias */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex gap-2 overflow-x-auto">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de avatares */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : currentCategory ? (
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
                  {currentCategory.icons.map((avatar, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectAvatar(avatar)}
                      className={`w-14 h-14 flex items-center justify-center text-3xl rounded-full border-4 transition-all hover:scale-110 ${
                        value === avatar
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300 bg-white'
                      }`}
                      title={avatar}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Nenhuma categoria selecionada
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
