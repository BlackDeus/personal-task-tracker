import { apiRequest } from './client';
import type { ApiTask, CreateTaskPayload, UpdateTaskPayload } from '../types/api';

export const tasksApi = {
  getAll() {
    return apiRequest<{ tasks: ApiTask[] }>('/api/tasks');
  },

  create(payload: CreateTaskPayload) {
    return apiRequest<{ task: ApiTask }>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(id: string, payload: UpdateTaskPayload) {
    return apiRequest<{ task: ApiTask }>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  delete(id: string) {
    return apiRequest<{ message: string }>(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};
