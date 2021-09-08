import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

function App() {
  const URL = "http://crudpruebaapi.somee.com/WebSite/api/usuario";
  const [data, setData] = useState([]);
  const [modalGuardar, setModalGuardar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState({
    id_Usuario:'',
    cedula_Usuario:'',
    nombre_Usuario:'',
    telefono_Usuario:'',
    email_Usuario:''
  });

  const handleChange=e=>{
    const {name, value}=e.target;
    setUsuarioSeleccionado({
      ...usuarioSeleccionado,
      [name]:value
    })
  }

  const abrirModalGuardar =(usuario)=>{
    setUsuarioSeleccionado(null);
    if(usuario != null){
      setUsuarioSeleccionado(usuario);
    }
    setModalGuardar(!modalGuardar);
    
  }

  const abrirModalEliminar =(usuario)=>{
    setUsuarioSeleccionado(usuario);
    setModalEliminar(!modalEliminar);
  }

  const Guardar =()=>{
    if(usuarioSeleccionado.id_Usuario === undefined){
      Post();
    }else{
      Put();
    }
  }

  

  // Peticiones

  const Get = async () => {
    await axios
      .get(URL)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const Post = async () => {
    delete usuarioSeleccionado.id_Usuario;
    await axios
      .post(URL, usuarioSeleccionado)
      .then((response) => {
        console.log(response.data)
        Get();
        abrirModalGuardar();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const Put = async () => {
    await axios
      .put(URL, usuarioSeleccionado)
      .then((response) => {
        abrirModalGuardar();
        Get();
      })
      .catch((err) => {
        abrirModalGuardar();
        console.log(err);
      });
  };

  const Delete = async () => {
  
    await axios
      .delete(URL+"/"+usuarioSeleccionado.id_Usuario)
      .then((response) => {
        Get();
        abrirModalEliminar();
      })
      .catch((err) => {
        console.log(err);
      });
  };


  useEffect(() => {
    Get();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="jumbotron">
          <br></br>
          <button type="button" className="btn btn-success" onClick={()=> abrirModalGuardar(null)}>
            Agregar
          </button>
          <br></br>
          <br></br>
          <table className="table table-hover">
            <thead>
              <tr>
                <th> Id Usuario </th>
                <th> Cédula </th>
                <th> Nombre </th>
                <th> Teléfono </th>
                <th> Email </th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {data.map((usuario) => (
                <tr key={usuario.id_Usuario}>
                  <td> {usuario.id_Usuario} </td>
                  <td> {usuario.cedula_Usuario} </td>
                  <td> {usuario.nombre_Usuario} </td>
                  <td> {usuario.telefono_Usuario} </td>
                  <td> {usuario.email_Usuario} </td>
                  <td>
                    <button type="button" className="btn btn-primary" onClick={()=> abrirModalGuardar(usuario)}>
                      Editar
                    </button>{" "}
                    <button type="button" className="btn btn-danger" onClick={()=> abrirModalEliminar(usuario)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalGuardar}>
        <ModalHeader> Usuario </ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Cédula:</label>
            <input type="text" className="form-control" name="cedula_Usuario" onChange={handleChange}  value={usuarioSeleccionado && usuarioSeleccionado.cedula_Usuario} ></input>
          </div>
          <div className="form-group">
            <label>Nombre:</label>
            <input type="text" className="form-control" name="nombre_Usuario" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.nombre_Usuario}></input>
          </div>
          <div className="form-group">
            <label>Telefono:</label>
            <input type="text" className="form-control" name="telefono_Usuario" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.telefono_Usuario}></input>
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" className="form-control" name="email_Usuario" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.email_Usuario}></input>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-success" onClick={()=>Guardar()} >Guardar</button>
          <button className="btn btn-danger" onClick={()=>abrirModalGuardar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEliminar} >
        <ModalHeader>Eliminar Usuario</ModalHeader>
        <ModalBody>
          <p>¿Desea eliminar usuario?</p>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>Delete()} >Si</button>
          <button className="btn btn-primary" onClick={()=>abrirModalEliminar()}>No</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
