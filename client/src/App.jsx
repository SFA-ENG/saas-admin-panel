import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import LiveMatch from "./pages/LiveMatch";
import Tournaments from "./pages/Tournaments";
import Academy from "./pages/Academy";
import SFANext from "./pages/SFANext";
import SportsCamps from "./pages/SportsCamps";
import UserDashboard from "./pages/UserDashboard";
import UsersManagement from "./pages/UsersManagement";
import RolesManagement from "./pages/RolesManagement";
import ModulesList from "./pages/modules/ModulesList";
import TiersList from "./pages/modules/TiersList";
import SubModulesList from "./pages/modules/SubModulesList";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import AuthPage from "./pages/auth-page";
import Profile from "./components/profile/Profile";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth-debug" element={<AuthPage />} /> {/* Add debug route */}
        
        {/* Protected Routes - MainLayout handles authentication and authorization */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/matches/:id" element={<LiveMatch />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/sfa-next" element={<SFANext />} />
          <Route path="/sports-camps" element={<SportsCamps />} />
          
          {/* Modules Routes */}
          <Route path="/modules" element={<ModulesList />} />
          <Route path="/modules/:moduleId" element={<TiersList />} />
          <Route path="/modules/:moduleId/tiers/:tierId" element={<SubModulesList />} />
          
          {/* User Management Routes */}
          <Route path="/user-management" element={<UserDashboard />} />
          <Route path="/user-management/users" element={<UsersManagement />} />
          <Route path="/user-management/roles" element={<RolesManagement />} />
          
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
