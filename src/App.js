import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserForm from './views/UserForm'; 
import UserList from './views/UserList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/list" element={<UserList />} />
        <Route path="/" element={<UserForm />} />
        <Route path="/editar-usuario/:userId" element={<UserForm />} />
      </Routes>
    </Router>
  );
  
}

export default App;
