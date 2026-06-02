import type { ApiTask } from '../types/api';
import type { Task } from '../types/task';

export function mapApiTaskToTask(apiTask: ApiTask): Task {
  return {
    id: String(apiTask.id),
    title: apiTask.title,
    description: apiTask.description ?? '',
    completed: apiTask.status === 'completed',
    priority: apiTask.priority,
    category: apiTask.category,
    deadline: apiTask.deadline,
    createdAt: apiTask.createdAt,
    updatedAt: apiTask.updatedAt,
  };
}

export function mapTaskToCreatePayload(task: Task) {
  return {
    title: task.title,
    description: task.description,
    priority: task.priority,
    category: task.category,
    deadline: task.deadline,
    status: task.completed ? ('completed' as const) : ('active' as const),
  };
}
