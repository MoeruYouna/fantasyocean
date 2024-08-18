import React from 'react';
import ReactDOM from 'react-dom/client';
import IndexView from './view/index.view';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <IndexView />
  </React.StrictMode>
);

