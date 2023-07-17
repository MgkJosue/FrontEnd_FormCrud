import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/UserList.css';
import { Link } from "react-router-dom";


const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUserFields, setEditingUserFields] = useState({});
  const [formData, setFormData] = useState({
    search: '',
    usersPerPage: 5,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/usuarios");
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      setErrorMessage("Error al recuperar la lista de usuarios.");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("¿Estás seguro que deseas eliminar este usuario?")) {
      try {
        await axios.delete(`http://localhost:8000/usuarios/${userId}`);
        fetchUsers(); // Actualizar la lista de usuarios después de eliminar
      } catch (error) {
        setErrorMessage("Error al eliminar el usuario.");
      }
    }
  };
  

  const handleSelect = (user) => {
    setEditingUserId(user.Id_usuario);
    setEditingUserFields(user);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    const searchValue = e.target.value.toLowerCase();
    const filtered = users.filter((user) => {
      const fullName = `${user.nombre} ${user.apellido}`.toLowerCase();
      const idCard = `${user.cedula}`.toLowerCase();
      return fullName.includes(searchValue) || idCard.includes(searchValue);
    });
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };


  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:8000/usuarios/${editingUserId}`, editingUserFields);
      fetchUsers(); // Actualizar la lista de usuarios después de actualizar
      setEditingUserId(null);
      setEditingUserFields({});
    } catch (error) {
      setErrorMessage("Error al actualizar el usuario.");
    }
  };

  const totalPages = Math.ceil(filteredUsers.length / formData.usersPerPage);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  }

 // Utilizar la lista filtrada en lugar de la lista original
  const displayUsers = filteredUsers
  .slice((currentPage - 1) * formData.usersPerPage, currentPage * formData.usersPerPage)
  .map(user => editingUserId === user.Id_usuario 
    ? <tr key={user.Id_usuario}>
        <td><input value={editingUserFields.nombre || ''} onChange={(e) => handleChange(e, 'nombre')} /></td>
        <td><input value={editingUserFields.apellido || ''} onChange={(e) => handleChange(e, 'apellido')} /></td>
        <td><input value={editingUserFields.cedula || ''} onChange={(e) => handleChange(e, 'cedula')} /></td>
        <td><input value={editingUserFields.email || ''} onChange={(e) => handleChange(e, 'email')} /></td>
        <td><input value={editingUserFields.fecha_nacimiento || ''} onChange={(e) => handleChange(e, 'fecha_nacimiento')} /></td>
        <td><input value={editingUserFields.direccion || ''} onChange={(e) => handleChange(e, 'direccion')} /></td>
        <td>
          <button onClick={handleSave}>Guardar</button>
          <button onClick={() => setEditingUserId(null)}>Cancelar</button>
        </td>
      </tr>
    : <tr key={user.Id_usuario}>
        <td>{user.nombre}</td>
        <td>{user.apellido}</td>
        <td>{user.cedula}</td>
        <td>{user.email}</td>
        <td>{user.fecha_nacimiento}</td>
        <td>{user.direccion}</td>
        <td>
        <Link to={`/editar-usuario/${user.Id_usuario}`}><button>Editar</button></Link>
        <button onClick={() => handleDelete(user.Id_usuario)}>Eliminar</button>
        </td>
      </tr>
  );

  return (
    <div className="userlist-container">
      <h1>Lista de Usuarios</h1>
      <input 
        type="text" 
        name="search" 
        value={formData.search} 
        placeholder="Buscar por nombre, apellido o cédula de identidad" 
        onChange={handleChange} 
    />


      {errorMessage && <p>{errorMessage}</p>}
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Cédula de Identidad</th>
            <th>Email</th>
            <th>Fecha de Nacimiento</th>
            <th>Dirección</th>    
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {displayUsers}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)}>Anterior</button>
        <span>{currentPage} de {totalPages}</span>
        <button onClick={() => handlePageChange(currentPage + 1)}>Siguiente</button>
      </div>
    </div>
  );
};

export default UserList;
