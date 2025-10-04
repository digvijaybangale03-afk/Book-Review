import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import BookList from './pages/BookList';
import BookDetails from './pages/BookDetails';
import AddEditBook from './pages/AddEditBook';
import { AuthProvider } from './utils/auth';

export default function App(){
  return (
    <AuthProvider>
    <BrowserRouter>
      <nav className="nav">
        <Link to="/">Home</Link> | <Link to="/add">Add Book</Link> | <Link to="/signup">Signup</Link> | <Link to="/login">Login</Link>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<BookList/>}/>
          <Route path="/book/:id" element={<BookDetails/>}/>
          <Route path="/add" element={<AddEditBook/>}/>
          <Route path="/edit/:id" element={<AddEditBook/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/login" element={<Login/>}/>
        </Routes>
      </div>
    </BrowserRouter>
    </AuthProvider>
  );
}
