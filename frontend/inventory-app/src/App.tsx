import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import { Sidebar } from './components/Sidebar';
import { UsersPage } from './pages/UsersPage';
import { InventoryPage } from './pages/InventoryPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="app-shell">
          <Sidebar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/inventory" replace />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/users" element={<UsersPage />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
