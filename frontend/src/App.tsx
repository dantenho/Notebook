import Sidebar from './components/Sidebar';
import NotePage from './pages/NotePage';

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />
      <NotePage />
    </div>
  );
}
