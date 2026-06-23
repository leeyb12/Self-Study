import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { PrivateRoute, AdminRoute } from './components/PrivateRoute';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderListPage from './pages/OrderListPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />

          <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><OrderListPage /></PrivateRoute>} />
          <Route path="/orders/:id" element={<PrivateRoute><OrderDetailPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

          <Route path="/admin/analytics" element={<AdminRoute><AnalyticsDashboard /></AdminRoute>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
