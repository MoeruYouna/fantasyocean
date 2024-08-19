import React from 'react';
import ReactDOM from 'react-dom/client';
import IndexView from './view/index.view';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

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
      </Routes>
    </Router>
  </React.StrictMode>
);

