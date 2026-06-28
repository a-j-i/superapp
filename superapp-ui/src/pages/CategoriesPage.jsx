import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

function AddCategoryModal({ onClose, onAdd }) {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd(name.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-t-2xl p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">New Category</h2>
        <input
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Category name..."
          className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
        />
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl text-sm font-medium">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl text-sm font-medium">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: api.categories.list,
  });

  const createMutation = useMutation({
    mutationFn: api.categories.create,
    onSuccess: () => queryClient.invalidateQueries(['categories']),
  });

  const deleteMutation = useMutation({
    mutationFn: api.categories.delete,
    onSuccess: () => queryClient.invalidateQueries(['categories']),
  });

  if (isLoading) return <div className="flex-1 flex items-center justify-center text-gray-400">Loading...</div>;

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-indigo-600 text-white px-4 py-5">
        <button onClick={() => navigate('/')} className="text-indigo-200 text-sm mb-1">← Home</button>
        <h1 className="text-xl font-bold">Notes</h1>
        <p className="text-indigo-200 text-sm">Your categories</p>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        {categories.length === 0 && (
          <p className="text-gray-400 text-center mt-12">No categories yet. Tap + to add one.</p>
        )}

        <ul className="space-y-2">
          {categories.map(cat => (
            <li key={cat.id} className="bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-between px-4 py-3">
              <button onClick={() => navigate(`/notes/${cat.id}`, { state: { name: cat.name } })} className="text-gray-800 font-medium text-left flex-1">
                {cat.name}
              </button>
              <button onClick={() => deleteMutation.mutate(cat.id)} className="text-red-400 text-sm ml-2">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </main>

      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white w-14 h-14 rounded-full text-2xl shadow-lg flex items-center justify-center"
      >
        +
      </button>

      {showModal && (
        <AddCategoryModal
          onClose={() => setShowModal(false)}
          onAdd={(name) => createMutation.mutate(name)}
        />
      )}
    </div>
  );
}
