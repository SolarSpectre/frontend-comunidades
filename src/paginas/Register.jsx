import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export const Register = () => {
  const [form, setForm] = useState({
    nombre: "",
    usuario: "",
    email: "",
    password: "",
    celular: "",
    universidad: "",
    carrera: "",
    anioIngreso: "",
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
      <ToastContainer />
      <div className="bg-white flex justify-center items-start w-1/2">
        <div className="md:w-4/5 sm:w-full">
          <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-gray-500">
            Create Your Account
          </h1>
          <small className="text-gray-400 block my-4 text-sm">
            Please fill out the form below
          </small>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold">Full Name</label>
              <input
                name="nombre"
                value={form.nombre || ""}
                onChange={handleChange}
                type="text"
                placeholder="Enter your full name"
                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
              />
            </div>

            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold">Username</label>
              <input
                name="usuario"
                value={form.usuario || ""}
                onChange={handleChange}
                type="text"
                placeholder="Enter a username"
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
                placeholder="Enter your email"
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
                placeholder="Enter your password"
                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
              />
            </div>

            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold">Phone Number</label>
              <input
                name="celular"
                value={form.celular || ""}
                onChange={handleChange}
                type="tel"
                placeholder="Enter your phone number"
                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
              />
            </div>

            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold">University</label>
              <input
                name="universidad"
                value={form.universidad || ""}
                onChange={handleChange}
                type="text"
                placeholder="Enter your university"
                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
              />
            </div>

            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold">Degree Program</label>
              <input
                name="carrera"
                value={form.carrera || ""}
                onChange={handleChange}
                type="text"
                placeholder="Enter your degree program"
                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
              />
            </div>

            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold">Year of Entry</label>
              <input
                name="anioIngreso"
                value={form.anioIngreso || ""}
                onChange={handleChange}
                type="number"
                placeholder="Enter your year of entry"
                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
              />
            </div>

            <div className="mb-3">
              <label className="mb-2 block text-sm font-semibold">Profile Picture</label>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
            </div>

            <div className="mb-3">
              <button
                type="submit"
                className="bg-gray-500 text-slate-300 border py-2 w-full rounded-xl mt-5 hover:scale-105 duration-300 hover:bg-gray-900 hover:text-white"
              >
                Register
              </button>
            </div>
          </form>

          <div className="mt-3 text-sm flex justify-between items-center">
            <p>Already have an account?</p>
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
        className="w-1/2 h-screen bg-[url('/images/dogregister.jpg')] 
            bg-no-repeat bg-cover bg-center sm:block hidden"
      ></div>
    </>
  );
};

export default Register;
