import { useState } from 'react';
import './index.css';
import { Sidebar } from './components/Sidebar';
import { UsersPage } from './pages/UsersPage';
import { InventoryPage } from './pages/InventoryPage';

type Page = 'users' | 'inventory';

export default function App() {
  const [page, setPage] = useState<Page>('inventory');

  return (
    <div className="app-shell">
      <Sidebar page={page} onNavigate={setPage} />
      <div className="main-content">
        {page === 'users' && <UsersPage />}
        {page === 'inventory' && <InventoryPage />}
      </div>
    </div>
  );
}
