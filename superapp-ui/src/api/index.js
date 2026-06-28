const BASE = 'http://127.0.0.1:8000';

const req = (path, opts = {}) =>
  fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  }).then(r => r.json());

export const api = {
  categories: {
    list: () => req('/categories'),
    create: (name) => req('/categories', { method: 'POST', body: { name } }),
    delete: (id) => req(`/categories/${id}`, { method: 'DELETE' }),
  },
  notes: {
    list: () => req('/notes'),
    create: (note) => req('/notes', { method: 'POST', body: note }),
    update: (id, note) => req(`/notes/${id}`, { method: 'PUT', body: note }),
    delete: (id) => req(`/notes/${id}`, { method: 'DELETE' }),
  },
};
