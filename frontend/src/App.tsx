import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import RequireAuth  from '@/components/shared/RequireAuth'
import RequireAdmin from '@/components/shared/RequireAdmin'

import Home             from '@/pages/Home'
import Catalogue        from '@/pages/Catalogue'
import DesignDetail     from '@/pages/DesignDetail'
import Measurements     from '@/pages/Measurements'
import Checkout         from '@/pages/Checkout'
import OrderTracking    from '@/pages/OrderTracking'
import OrderConfirmation from '@/pages/OrderConfirmation'
import Register         from '@/pages/Register'
import Login            from '@/pages/Login'
import AdminLogin       from '@/pages/admin/AdminLogin'
import AdminDashboard   from '@/pages/admin/AdminDashboard'

// Client-facing layout — includes Navbar + Footer
function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Admin routes — no Navbar/Footer ────────────────────────────── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<RequireAdmin />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* ── Client routes — wrapped in MainLayout ──────────────────────── */}
        <Route element={<MainLayout />}>
          {/* Public */}
          <Route path="/"         element={<Home />} />
          <Route path="/track"    element={<OrderTracking />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login"    element={<Login />} />

          {/* Protected — redirect to /login if no JWT */}
          <Route element={<RequireAuth />}>
            <Route path="/catalogue"          element={<Catalogue />} />
            <Route path="/catalogue/:id"      element={<DesignDetail />} />
            <Route path="/measurements"       element={<Measurements />} />
            <Route path="/checkout"           element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
