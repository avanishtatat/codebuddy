import { createContext, useContext, useState } from "react";

export const AuthContext = createContext(); 

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null); 
    const [token, setToken] = useState(JSON.parse(localStorage.getItem('token')) || null);

    const login = (userData, token) => {
        setUser(userData); 
        setToken(token); 
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', JSON.stringify(token));
    }

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    return (
        <AuthContext.Provider value={{user, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;