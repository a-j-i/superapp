import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CategoriesPage from './pages/CategoriesPage';
import NotesPage from './pages/NotesPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/notes" element={<CategoriesPage />} />
            <Route path="/notes/:categoryId" element={<NotesPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
