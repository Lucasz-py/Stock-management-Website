import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { SettingsProvider } from './contexts/SettingsContext';
import Login from './components/Auth/Login';
import Sidebar from './components/Layout/Sidebar';
// ELIMINAMOS: import SettingsButton from './components/Settings/SettingsButton'; 
import SettingsPanel from './components/Settings/SettingsButton'; // RENOMBRADO
import ProductList from './components/Products/ProductList';
import StockManagement from './components/Stock/StockManagement';
import SalesView from './components/Sales/SalesView';
import RecordsView from './components/Records/RecordsView';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState('sales');
  const [loading, setLoading] = useState(true);
  
  // NUEVO ESTADO: Para controlar la visibilidad del panel de configuración
  const [showSettingsMenu, setShowSettingsMenu] = useState(false); 

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

      {/* AÑADIMOS el panel de configuración globalmente */}
      <SettingsPanel showMenu={showSettingsMenu} setShowMenu={setShowSettingsMenu} />

      {/* Eliminamos 'title' de la prop si existía, ya que MainLayout ya no la usa. */}
      {activeView === 'sales' && <SalesView setShowSettingsMenu={setShowSettingsMenu} />} 
      {activeView === 'stock' && <StockManagement setShowSettingsMenu={setShowSettingsMenu} />}
      {activeView === 'products' && <ProductList setShowSettingsMenu={setShowSettingsMenu} />}
      {activeView === 'records' && <RecordsView setShowSettingsMenu={setShowSettingsMenu} />}
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