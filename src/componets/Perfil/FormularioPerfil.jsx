import { useContext, useState } from "react"
import AuthContext from "../../context/AuthProvider"
import { toast, ToastContainer } from "react-toastify"


const FormularioPerfil = () => {
    const {auth,actualizarPerfil} = useContext(AuthContext)
    const [form, setform] = useState({
        id: auth._id,
        nombre: auth.nombre || "",
        apellido: auth.apellido || "",
        direccion: auth.direccion || "",
        telefono: auth.telefono || "",
        email: auth.email || ""
    })

    const handleChange = (e) => {
        setform({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (Object.values(form).includes("")) {
            toast.error("Todos los campos deben ser ingresados")
        }
        const resultado = await actualizarPerfil(form)
        toast(resultado)
    }

    return (
        <>
            <ToastContainer />
            <form onSubmit={handleSubmit}>
                <div>
                    <label
                        htmlFor='nombre'
                        className='text-gray-700 uppercase font-bold text-sm'>Nombre: </label>
                    <input
                        id='nombre'
                        type="text"
                        className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                        placeholder='nombre'
                        name='nombre'
                        value={form.nombre}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label
                        htmlFor='apellido'
                        className='text-gray-700 uppercase font-bold text-sm'>Apellido: </label>
                    <input
                        id='apellido'
                        type="text"
                        className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                        placeholder='apellido'
                        name='apellido'
                        value={form.apellido}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label
                        htmlFor='direccion'
                        className='text-gray-700 uppercase font-bold text-sm'>Dirección: </label>
                    <input
                        id='direccion'
                        type="text"
                        className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                        placeholder='direccion'
                        name='direccion'
                        value={form.direccion}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label
                        htmlFor='telefono'
                        className='text-gray-700 uppercase font-bold text-sm'>Teléfono: </label>
                    <input
                        id='ditelefonoreccion'
                        type="text"
                        className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                        placeholder='telefono'
                        name='telefono'
                        value={form.telefono}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label
                        htmlFor='email'
                        className='text-gray-700 uppercase font-bold text-sm'>Email: </label>
                    <input
                        id='email'
                        type="text"
                        className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
                        placeholder='email'
                        name='email'
                        value={form.email}
                        onChange={handleChange}
                    />
                </div>

                <input
                    type="submit"
                    className='bg-gray-800 w-full p-3 
        text-slate-300 uppercase font-bold rounded-lg 
        hover:bg-gray-600 cursor-pointer transition-all'
                    value='Actualizar' />

            </form>
        </>
    )
}

export default FormularioPerfil