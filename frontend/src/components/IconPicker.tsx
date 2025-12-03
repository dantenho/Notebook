/**
 * ═══════════════════════════════════════════════════════════════
 * COMPONENTE: IconPicker (Seletor de Ícones)
 * ═══════════════════════════════════════════════════════════════
 *
 * Seletor visual de ícones/emojis para customização.
 * Permite buscar e selecionar ícones por categoria.
 *
 * Props:
 * - value: string - Ícone atual selecionado
 * - onChange: (icon: string) => void - Callback ao selecionar
 * - label?: string - Label opcional
 *
 * @module IconPicker
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

interface IconCategory {
  id: string;
  name: string;
  icons: string[];
  count: number;
}

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  label?: string;
}

export default function IconPicker({ value, onChange, label }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<IconCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('education');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadIcons();
  }, []);

  const loadIcons = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/icons`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Erro ao carregar ícones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectIcon = (icon: string) => {
    onChange(icon);
    setIsOpen(false);
  };

  const currentCategory = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Botão para abrir seletor */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <span className="text-2xl">{value}</span>
        <span className="text-sm text-gray-600">Clique para alterar</span>
      </button>

      {/* Modal de seleção */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Escolher Ícone
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Categorias */}
            <div className="px-6 py-4 border-b border-gray-200 overflow-x-auto">
              <div className="flex gap-2">
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

            {/* Grid de ícones */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-400">Carregando ícones...</div>
                </div>
              ) : currentCategory ? (
                <div className="grid grid-cols-8 gap-2">
                  {currentCategory.icons.map((icon, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectIcon(icon)}
                      className={`w-12 h-12 flex items-center justify-center text-2xl rounded-lg border-2 transition-all hover:scale-110 ${
                        value === icon
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      title={icon}
                    >
                      {icon}
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
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Ícone atual: <span className="text-2xl ml-2">{value}</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
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
