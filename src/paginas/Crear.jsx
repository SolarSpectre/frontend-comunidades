import { Formulario } from '../components/ui/Formulario'

const Crear = () => {
    return (
        <div>
        <h1 className='font-black text-4xl text-gray-500'>Comunidades</h1>
        <hr className='my-4' />
        <p className='mb-8'>Este módulo te permite registrar una nueva comunidad</p>
        <Formulario />
        </div>
    )
}

export default Crear