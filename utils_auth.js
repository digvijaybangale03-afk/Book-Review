import React, {createContext, useState, useEffect} from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({children}){
  const [user, setUser] = useState(()=> {
    const raw = localStorage.getItem('br_user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(()=> {
    const token = localStorage.getItem('br_token');
    if(token) axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  }, []);

  const login = (token, user) => {
    localStorage.setItem('br_token', token);
    localStorage.setItem('br_user', JSON.stringify(user));
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    setUser(user);
  };
  const logout = () => {
    localStorage.removeItem('br_token');
    localStorage.removeItem('br_user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };
  return <AuthContext.Provider value={{user, login, logout}}>{children}</AuthContext.Provider>;
}

export default AuthContext;
