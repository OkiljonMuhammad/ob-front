import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18n';
import ThemeProvider from './context/ThemeProvider';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TemplateDashboard from './components/Main/MainPage';
import Layout from './components/Layout/Layout';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        {' '}
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                <Layout>
                  <Login />
                </Layout>
              }
            />
            <Route
              path="/register"
              element={
                <Layout>
                  <Register />
                </Layout>
              }
            />
            <Route
              path="/"
              element={
                <Layout>
                  <TemplateDashboard />
                </Layout>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;
