import { useCallback, useEffect, useState } from "react";
import { TablaEstudiantes } from "./TablaEstudiantes"
import toast from "react-hot-toast";
import axios from "axios";
import { useAuthStore } from "@/Chat/store/useAuthStore";

export function ActiveUsers() {
  const [activeUsers, setActiveUsers] = useState([])
  const {token} = useAuthStore()
  const consultarUsuarios = useCallback(async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/estudiantes/`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const respuesta = await axios.get(url, options);
      setActiveUsers(respuesta.data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar los datos de la comunidad");
    }
  }, [token]);

  useEffect(() => {
    consultarUsuarios();
  }, [consultarUsuarios]);
  if (!activeUsers) {
    return <div>Cargando...</div>;
  }
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Estudiantes Activos</h2>
      <TablaEstudiantes users={activeUsers} userState="active" />
    </div>
  )
}

