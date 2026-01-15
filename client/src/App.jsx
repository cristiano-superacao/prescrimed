import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Pacientes from './pages/Pacientes';
import Prescricoes from './pages/Prescricoes';
import CensoMP from './pages/CensoMP';
import Usuarios from './pages/Usuarios';
import Empresas from './pages/Empresas';
import Configuracoes from './pages/Configuracoes';
import Agenda from './pages/Agenda';
import Cronograma from './pages/Cronograma';
import Estoque from './pages/Estoque';
import Evolucao from './pages/Evolucao';
import Financeiro from './pages/Financeiro';
import Manual from './pages/Manual';

// Layout
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import BackendStatusMonitor from './components/BackendStatusMonitor';

function App() {
  return (
    <>
      <BackendStatusMonitor />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            <Route
              path="agenda"
              element={
                <ProtectedRoute>
                  <Agenda />
                </ProtectedRoute>
              }
            />

            <Route
              path="cronograma"
              element={
                <ProtectedRoute>
                  <Cronograma />
                </ProtectedRoute>
              }
            />

            <Route
              path="censo-mp"
              element={
                <ProtectedRoute requiredPermission="prescricoes">
                  <CensoMP />
                </ProtectedRoute>
              }
            />

            <Route
              path="prescricoes"
              element={
                <ProtectedRoute requiredPermission="prescricoes">
                  <Prescricoes />
                </ProtectedRoute>
              }
            />

            <Route
              path="estoque"
              element={
                <ProtectedRoute>
                  <Estoque />
                </ProtectedRoute>
              }
            />

            <Route
              path="evolucao"
              element={
                <ProtectedRoute>
                  <Evolucao />
                </ProtectedRoute>
              }
            />

            <Route
              path="financeiro"
              element={
                <ProtectedRoute>
                  <Financeiro />
                </ProtectedRoute>
              }
            />

            <Route
              path="residentes"
              element={
                <ProtectedRoute requiredPermission="pacientes">
                  <Pacientes />
                </ProtectedRoute>
              }
            />
            
            {/* Rotas legadas/redirecionamentos para manter compatibilidade se necessário */}
            <Route path="pacientes" element={<Navigate to="/residentes" replace />} />
            
            <Route
              path="usuarios"
              element={
                <ProtectedRoute requiredPermission="usuarios">
                  <Usuarios />
                </ProtectedRoute>
              }
            />

            <Route
              path="empresas"
              element={
                <ProtectedRoute>
                  <Empresas />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="configuracoes"
              element={
                <ProtectedRoute requiredPermission="configuracoes">
                  <Configuracoes />
                </ProtectedRoute>
              }
            />

            <Route
              path="manual"
              element={
                <ProtectedRoute>
                  <Manual />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </>
  );
}

export default App;