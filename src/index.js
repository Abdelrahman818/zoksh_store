import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './App';
import OrderProvider from './context';
import { BrowserRouter } from 'react-router-dom';

import "./style/style.css";
import "./style/Normalize.css";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <OrderProvider>
      <App />
    </OrderProvider>
  </BrowserRouter>
);
