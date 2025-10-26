import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { SettingsProvider } from './contexts/SettingsContext';
import Login from './components/Auth/Login';
import Sidebar from './components/Layout/Sidebar';
import SettingsButton from './components/Settings/SettingsButton';
import ProductList from './components/Products/ProductList';
import StockManagement from './components/Stock/StockManagement';
import SalesView from './components/Sales/SalesView';
import RecordsView from './components/Records/RecordsView';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState('sales');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    setLoading(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveView('sales');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={handleLogout}
      />

      <SettingsButton />

      {activeView === 'sales' && <SalesView />}
      {activeView === 'stock' && <StockManagement />}
      {activeView === 'products' && <ProductList />}
      {activeView === 'records' && <RecordsView />}
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

export default App;