import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import ForgotPasswordPage from './pages/ForgotPassword'
import ResetPasswordPage from './pages/ResetPassword'
import { ThemeProvider } from './components/ui/theme-provider'
import UsersListPage from './pages/UsersList'
import ProductsListPage from './pages/ProductsList'
import ProductOutputsListPage from './pages/ProductOutputsList'
import SuppliersListPage from './pages/SupplierList'
import PigsListPage from './pages/PigsList'
import SowBasicDataPage from './pages/SowBasicData'
import SowReproductiveHistoryPage from './pages/SowReproductiveHistory'
import SowPigletsPage from './pages/SowPiglets'
import SowRegistrationPage from './pages/SowRegistration'
import BoarRegistrationPage from './pages/BoarRegistration'
import ReproductiveListPage from './pages/ReproductiveList'
import CriticalPeriodsPage from './pages/CriticalPeriodsPage'
import ReproductiveParametersPage from './pages/ReproductiveParametersPage'
import Dashboard from './pages/Dashboard'
import MyAccountPage from './pages/MyAccount'
import { Toaster } from './components/ui/toaster'
import { ProtectedRoute } from './components/ui/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          
          {/* Rutas protegidas dentro del layout principal */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UsersListPage />} />
            <Route path="/products" element={<ProductsListPage />} />
            <Route path="/product-outputs" element={<ProductOutputsListPage />} />
            <Route path="/suppliers" element={<SuppliersListPage/>} />
            <Route path="/sows" element={<Navigate to="/sows/list" replace />} />
            <Route path="/sows/register" element={<SowRegistrationPage />} />
            <Route path="/sows/list" element={<ReproductiveListPage />} />
            <Route path="/sows/basic-data" element={<SowBasicDataPage />} />
            <Route path="/sows/reproductive-history" element={<SowReproductiveHistoryPage />} />
            <Route path="/sows/piglets" element={<SowPigletsPage />} />
            <Route path="/boars/register" element={<BoarRegistrationPage />} />
            <Route path="/critical-periods" element={<CriticalPeriodsPage />} />
            <Route path="/reproductive-parameters" element={<ReproductiveParametersPage />} />
            <Route path="/pigs" element={<PigsListPage />} />
            <Route path="/profile" element={<MyAccountPage />} />
            <Route path="/employees" element={<div>Gestión de Empleados</div>} />
            <Route path="/inventory" element={<div>Gestión de Inventario</div>} />
        
          </Route>
          
          {/* Redirigir cualquier ruta desconocida a dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App