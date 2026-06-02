import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from '../controllers/tasks.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
