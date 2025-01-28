import axios from 'axios'
import React, { useState } from 'react'
import { useContext, useEffect } from 'react';
import TratamientosContext from '../context/TratamientosProvider';
import { useParams } from 'react-router-dom'
import ModalTratamiento from '../componets/Modals/ModalTratamiento'
import TablaTratamientos from '../componets/TablaTratamientos';
import { toast, ToastContainer } from 'react-toastify';
import AuthContext from '../context/AuthProvider';

const Visualizar = () => {
    const [paciente, setPaciente] = useState([])
    const { auth } = useContext(AuthContext)
    const { modal, mensaje, handleModal, tratamientos, setTratamientos } = useContext(TratamientosContext)
    const { id } = useParams()

    const formatearFecha = (fecha) => {
        const nuevaFecha = new Date(fecha)
        nuevaFecha.setMinutes(nuevaFecha.getMinutes() + nuevaFecha.getTimezoneOffset())
        return new Intl.DateTimeFormat('es-EC', { dateStyle: 'long' }).format(nuevaFecha)
    }

    const consultarPaciente = async () => {
        try {
            const token = localStorage.getItem('token')
            const url = `${import.meta.env.VITE_BACKEND_URL}/paciente/${id}`
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const respuesta = await axios.get(url, options)
            console.log(respuesta.data.paciente)
            setPaciente(respuesta.data.paciente)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        consultarPaciente()
    }, [])

    return (
        <>
            <ToastContainer />
            <div>
                <h1 className='font-black text-4xl text-gray-500'>Visualizar Paciente</h1>
                <div>
                    {
                        Object.keys(paciente).length != 0 ?
                            (
                                <>
                                    <div className='m-5 flex justify-between'>
                                        <div>
                                            <p className="text-md text-gray-00 mt-4">
                                                <span className="text-gray-600 uppercase font-bold">* Nombre del paciente: </span>
                                                {paciente.nombre}
                                            </p>
                                            <p className="text-md text-gray-00 mt-4">
                                                <span className="text-gray-600 uppercase font-bold">* Nombre del propietario: </span>
                                                {paciente.propietario}
                                            </p>
                                            <p className="text-md text-gray-00 mt-4">
                                                <span className="text-gray-600 uppercase font-bold">* Email: </span>
                                                {paciente.email}
                                            </p>
                                            <p className="text-md text-gray-00 mt-4">
                                                <span className="text-gray-600 uppercase font-bold">* Fecha de atención: </span>
                                                {formatearFecha(paciente.ingreso)}
                                            </p>
                                            <p className="text-md text-gray-00 mt-4">
                                                <span className="text-gray-600 uppercase font-bold">* Fecha de salida: </span>
                                                {formatearFecha(paciente.salida)}
                                            </p>
                                            <p className="text-md text-gray-00 mt-4">
                                                <span className="text-gray-600 uppercase font-bold">* Estado: </span>
                                                <span className="bg-blue-100 text-green-500 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{paciente.estado && "activo"}</span>
                                            </p>
                                            <p className="text-md text-gray-00 mt-4">
                                                <span className="text-gray-600 uppercase font-bold">* Síntomas: </span>
                                                {paciente.sintomas}
                                            </p>
                                        </div>
                                        <div>
                                            <img src="https://cdn-icons-png.flaticon.com/512/2138/2138440.png" alt="dogandcat" className='h-80 w-80' />
                                        </div>
                                    </div>
                                </>
                            )
                            :
                            (
                                <p>Error al mostrar los datos</p>
                            )
                    }
                </div>
                <hr className='my-4' />
                {Object.keys(mensaje).length > 0 && toast.success(mensaje.respuesta)}
                <div className='flex justify-between items-center'>
                    <p>Este submódulo te permite visualizar los tratamientos del paciente</p>
                    {
                        auth.rol === "veterinario" &&
                        (
                            <button className="px-5 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700" onClick={handleModal}>Registrar</button>
                        )
                    }
                </div>

                {modal && (<ModalTratamiento idPaciente={paciente._id} />)}
                {
                    tratamientos.length == 0 ?
                        <p >No existen registros</p>
                        :
                        <TablaTratamientos tratamientos={tratamientos} />
                }
            </div>

        </>

    )
}

export default Visualizar