import { useState } from 'react'
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import { useNavigate, Link, Navigate } from 'react-router-dom'

const Login = () => {
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null);
    const {login} = useAuth();
    const navigate = useNavigate();
    const { token } = useAuth();

    if (token) {
        return <Navigate to="/" />
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const userData = {email, password}; 
        try {

        const response = await axiosInstance.post('/auth/login', userData)
        const {name, token} = response.data
        setError(null);
        login({name}, token); 
        navigate('/');
        } catch (error) {
            console.error("Login error:", error);
            setError(error?.response?.data?.message || error?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className='w-screen h-screen'>
        <div className='flex flex-col items-center justify-center h-full border-2 border-gray-300 rounded-lg shadow-lg p-8 bg-white'>
            <h1 className='text-4xl font-bold mb-4 text-center'>Welcome back to your <span className='text-blue-500'>CodeBuddy</span></h1>
            <p className='text-lg text-gray-600 mb-8 text-center'>Please log in to continue chatting with your coding assistant</p>
            
            <form className='w-5/6 md:w-2/6 flex flex-col gap-y-5 items-center mb-6 p-4' onSubmit={handleSubmit}>
                <div className='h-12 bg-slate-200 rounded-lg w-full'>
                    <label htmlFor='email' className='sr-only'>Email</label>
                    <input id='email' type="email" placeholder='john@example.com' autoComplete='email' className='px-6 m-auto w-full h-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className='h-12 bg-slate-200 rounded-lg w-full'>
                    <label htmlFor='password' className='sr-only'>Password</label>
                    <input id='password' type="password" placeholder='********' autoComplete='current-password' className='px-6 m-auto w-full h-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' value={password} onChange={(e) => setPassword(e.target.value)} required />
                    
                </div>
                <button type='submit' className='px-6 py-3 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition' disabled={loading}>{loading ? "Logging In..." : "Log In"}</button>
                {error && <p role='alert' className='text-red-500 text-sm mt-2'>{error}</p>}
            </form>

            <p className='text-sm text-gray-600'>Don't have an account? <Link to="/register" className='text-blue-500 hover:underline'>Register here</Link></p>
        </div>
    </div>
  )
}

export default Login