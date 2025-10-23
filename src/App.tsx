import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Login from './components/Auth/Login';
import Sidebar from './components/Layout/Sidebar';
import ProductList from './components/Products/ProductList';
import StockManagement from './components/Stock/StockManagement';
import SalesView from './components/Sales/SalesView';
import RecordsView from './components/Records/RecordsView';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState('products');
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
    setActiveView('products');
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

      {activeView === 'sales' && <SalesView />}
      {activeView === 'products' && <ProductList />}
      {activeView === 'stock' && <StockManagement />}
      {activeView === 'records' && <RecordsView />}
    </div>
  );
}

export default App;