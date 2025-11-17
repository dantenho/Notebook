import { Router } from 'express';
import { NoteModel } from '../models/Note';

const router = Router();

router.get('/', (req, res) => {
  try {
    const { notebook_id } = req.query;
    const notes = notebook_id
      ? NoteModel.getByNotebookId(Number(notebook_id))
      : NoteModel.getAll();
    res.json(notes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const note = NoteModel.getById(Number(req.params.id));
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const note = NoteModel.create(req.body);
    res.status(201).json(note);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const note = NoteModel.update(Number(req.params.id), req.body);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const deleted = NoteModel.delete(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
