import { useContext } from "react"
import AuthContext from "../../context/AuthProvider"

export const CardPerfilPaciente = () => {
    const { auth } = useContext(AuthContext)
    return (
        <div className="bg-white border border-slate-200 h-auto p-4 
                        flex flex-col items-start justify-between shadow-xl rounded-lg min-w-[300px] flex-grow max-w-full">

            <div className="self-center mb-4">
                <img src={auth?.fotoPerfil||"https://cdn-icons-png.flaticon.com/512/4715/4715329.png"} alt="img-client" className="m-auto rounded-3xl" width={120} height={120} />
            </div>
            <div className="self-center">
                <b>Nombre del Paciente:</b><p className="inline-block ml-3">{auth.nombre}</p>
            </div>
            <div className="self-center">
                <b>Nombre del Propietario:</b><p className="inline-block ml-3">{auth.propietario}</p>
            </div >
            <div className="self-center">
                <b>Email del Propietario:</b><p className="inline-block ml-3">{auth.emailP}</p>
            </div>
            <div className="self-center">
                <b>Celular del Propietario:</b><p className="inline-block ml-3">{auth.celular}</p>
            </div>
            <div className="self-center">
                <b>Convencional del Propietario::</b><p className="inline-block ml-3">{auth.convencional}</p>
            </div>
        </div>
    )
}