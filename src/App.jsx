import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18n';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ThemeProvider from './context/ThemeProvider';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import MainPage from './components/Main/MainPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Layout from './components/Layout/Layout';
import Templates from './components/Template/Templates';
import CreateTemplate from './components/Template/CreateTemplate';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import EditTemplate from './components/Template/EditTemplate';
import AdminLayout from './components/Admin/Layout/AdminLayout';
import CreateUser from './components/Admin/Users/CreateUser';
import EditUser from './components/Admin/Users/EditUser';
import SubmitForm from './components/Form/SubmitForm';
import AdminRoute from './components/Auth/AdminRoute';
import EditForm from './components/Form/EditForm';
import Answers from './components/Answer/Answers';
import CommentList from './components/Comment/CommentList';
import FormAccessManagement from './components/FormAccess/FormAccessManagment';
import CreateUserInSalesforce from './components/Admin/Users/CreateUserInSalesforce';
import MainTemplatePage from './components/Main/MainTemplatePage';
import MainPresentationPage from './components/Main/MainPresentationPage';
import CreatePresentation from './components/presentationComponents/Presentation/CreatePresentation';
import ViewPresentation from './components/presentationComponents/Presentation/ViewPresentation';
import UpdatePresentation from './components/presentationComponents/Presentation/updatePresentation';
import Participants from './components/presentationComponents/Participant/Participants';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              path="/presentation/view/:encryptedData"
              element={<ViewPresentation />}
            />
            <Route
              path="/*"
              element={
                <ThemeProvider>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <Layout>
                          <MainPage />
                        </Layout>
                      }
                    />
                    <Route
                      path="/main/templates"
                      element={
                        <Layout>
                          <MainTemplatePage />
                        </Layout>
                      }
                    />
                    <Route
                      path="/main/presentations"
                      element={
                        <Layout>
                          <MainPresentationPage />
                        </Layout>
                      }
                    />
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
                      path="/dashboard/:tab"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <Layout>
                          <AdminRoute>
                            <AdminLayout />
                          </AdminRoute>
                        </Layout>
                      }
                    />
                    <Route
                      path="/admin/user/create"
                      element={
                        <Layout>
                          <AdminRoute>
                            <CreateUser />
                          </AdminRoute>
                        </Layout>
                      }
                    />
                    <Route
                      path="/admin/salesforce/create"
                      element={
                        <Layout>
                          <AdminRoute>
                            <CreateUserInSalesforce />
                          </AdminRoute>
                        </Layout>
                      }
                    />
                    <Route
                      path="/admin/user/edit/:userId"
                      element={
                        <Layout>
                          <AdminRoute>
                            <EditUser />
                          </AdminRoute>
                        </Layout>
                      }
                    />
                    <Route
                      path="/templates"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <Templates />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    <Route
                      path="/templates/create"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <CreateTemplate />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    <Route
                      path="/templates/edit/:templateId"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <EditTemplate />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    <Route
                      path="/form/submit/:encryptedData"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <SubmitForm />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    <Route
                      path="/form/edit/:templateId"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <EditForm />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    <Route
                      path="/answers/:formId/:formName"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <Answers />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    <Route
                      path="/comments/:templateId"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <CommentList />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    <Route
                      path="/form/access/:formId"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <FormAccessManagement />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    <Route
                      path="/presentation/create"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <CreatePresentation />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    <Route
                      path="/presentation/update/:presentationId"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <UpdatePresentation />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                    <Route
                      path="/presentation/participants/:presentationId"
                      element={
                        <Layout>
                          <ProtectedRoute>
                            <Participants />
                          </ProtectedRoute>
                        </Layout>
                      }
                    />
                  </Routes>
                </ThemeProvider>
              }
            />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Router>
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App;