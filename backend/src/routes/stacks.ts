import { Router } from 'express';
import { StackModel } from '../models/Stack';

const router = Router();

router.get('/', (req, res) => {
  try {
    const { space_id } = req.query;
    const stacks = space_id
      ? StackModel.getBySpaceId(Number(space_id))
      : StackModel.getAll();
    res.json(stacks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const stack = StackModel.getById(Number(req.params.id));
    if (!stack) {
      return res.status(404).json({ error: 'Stack not found' });
    }
    res.json(stack);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const stack = StackModel.create(req.body);
    res.status(201).json(stack);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const stack = StackModel.update(Number(req.params.id), req.body);
    if (!stack) {
      return res.status(404).json({ error: 'Stack not found' });
    }
    res.json(stack);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const deleted = StackModel.delete(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: 'Stack not found' });
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
