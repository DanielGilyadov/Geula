import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'antd/dist/reset.css';
import { BrowserRouter as Router } from 'react-router-dom'; // Оборачиваем в Router

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <App /> {/* Все маршруты и компоненты внутри App */}
  </Router>
);
