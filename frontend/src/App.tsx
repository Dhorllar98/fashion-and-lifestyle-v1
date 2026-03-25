import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import Home from '@/pages/Home'
import Catalogue from '@/pages/Catalogue'
import DesignDetail from '@/pages/DesignDetail'
import Measurements from '@/pages/Measurements'
import Checkout from '@/pages/Checkout'
import OrderTracking from '@/pages/OrderTracking'
import OrderConfirmation from '@/pages/OrderConfirmation'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/catalogue/:id" element={<DesignDetail />} />
            <Route path="/measurements" element={<Measurements />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/track" element={<OrderTracking />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
