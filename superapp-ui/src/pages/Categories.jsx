import { useState, useEffect } from 'react';
import { getCategories, createCategory, deleteCategory } from '../api';

function Categories({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then(data => { setCategories(data); setLoading(false); });
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const created = await createCategory(newName.trim());
    setCategories([...categories, created]);
    setNewName('');
  };

  const handleDelete = async (id) => {
    await deleteCategory(id);
    setCategories(categories.filter(c => c.id !== id));
  };

  if (loading) return <p className="text-center text-gray-500 mt-8">Loading...</p>;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Categories</h2>

      <div className="flex gap-2 mb-6">
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          placeholder="New category..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleCreate}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Add
        </button>
      </div>

      {categories.length === 0 && (
        <p className="text-gray-400 text-center mt-8">No categories yet. Add one above.</p>
      )}

      <ul className="space-y-2">
        {categories.map(cat => (
          <li
            key={cat.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-between px-4 py-3"
          >
            <button
              onClick={() => onSelectCategory(cat)}
              className="text-gray-800 font-medium text-left flex-1"
            >
              {cat.name}
            </button>
            <button
              onClick={() => handleDelete(cat.id)}
              className="text-red-400 text-sm ml-2"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Categories;
