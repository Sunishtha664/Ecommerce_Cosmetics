import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import About from './pages/About'
import Contact from './pages/Contact';
import Policy from './pages/Policy';
import PageNotFound from './pages/PageNotFound';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Profile from './pages/Profile';
import Dashboard from './pages/user/Dashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import { AuthProvider } from './context/auth';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import AdminRoute from './components/Routes/AdminRoute';
import CreateCategory from './pages/Admin/CreateCategory';
import CreateProduct from './pages/Admin/CreateProduct';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/dashboard/user' element={<Dashboard />} />

        <Route path='/dashboard' element={<AdminRoute />}>
          <Route path='admin' element={<AdminDashboard />} />
          <Route path='admin/create-category' element={<CreateCategory />} />
          <Route path='admin/create-product' element={<CreateProduct />} />
        </Route>
        <Route path='/about' element={<About />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/policy' element={<Policy />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
