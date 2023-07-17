import React from "react";
import axios from "axios";
import '../styles/UserForm.css'; 
import { Link } from 'react-router-dom';
import { useNavigate, useLocation, useParams} from 'react-router-dom';
import { useState, useEffect } from 'react';



const UserForm = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [cedula, setCedula] = useState("");
  const [pais, setPais] = useState("");
  const [region, setRegion] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [genero, setGenero] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); 

  // Then inside your component:

  const navigate = useNavigate();
  const location = useLocation();

  const { userId } = useParams();
  const [isNew, setIsNew] = useState(true); // determinar si se está creando un usuario nuevo o se está editando uno existente

  const paises = {
    'USA': ['California', 'Texas', 'New York', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'],
    'Mexico': ['CDMX', 'Jalisco', 'Nuevo Leon', 'Puebla', 'Guanajuato', 'Veracruz', 'Chiapas', 'Chihuahua', 'Michoacán', 'Oaxaca'],
    'Canada': ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba', 'Saskatchewan', 'Nova Scotia', 'New Brunswick', 'Newfoundland and Labrador', 'Prince Edward Island'],
    'Australia': ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia', 'Tasmania', 'Australian Capital Territory', 'Northern Territory'],
    'España': ['Andalucía', 'Cataluña', 'Madrid', 'Valencia', 'Galicia', 'Castilla y León', 'País Vasco', 'Castilla-La Mancha', 'Canarias', 'Aragón'],
    'Reino Unido': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    'Francia': ['Île-de-France', 'Auvergne-Rhône-Alpes', 'Hauts-de-France', 'Provence-Alpes-Côte d\'Azur', 'Nouvelle-Aquitaine', 'Brittany', 'Normandy', 'Grand Est', 'Occitanie', 'Bourgogne-Franche-Comté'],
    'Alemania': ['Bavaria', 'North Rhine-Westphalia', 'Baden-Württemberg', 'Lower Saxony', 'Hesse', 'Saxony', 'Rhineland-Palatinate', 'Berlin', 'Schleswig-Holstein', 'Brandenburg'],
    'Ecuador': ['Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo', 'Cotopaxi', 'El Oro', 'Esmeraldas', 'Galápagos', 'Guayas', 'Imbabura', 'Loja', 'Los Ríos', 'Manabí', 'Morona Santiago', 'Napo', 'Orellana', 'Pastaza', 'Pichincha', 'Santa Elena', 'Santo Domingo de los Tsáchilas', 'Sucumbíos', 'Tungurahua', 'Zamora Chinchipe']
  };
  

  const validateKeyPress = (event, type) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    const regex = type === "text" ? /[^a-zA-Z ]/g : /[^0-9]/g;
    if (regex.test(keyValue))
      event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!nombre || !apellido || !email || !fechaNacimiento || !genero || !direccion || !telefono|| !cedula || !pais || !region) {
      setErrorMessage("Todos los campos son obligatorios.");
      return;
    }

    if (telefono.length !== 10) {
      setErrorMessage("El número de teléfono debe tener exactamente 10 dígitos.");
      return;
    }

    const currentDate = new Date();
    const selectedDate = new Date(fechaNacimiento);
    if (selectedDate > currentDate || currentDate.getFullYear() - selectedDate.getFullYear() > 100) {
      setErrorMessage("La fecha de nacimiento no puede ser mayor que la fecha actual o anterior a 100 años.");
      return;
    }

    const user = {
      nombre,
      apellido,
      email,
      fecha_nacimiento: fechaNacimiento,
      genero,
      direccion,
      telefono,
      cedula,
      pais,
      region
    };

    const confirmUpdate = userId ? window.confirm("¿Está seguro de que desea actualizar los datos del usuario?") : true;

    if (confirmUpdate) {
    try {
      let response;
      if (userId) {
        response = await axios.put(`http://localhost:8000/usuarios/${userId}`, user);
        setSuccessMessage("Usuario actualizado exitosamente!"); 
      } else {
        response = await axios.post("http://localhost:8000/usuarios", user);
        setSuccessMessage("Usuario registrado exitosamente!"); 
      }
      console.log(response.data);
      
      // Redirige a la lista de usuarios después de una operación exitosa
      navigate("/list");
    } catch (error) {
      if (error.response) {
        // Verificar si existe la propiedad 'detail' en el objeto de error y es un array
        if (Array.isArray(error.response.data.detail)) {
          // Buscar el primer objeto del array que tiene la propiedad 'msg' y obtener su valor
          const errorMsg = error.response.data.detail.find((d) => d.hasOwnProperty('msg'))?.msg;
      
          if (errorMsg) {
            setErrorMessage(errorMsg);
          } else {
            setErrorMessage(JSON.stringify(error.response.data));
          }
        } else {
          setErrorMessage(JSON.stringify(error.response.data));
        }
      } else if (error.request) {
        setErrorMessage('Error con la conexión al servidor. Por favor, intenta de nuevo.');
      } else {
        setErrorMessage('Error inesperado. Por favor, intenta de nuevo.');
      }
    }
  } else {
    setErrorMessage("Actualización de usuario cancelada por el usuario.");
  }
  };
    

  useEffect(() => {
    if (userId) {
      setIsNew(false);
      axios.get(`http://localhost:8000/usuarios/${userId}`)
        .then(response => {
          const user = response.data;
          setNombre(user.nombre);
          setApellido(user.apellido);
          setEmail(user.email);
          setFechaNacimiento(user.fecha_nacimiento);
          setGenero(user.genero);
          setDireccion(user.direccion);
          setTelefono(user.telefono);
          setCedula(user.cedula);
          setPais(user.pais);
          setRegion(user.region);
        })
        .catch(error => {
          console.log("Error al cargar los datos del usuario", error);
        });
    }
  }, [userId]);

  return (
    <div className="form-container">
     <h1>{isNew ? "Formulario de Usuario" : "Actualización de Usuario"}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} onKeyPress={e => validateKeyPress(e, "text")} required />
        </label>
        <label>
          Apellido:
          <input type="text" value={apellido} onChange={e => setApellido(e.target.value)} onKeyPress={e => validateKeyPress(e, "text")} required />
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label>
          Fecha de Nacimiento:
          <input type="date" value={fechaNacimiento} onChange={e => setFechaNacimiento(e.target.value)} required />
        </label>
        <label>
          Genero:
          <select value={genero} onChange={e => setGenero(e.target.value)} required>
            <option value="">Selecciona...</option>
            <option value="M">M</option>
            <option value="F">F</option>
          </select>
        </label>
        <label>
          País:
          <select value={pais} onChange={e => setPais(e.target.value)} required>
            <option value="">Selecciona...</option>
            {Object.keys(paises).map(pais => <option key={pais} value={pais}>{pais}</option>)}
          </select>
        </label>
        <label>
          Región:
          <select value={region} onChange={e => setRegion(e.target.value)} required>
            <option value="">Selecciona...</option>
            {paises[pais]?.map(region => <option key={region} value={region}>{region}</option>)}
          </select>
        </label>
        <label>
          Dirección:
          <input type="text" value={direccion} onChange={e => setDireccion(e.target.value)} required />
        </label>
        <label>
          Teléfono:
          <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} onKeyPress={e => validateKeyPress(e, "number")} maxLength={10} required />
        </label>
        <label>
          Cedula:
          <input type="text" value={cedula} onChange={e => setCedula(e.target.value)} onKeyPress={e => validateKeyPress(e, "number")} maxLength={10} required />
        </label>

        <button type="submit">{isNew ? "Registrar Usuario" : "Actualizar Usuario"}</button>
        <Link to="/list">
          <button>Listar Usuarios</button>
        </Link>
        {errorMessage && <p>{JSON.stringify(errorMessage)}</p>}


        {successMessage && <p>{successMessage}</p>}
      </form>
        
    </div>
  );
};

export default UserForm;
