import { useCallback, useEffect, useState } from "react";
import { TablaEstudiantes } from "./TablaEstudiantes"
import { useAuthStore } from "@/Chat/store/useAuthStore";
import axios from "axios";
import toast from "react-hot-toast";

export function DisabledUsers() {
  const [disabledUsers, setDisabledUsers] = useState([])
  const {token} = useAuthStore()
  const consultarUsuarios = useCallback(async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/estudiantes/desactivado/`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const respuesta = await axios.get(url, options);
      setDisabledUsers(respuesta.data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar los datos de la comunidad");
    }
  }, [token]);

  useEffect(() => {
    consultarUsuarios();
  }, [consultarUsuarios]);
  if (!disabledUsers) {
    return <div>Cargando...</div>;
  }
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Estudiantes Inactivos</h2>
      <TablaEstudiantes users={disabledUsers} userState="disabled" />
    </div>
  )
}
