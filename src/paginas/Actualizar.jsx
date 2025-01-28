import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Formulario } from '../componets/Formulario'
import { useParams } from 'react-router-dom'

const Actualizar = () => {
    const [paciente, setPaciente] = useState([])
    const {id} = useParams()
    const consultarPaciente = async() => {
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
        <div>
            <h1 className='font-black text-4xl text-gray-500'>Actualizar Paciente</h1>
            <hr className='my-4' />
            <p className='mb-8'>Este módulo te permite actualizar los datos de un paciente registrado</p>
            {
                Object.keys(paciente).length != 0 ?
                    (
                        <Formulario paciente={paciente}/>
                    )
                    :
                    (
                        <p>No hay paciente</p>
                    )
            }
        </div>
    )
}

export default Actualizar