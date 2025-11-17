import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { SourceModel } from '../models/Source';
import { PDFService } from '../services/pdfService';
import { WebService } from '../services/webService';
import { PubMedService } from '../services/pubmedService';
import { SciELOService } from '../services/scieloService';

const router = Router();

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error: any) {
      cb(error, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos PDF são permitidos'));
    }
  },
});

// Get all sources for a note
router.get('/note/:noteId', async (req, res) => {
  try {
    const sources = SourceModel.getByNoteId(Number(req.params.noteId));
    res.json(sources);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific source
router.get('/:id', async (req, res) => {
  try {
    const source = SourceModel.getById(Number(req.params.id));
    if (!source) {
      return res.status(404).json({ error: 'Fonte não encontrada' });
    }
    res.json(source);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Upload PDF
router.post('/pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const { noteId } = req.body;
    if (!noteId) {
      return res.status(400).json({ error: 'note_id é obrigatório' });
    }

    // Extract PDF content
    const extraction = await PDFService.extractFromFile(req.file.path);

    // Save to database
    const source = SourceModel.create({
      note_id: Number(noteId),
      type: 'pdf',
      title: extraction.title,
      file_path: req.file.path,
      content: extraction.content,
      metadata: JSON.stringify(extraction.metadata),
    });

    res.status(201).json(source);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Extract from web URL
router.post('/web', async (req, res) => {
  try {
    const { noteId, url } = req.body;

    if (!noteId || !url) {
      return res.status(400).json({ error: 'noteId e url são obrigatórios' });
    }

    // Extract web content
    const extraction = await WebService.extractFromURL(url);

    // Save to database
    const source = SourceModel.create({
      note_id: Number(noteId),
      type: 'web',
      title: extraction.title,
      url,
      content: extraction.content,
      metadata: JSON.stringify(extraction.metadata),
    });

    res.status(201).json(source);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Search PubMed
router.get('/pubmed/search', async (req, res) => {
  try {
    const { q, max } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Parâmetro q (query) é obrigatório' });
    }

    const maxResults = max ? parseInt(max as string) : 20;
    const results = await PubMedService.search(q as string, maxResults);

    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch PubMed article
router.post('/pubmed', async (req, res) => {
  try {
    const { noteId, pmid } = req.body;

    if (!noteId || !pmid) {
      return res.status(400).json({ error: 'noteId e pmid são obrigatórios' });
    }

    // Fetch article
    const article = await PubMedService.fetchArticle(pmid);

    // Save to database
    const source = SourceModel.create({
      note_id: Number(noteId),
      type: 'pubmed',
      title: article.title,
      url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
      content: article.content,
      metadata: JSON.stringify(article.metadata),
    });

    res.status(201).json(source);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Search SciELO
router.get('/scielo/search', async (req, res) => {
  try {
    const { q, max } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Parâmetro q (query) é obrigatório' });
    }

    const maxResults = max ? parseInt(max as string) : 20;
    const results = await SciELOService.search(q as string, maxResults);

    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch SciELO article
router.post('/scielo', async (req, res) => {
  try {
    const { noteId, url } = req.body;

    if (!noteId || !url) {
      return res.status(400).json({ error: 'noteId e url são obrigatórios' });
    }

    // Fetch article
    const article = await SciELOService.fetchArticle(url);

    // Save to database
    const source = SourceModel.create({
      note_id: Number(noteId),
      type: 'scielo',
      title: article.title,
      url,
      content: article.content,
      metadata: JSON.stringify(article.metadata),
    });

    res.status(201).json(source);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete source
router.delete('/:id', async (req, res) => {
  try {
    const source = SourceModel.getById(Number(req.params.id));

    if (!source) {
      return res.status(404).json({ error: 'Fonte não encontrada' });
    }

    // Delete file if it's a PDF
    if (source.type === 'pdf' && source.file_path) {
      try {
        await fs.unlink(source.file_path);
      } catch (error) {
        // Ignore file deletion errors
        console.error('Erro ao deletar arquivo:', error);
      }
    }

    const deleted = SourceModel.delete(Number(req.params.id));

    if (!deleted) {
      return res.status(404).json({ error: 'Fonte não encontrada' });
    }

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
