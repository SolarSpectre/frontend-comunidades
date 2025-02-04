import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export const Register = () => {
  const [form, setForm] = useState({
    nombre: "",
    usuario: "",
    email: "",
    password: "",
    celular: "",
    universidad: "",
    carrera: "",
    bio: "",
    intereses: "",
    comunidad: "",
  });

  const [imagen, setImagen] = useState(null); // Estado para la imagen de perfil

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImagen(e.target.files[0]); // Captura el archivo de imagen
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/estudiante/registro`;
      const formData = new FormData();

      // Agregar los datos del formulario al FormData
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      // Agregar la imagen de perfil al FormData
      if (imagen) {
        formData.append("fotoPerfil", imagen);
      }

      const respuesta = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(respuesta.data.msg);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "Error al registrar al estudiante");
    }
  };

  return (
    <>
      
      <div className="bg-white flex justify-center items-start w-1/2 overflow-auto">
        <div className="md:w-4/5 sm:w-full">
          <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-gray-500">
            Crea tu cuenta
          </h1>
          <small className="text-gray-400 block my-4 text-sm">
            Por favor llena los siguientes campos
          </small>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold">Nombre Completo</label>
              <input
                name="nombre"
                value={form.nombre || ""}
                onChange={handleChange}
                type="text"
                placeholder="ej: Juan Perez"
                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
              />
            </div>

            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold">Usuario</label>
              <input
                name="usuario"
                value={form.usuario || ""}
                onChange={handleChange}
                type="text"
                placeholder="ej: juanperez"
                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
              />
            </div>

            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold">Email</label>
              <input
                name="email"
                value={form.email || ""}
                onChange={handleChange}
                type="email"
                placeholder="ej: juan@gmail.com"
                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
              />
            </div>

            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold">Password</label>
              <input
                name="password"
                value={form.password || ""}
                onChange={handleChange}
                type="password"
                placeholder="********"
                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
              />
            </div>

            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold">Celular</label>
              <input
                name="celular"
                value={form.celular || ""}
                onChange={handleChange}
                type="tel"
                placeholder="ej: 1234567890"
                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
              />
            </div>

            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold">Universidad</label>
              <input
                name="universidad"
                value={form.universidad || ""}
                onChange={handleChange}
                type="text"
                placeholder="ej: Universidad Central"
                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
              />
            </div>

            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold">Carrera</label>
              <input
                name="carrera"
                value={form.carrera || ""}
                onChange={handleChange}
                type="text"
                placeholder="ej: Ingeniería en Sistemas"
                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
              />
            </div>
            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold">Foto de Perfil</label>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-500 file:text-slate-300 hover:file:cursor-pointer hover:file:bg-gray-900 hover:file:text-white"
              />
            </div>

            <div className="mb-3">
              <button
                type="submit"
                className="bg-gray-500 text-slate-300 border py-2 w-full rounded-xl mt-5 hover:scale-105 duration-300 hover:bg-gray-900 hover:text-white"
              >
                Registrarse
              </button>
            </div>
          </form>

          <div className="mt-3 text-sm flex justify-between items-center">
            <p>Ya tienes cuenta?</p>
            <Link
              to="/login"
              className="py-2 px-5 bg-gray-500 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      <div
        className="w-1/2 h-screen bg-[url('/images/register.webp')] 
            bg-no-repeat bg-cover bg-center sm:block hidden"
      ></div>
    </>
  );
};

export default Register;
