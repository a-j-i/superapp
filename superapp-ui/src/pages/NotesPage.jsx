import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function NotesPage() {
  const { categoryId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes', categoryId],
    queryFn: async () => {
      const all = await api.notes.list();
      return all.filter(n => n.category_id === Number(categoryId));
    },
  });

  const createMutation = useMutation({
    mutationFn: api.notes.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['notes', categoryId]);
      setTitle(''); setContent(''); setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.notes.delete,
    onSuccess: () => queryClient.invalidateQueries(['notes', categoryId]),
  });

  const handleCreate = () => {
    if (!content.trim()) return;
    createMutation.mutate({ category_id: Number(categoryId), title: title.trim() || null, content: content.trim() });
  };

  if (isLoading) return <div className="flex-1 flex items-center justify-center text-gray-400">Loading...</div>;

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-indigo-600 text-white px-4 py-5">
        <button onClick={() => navigate('/')} className="text-indigo-200 text-sm mb-1">← Back</button>
        <h1 className="text-xl font-bold">{state?.name ?? 'Notes'}</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        {showForm ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title (optional)"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Note content..."
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <div className="flex gap-2">
              <button onClick={handleCreate} disabled={createMutation.isPending} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50">Save</button>
              <button onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowForm(true)} className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-medium mb-4">
            + New Note
          </button>
        )}

        {notes.length === 0 && !showForm && (
          <p className="text-gray-400 text-center mt-12">No notes yet. Add one above.</p>
        )}

        <ul className="space-y-3">
          {notes.map(note => (
            <li key={note.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              {note.title && <p className="font-semibold text-gray-800 mb-1">{note.title}</p>}
              <p className="text-gray-600 text-sm">{note.content}</p>
              <button onClick={() => deleteMutation.mutate(note.id)} className="text-red-400 text-xs mt-2">Delete</button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
