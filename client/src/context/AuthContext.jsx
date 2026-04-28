import { createContext, useContext, useState } from "react";

export const AuthContext = createContext(); 

const safeJsonParse = (key) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error parsing ${key} from localStorage`, error);
        localStorage.removeItem(key);
        return null;
    }
}

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => safeJsonParse('user')); 
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);

    const login = (userData, token) => {
        setUser(userData); 
        setToken(token); 
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
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

export const useAuth = () => {
    const context = useContext(AuthContext); 
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthProvider;