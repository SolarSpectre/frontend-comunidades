import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";


const ForoComunidad = () => {
  const { id } = useParams();
  return (
    <div>
      <h1>Foro de la comunidad {id}</h1>
    </div>
  );
}
export default ForoComunidad;