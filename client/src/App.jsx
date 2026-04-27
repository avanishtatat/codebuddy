import { Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<div>Home</div>} />
      <Route path='/chat' element={<div>Chat</div>} />
      <Route path="/login" element={<div>Login</div>} />
      <Route path="/register" element={<div>Register</div>} />
    </Routes>
  )
}

export default App