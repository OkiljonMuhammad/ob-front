import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18n';
import ThemeContext from './context/ThemeContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TemplateDashboard from './components/Main/MainPage';
import Layout from './components/Layout/Layout';

function App() {
  const [theme, setTheme] = useState('light');

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <div
          className={`bg-${theme} text-${theme === 'light' ? 'dark' : 'light'}`}
          style={{ minHeight: '100vh' }}
        >
          <Router>
            <Routes>
              <Route
                path="/login"
                element={
                  <Layout theme={theme}>
                    <Login />
                  </Layout>
                }
              />
              <Route
                path="/register"
                element={
                  <Layout theme={theme}>
                    <Register />
                  </Layout>
                }
              />
              <Route
                path="/"
                element={
                  <Layout theme={theme}>
                    <TemplateDashboard />
                  </Layout>
                }
              />
            </Routes>
          </Router>
        </div>
      </ThemeContext.Provider>
    </I18nextProvider>
  );
}

export default App;
