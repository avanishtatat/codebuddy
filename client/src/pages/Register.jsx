import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";


const Register = () => {
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const {login, token} = useAuth();
  const navigate = useNavigate();

  if (token) {
    return <Navigate to='/' />
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userData = {name, email, password};
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      const {name: userName, token} = response.data; 
      setError(null); 
      login({name: userName}, token); 
      navigate('/');
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.response?.data?.message || error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-1">Code<span className="text-blue-500">Buddy</span></h1>
      <p className="text-gray-500 text-xl mb-8">Your AI coding assistant</p>
      <p className="text-blue-500 bg-blue-200 rounded-2xl px-8 py-2 mb-2">Free - 20 messages/day</p>
      <form className="w-5/6 md:w-2/6 flex flex-col gap-y-4 items-center mb-6 p-2" onSubmit={handleSubmit}>
        <div className="w-full h-16 flex flex-col gap-y-1">
          <label htmlFor="name" className="font-medium text-[14px] text-gray-500">Name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Avanish Tiwari" autoComplete="name" className="px-6 m-auto w-full h-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-500" required/>
        </div>
        <div className="w-full h-16 flex flex-col gap-y-1">
          <label htmlFor="email" className="font-medium text-[14px] text-gray-500">Email</label>
          <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="avanish@example.com" autoComplete="email" className="px-6 m-auto w-full h-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-500" required/>
        </div>
        <div className="w-full h-16 flex flex-col gap-y-1">
          <label htmlFor="password" className="font-medium text-[14px] text-gray-500">Password</label>
          <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="********" autoComplete="new-password" className="px-6 m-auto w-full h-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-500" required minLength={8}/>
        </div>
        <button type="submit" className="px-6 py-3 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition" disabled={loading}>{loading ? 'Creating Account...' : 'Create Account'}</button>
        {error && <p role="alert" className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
      <p className="text-sm text-gray-600">Already have an account? <Link to="/login" className="text-blue-500 hover:underline cursor-pointer">Log in</Link></p>
    </div>
  )
}

export default Register