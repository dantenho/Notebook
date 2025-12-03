/**
 * ═══════════════════════════════════════════════════════════════
 * ROTAS: Icons (Biblioteca de Ícones)
 * ═══════════════════════════════════════════════════════════════
 *
 * Fornece biblioteca de ícones/emojis para customização.
 *
 * Rotas:
 * - GET /api/icons          → Lista todos os ícones
 * - GET /api/icons/avatars  → Lista avatares disponíveis
 *
 * @module icons-routes
 */

import { Router } from 'express';

const router = Router();

/**
 * Biblioteca de ícones organizados por categoria
 */
const ICONS_LIBRARY = {
  education: {
    name: 'Educação',
    icons: [
      '📚', '📖', '📕', '📗', '📘', '📙', '📓', '📔', '📒',
      '📝', '✏️', '✒️', '🖊️', '🖋️', '📄', '📃', '📑',
      '🎓', '🎒', '🏫', '🎯', '💡', '🧠', '🔬', '🔭',
      '📊', '📈', '📉', '🗂️', '📂', '📁'
    ]
  },
  medical: {
    name: 'Medicina',
    icons: [
      '⚕️', '🏥', '💊', '💉', '🩺', '🩹', '🧬', '🧪',
      '🔬', '🫀', '🫁', '🧠', '🦷', '🦴', '👨‍⚕️', '👩‍⚕️',
      '🚑', '🏥', '⚕️', '🔬', '🧬', '💊', '💉'
    ]
  },
  science: {
    name: 'Ciência',
    icons: [
      '🔬', '🧪', '⚗️', '🧬', '🔭', '🌡️', '🧲', '⚛️',
      '🌌', '🪐', '🌍', '🌎', '🌏', '🔥', '💧', '⚡',
      '🌊', '🏔️', '🌋', '🪨', '💎', '🧊'
    ]
  },
  tech: {
    name: 'Tecnologia',
    icons: [
      '💻', '🖥️', '⌨️', '🖱️', '🖨️', '💾', '💿', '📀',
      '🔌', '🔋', '💡', '🔦', '📱', '☎️', '📞', '📟',
      '🎮', '🕹️', '🖲️', '🎛️', '🎚️', '📡', '🛰️', '📶',
      '🌐', '💾', '🔐', '🔒', '🔓', '🔑', '🗝️'
    ]
  },
  nature: {
    name: 'Natureza',
    icons: [
      '🌱', '🌿', '🍀', '🌾', '🌳', '🌲', '🌴', '🌵',
      '🌷', '🌸', '🌺', '🌻', '🌼', '🌹', '🥀', '💐',
      '🌾', '🍁', '🍂', '🍃', '🍄', '🌰', '🌾', '🦋',
      '🐝', '🐛', '🐌', '🪲', '🦗', '🕷️'
    ]
  },
  symbols: {
    name: 'Símbolos',
    icons: [
      '⭐', '🌟', '✨', '💫', '⚡', '🔥', '💥', '💢',
      '✔️', '✅', '❌', '❎', '⚠️', '🔰', '♻️', '🔱',
      '🎯', '🏁', '🚩', '📍', '📌', '⚓', '⭕', '❗',
      '❓', '💯', '🔺', '🔻', '🔶', '🔷', '🔸', '🔹'
    ]
  },
  colors: {
    name: 'Cores',
    icons: [
      '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫',
      '⚪', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫'
    ]
  },
  arrows: {
    name: 'Setas',
    icons: [
      '⬆️', '↗️', '➡️', '↘️', '⬇️', '↙️', '⬅️', '↖️',
      '↕️', '↔️', '↩️', '↪️', '⤴️', '⤵️', '🔃', '🔄',
      '🔼', '🔽', '◀️', '▶️', '⏸️', '⏹️', '⏺️'
    ]
  },
  flags: {
    name: 'Bandeiras',
    icons: [
      '🏴', '🏳️', '🏁', '🚩', '🏴‍☠️', '🏳️‍🌈', '🇧🇷'
    ]
  },
  numbers: {
    name: 'Números',
    icons: [
      '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣',
      '8️⃣', '9️⃣', '🔟', '#️⃣', '*️⃣', '⏏️', '⏯️', '⏮️',
      '⏭️', '⏪', '⏩'
    ]
  }
};

/**
 * Biblioteca de avatares
 */
const AVATARS_LIBRARY = {
  people: {
    name: 'Pessoas',
    icons: [
      '👤', '👥', '👨', '👩', '👨‍🎓', '👩‍🎓', '👨‍⚕️', '👩‍⚕️',
      '👨‍🏫', '👩‍🏫', '👨‍💻', '👩‍💻', '👨‍🔬', '👩‍🔬', '🧑‍🎓', '🧑‍⚕️'
    ]
  },
  faces: {
    name: 'Rostos',
    icons: [
      '😀', '😃', '😄', '😁', '😊', '😇', '🙂', '🤓',
      '🧐', '🤔', '🤗', '🤩', '😎', '🤠', '🥳', '😴',
      '🤯', '🧠', '👾', '🤖', '👽', '🎃', '😺'
    ]
  },
  animals: {
    name: 'Animais',
    icons: [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
      '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
      '🐧', '🐦', '🦅', '🦆', '🦉', '🦇', '🐺', '🐗',
      '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐢',
      '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦞', '🦀',
      '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊'
    ]
  },
  fantasy: {
    name: 'Fantasia',
    icons: [
      '👾', '🤖', '👽', '👻', '💀', '☠️', '👹', '👺',
      '🎃', '😈', '👿', '🦄', '🐉', '🦖', '🦕'
    ]
  }
};

/**
 * GET /api/icons
 * Retorna biblioteca completa de ícones
 */
router.get('/', (req, res) => {
  res.json({
    categories: Object.keys(ICONS_LIBRARY).map(key => ({
      id: key,
      name: ICONS_LIBRARY[key as keyof typeof ICONS_LIBRARY].name,
      icons: ICONS_LIBRARY[key as keyof typeof ICONS_LIBRARY].icons,
      count: ICONS_LIBRARY[key as keyof typeof ICONS_LIBRARY].icons.length
    })),
    total: Object.values(ICONS_LIBRARY).reduce((sum, cat) => sum + cat.icons.length, 0)
  });
});

/**
 * GET /api/icons/avatars
 * Retorna biblioteca de avatares
 */
router.get('/avatars', (req, res) => {
  res.json({
    categories: Object.keys(AVATARS_LIBRARY).map(key => ({
      id: key,
      name: AVATARS_LIBRARY[key as keyof typeof AVATARS_LIBRARY].name,
      icons: AVATARS_LIBRARY[key as keyof typeof AVATARS_LIBRARY].icons,
      count: AVATARS_LIBRARY[key as keyof typeof AVATARS_LIBRARY].icons.length
    })),
    total: Object.values(AVATARS_LIBRARY).reduce((sum, cat) => sum + cat.icons.length, 0)
  });
});

/**
 * GET /api/icons/search
 * Busca ícones por categoria
 */
router.get('/search', (req, res) => {
  const { category } = req.query;

  if (!category) {
    return res.status(400).json({ error: 'Categoria é obrigatória' });
  }

  const categoryData = ICONS_LIBRARY[category as keyof typeof ICONS_LIBRARY];

  if (!categoryData) {
    return res.status(404).json({ error: 'Categoria não encontrada' });
  }

  res.json({
    category,
    name: categoryData.name,
    icons: categoryData.icons,
    count: categoryData.icons.length
  });
});

export default router;
