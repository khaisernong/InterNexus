import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import App from './App';
import store from './store/store';
import './styles/index.css';

/**
 * Application Entry Point
 * 
 * Sets up the React application with necessary providers:
 * - BrowserRouter: Client-side routing
 * - Redux Provider: Global state management
 * - Ant Design ConfigProvider: Theme and locale configuration
 * 
 * Rendering uses React 18's createRoot API for improved performance.
 */

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#4f46e5',
              borderRadius: 8,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
            },
          }}
        >
          <App />
        </ConfigProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
