// index.tsx
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import IndexView from './view/index.view';
import LoginView from './view/login.view';
import RegisterView from './view/register.view';
import ShopView from './view/shop.view';
import SearchView from './view/search.view';
import AdminPage from './component/adminPage/admin.component';
import InsertFish from './component/adminPage/fishInsert.component';
import InsertItem from './component/adminPage/itemInsert.component';
import CartView from './view/cart.view';
import DetailView from './view/detail.view';
import AuthView from './view/auth.view';
import UserFormView from './view/userform.view';

// Import your styles
import './component/assets/css/bootstrap.min.css';
import './component/assets/css/now-ui-kit.css';
import './component/assets/demo/demo.css';
import './component/assets/demo/nucleo-icons-page-styles.css';

// Main Application Component
const MainApp: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="/shop" element={<ShopView />} />
        <Route path="/cart" element={<CartView />} />
        <Route path="/fish/:_id" element={<DetailView />} />
        <Route path="/item/:_id" element={<DetailView />} />
        <Route path="/search" element={<SearchView />} />
        <Route path="/admin/insertF" element={<InsertFish />} />
        <Route path="/admin/insertI" element={<InsertItem />} />
        {/* Protected Route: Admin Page */}
        <Route
          path="/admin"
          element={isLoggedIn ? <AdminPage /> : <Navigate to="/login" />}
        />
        {/* Dashboard as a protected profile page */}
        <Route
          path="/dashboard"
          element={isLoggedIn ? <AuthView /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/complete-profile" element={<UserFormView/>} />
      </Routes>
    </Router>
  );
};

// Render the main application
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);
