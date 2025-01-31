import { useEffect, useState } from "react";
import { Trash2, Pencil, CirclePlus, Info } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../Chat/store/useAuthStore";

const TablaComunidades = () => {
  const navigate = useNavigate();
  const { authUser,token } = useAuthStore(); // Información del usuario autenticado
  const [comunidades, setComunidades] = useState([]);

  // Función para obtener todas las comunidades
  const listarComunidades = async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/comunidades`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const respuesta = await axios.get(url, options);
      setComunidades(respuesta.data);
    } catch (error) {
      console.error("Error al listar las comunidades:", error);
    }
  };

  // Función para eliminar una comunidad
  const eliminarComunidad = async (id) => {
    try {
      const confirmar = confirm("¿Estás seguro de eliminar esta comunidad?");
      if (confirmar) {
        const url = `${import.meta.env.VITE_BACKEND_URL}/comunidades/${id}`;
        const options = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(url, options);
        listarComunidades(); // Actualizar la lista de comunidades después de eliminar
      }
    } catch (error) {
      console.error("Error al eliminar la comunidad:", error);
    }
  };

  // Función para unirse a una comunidad (solo estudiantes)
  const unirseComunidad = async (id) => {
    try {
      const url = `${
        import.meta.env.VITE_BACKEND_URL
      }/comunidades/${id}/unirse`;
      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post(url, { _id: authUser?._id }, options);
      toast.success("Te has unido a la comunidad exitosamente.");
    } catch (error) {
      console.error("Error al unirse a la comunidad:", error);
    }
  };

  useEffect(() => {
    listarComunidades();
  }, []);

  return (
    <>
      
      {comunidades.length === 0 ? (
        <p>No existen comunidades registradas.</p>
      ) : (
        <table className="w-full mt-5 table-auto shadow-lg bg-white">
          <thead className="bg-gray-800 text-slate-400">
            <tr>
              <th className="p-2">N°</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Descripción</th>
              <th className="p-2">Tipo</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {comunidades.map((comunidad, index) => (
              <tr
                className="border-b hover:bg-gray-300 text-center"
                key={comunidad._id}
              >
                <td>{index + 1}</td>
                <td>{comunidad.nombre}</td>
                <td>{comunidad.descripcion}</td>
                <td>{comunidad.tipo}</td>
                <td className="py-2 text-center">
                  {authUser.rol === "Estudiante" && (
                    <>
                      <CirclePlus
                        className="h-7 w-7 text-blue-700 cursor-pointer inline-block mr-2"
                        onClick={() => unirseComunidad(comunidad._id)}
                      />
                      <Info
                        className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2"
                        onClick={() =>
                          navigate(`/dashboard/visualizar/${comunidad._id}`)
                        }
                      />
                    </>
                  )}
                  {authUser.rol === "Administrador" && (
                    <>
                      <Info
                        className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2"
                        onClick={() =>
                          navigate(`/dashboard/visualizar/${comunidad._id}`)
                        }
                      />
                      <Pencil
                        className="h-7 w-7 text-slate-800 cursor-pointer inline-block mr-2"
                        onClick={() =>
                          navigate(`/dashboard/actualizar/${comunidad._id}`)
                        }
                      />
                      <Trash2
                        className="h-7 w-7 text-red-900 cursor-pointer inline-block"
                        onClick={() => eliminarComunidad(comunidad._id)}
                      />
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default TablaComunidades;
