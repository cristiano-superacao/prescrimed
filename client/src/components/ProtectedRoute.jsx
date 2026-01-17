/**
 * Componente ProtectedRoute
 * 
 * Componente de proteção de rotas (Route Guard).
 * Verifica se o usuário está autenticado e tem as permissões necessárias
 * antes de permitir o acesso a uma rota específica.
 * 
 * Fluxo de validação:
 * 1. Verifica autenticação - se não autenticado, redireciona para /login
 * 2. Verifica permissão (se requerida) - se sem permissão, redireciona para /dashboard
 * 3. Se passou nas verificações, renderiza o componente filho
 * 
 * @param {ReactNode} children - Componente filho a ser renderizado se autorizado
 * @param {string} requiredPermission - Permissão necessária para acessar a rota (opcional)
 */

// Importa Navigate do React Router para redirecionamentos
import { Navigate } from 'react-router-dom';

// Importa store de autenticação (Zustand) que gerencia estado do usuário
import { useAuthStore } from '../store/authStore';

/**
 * Componente que protege rotas verificando autenticação e permissões
 */
const ProtectedRoute = ({ children, requiredPermission }) => {
  // Obtém funções e estado do store de autenticação
  const { isAuthenticated, hasPermission } = useAuthStore();

  // Primeira verificação: usuário está autenticado?
  // Se não estiver logado, redireciona para página de login
  if (!isAuthenticated) {
    // replace: substitui entrada no histórico (não permite voltar com botão "voltar")
    return <Navigate to="/login" replace />;
  }

  // Segunda verificação: se a rota requer permissão específica, usuário tem essa permissão?
  // Exemplo: rota de usuários requer permissão "usuarios"
  if (requiredPermission && !hasPermission(requiredPermission)) {
    // Se não tem permissão, redireciona para dashboard (página inicial após login)
    return <Navigate to="/dashboard" replace />;
  }

  // Se passou em todas as verificações, renderiza o componente filho
  // (a página protegida que o usuário está tentando acessar)
  return children;
};

// Exporta componente para uso nas rotas do App.jsx
export default ProtectedRoute;
