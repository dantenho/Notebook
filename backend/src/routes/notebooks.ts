import { Router } from 'express';
import { NotebookModel } from '../models/Notebook';

const router = Router();

router.get('/', (req, res) => {
  try {
    const { stack_id } = req.query;
    const notebooks = stack_id
      ? NotebookModel.getByStackId(Number(stack_id))
      : NotebookModel.getAll();
    res.json(notebooks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const notebook = NotebookModel.getById(Number(req.params.id));
    if (!notebook) {
      return res.status(404).json({ error: 'Notebook not found' });
    }
    res.json(notebook);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const notebook = NotebookModel.create(req.body);
    res.status(201).json(notebook);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const notebook = NotebookModel.update(Number(req.params.id), req.body);
    if (!notebook) {
      return res.status(404).json({ error: 'Notebook not found' });
    }
    res.json(notebook);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const deleted = NotebookModel.delete(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: 'Notebook not found' });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
