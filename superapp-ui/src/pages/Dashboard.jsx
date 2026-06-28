import { useNavigate } from 'react-router-dom';

const features = [
  { label: 'Notes', icon: '📝', path: '/notes', available: true },
  { label: 'Payments', icon: '💳', path: '/payments', available: false },
  { label: 'Email', icon: '📧', path: '/email', available: false },
  { label: 'Bujji', icon: '🤖', path: '/bujji', available: false },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white px-4 py-6">
        <h1 className="text-2xl font-bold">SuperApp</h1>
        <p className="text-indigo-200 text-sm mt-1">What do you want to do?</p>
      </header>

      <main className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-4 mt-2">
          {features.map(f => (
            <button
              key={f.label}
              onClick={() => f.available && navigate(f.path)}
              className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center shadow-sm border gap-3
                ${f.available
                  ? 'bg-white border-gray-100 active:scale-95 transition-transform'
                  : 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed'
                }`}
            >
              <span className="text-4xl">{f.icon}</span>
              <span className="text-sm font-semibold text-gray-700">{f.label}</span>
              {!f.available && (
                <span className="absolute top-2 right-2 text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                  Soon
                </span>
              )}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
