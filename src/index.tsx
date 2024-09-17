import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import IndexView from './view/index.view';
import LoginView from './view/login.view';
import RegisterView from './view/register.view';
import ShopView from './view/shop.view';
import SearchView from './view/search.view';
import AdminPage from './component/adminPage/admin.component';
import CartView from './view/cart.view';
import FishDetailView from './view/detail.view';

import "./component/assets/css/bootstrap.min.css";
import "./component/assets/css/now-ui-kit.css";
import "./component/assets/demo/demo.css";
import "./component/assets/demo/nucleo-icons-page-styles.css";
//render
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<IndexView />} />
        <Route path='/login' element={<LoginView />} />
        <Route path='/register' element={<RegisterView />} />
        <Route path='/shop' element={<ShopView />} />
        <Route path='/admin' element={<AdminPage />} />
        <Route path='/cart' element={<CartView />} />
        <Route path='/fish/:_id' element={<FishDetailView />} />
        <Route path='/search' element={<SearchView />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

