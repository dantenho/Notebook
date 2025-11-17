import { Router } from 'express';
import { SpaceModel } from '../models/Space';

const router = Router();

router.get('/', (req, res) => {
  try {
    const spaces = SpaceModel.getAll();
    res.json(spaces);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const space = SpaceModel.getById(Number(req.params.id));
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }
    res.json(space);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const space = SpaceModel.create(req.body);
    res.status(201).json(space);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const space = SpaceModel.update(Number(req.params.id), req.body);
    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }
    res.json(space);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const deleted = SpaceModel.delete(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: 'Space not found' });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
