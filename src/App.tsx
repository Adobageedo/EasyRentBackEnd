import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Building2, Users, FileText, PenTool as Tool, Home } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Tenants from './pages/Tenants';
import Accounting from './pages/Accounting';
import Maintenance from './pages/Maintenance';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Properties', href: '/properties', icon: Building2 },
  { name: 'Tenants', href: '/tenants', icon: Users },
  { name: 'Accounting', href: '/accounting', icon: FileText },
  { name: 'Maintenance', href: '/maintenance', icon: Tool },
];

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Sidebar navigation={navigation} />
        <div className="lg:pl-72">
          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/tenants" element={<Tenants />} />
                <Route path="/accounting" element={<Accounting />} />
                <Route path="/maintenance" element={<Maintenance />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;