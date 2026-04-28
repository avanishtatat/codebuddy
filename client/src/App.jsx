import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import History from './pages/History'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
        } />
      <Route path='/history' element={
        <ProtectedRoute>
          <History />
        </ProtectedRoute>
      } />
      <Route path='*' element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App