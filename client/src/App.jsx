import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<div>Home</div>} />
      <Route path='/chat' element={<div>Chat</div>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<div>Register</div>} />
    </Routes>
  )
}

export default App