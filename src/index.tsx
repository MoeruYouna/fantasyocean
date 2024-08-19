import React from 'react';
import ReactDOM from 'react-dom/client';
import IndexView from './view/index.view';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

//import component
import HomeView from './component/homePage/home.component';

//render
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<IndexView />} />
        <Route path='/Home' element={<HomeView />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

