import { useContext } from "react"
import AuthContext from "../../context/AuthProvider"

export const CardPerfilEstudiante = () => {
    const { auth } = useContext(AuthContext)
    return (
        <div className="bg-white border border-slate-200 h-auto p-4 
                        flex flex-col items-start justify-between shadow-xl rounded-lg min-w-[300px] flex-grow max-w-full">

            <div className="self-start mb-4">
                <img src={auth?.fotoPerfil || "https://cdn-icons-png.flaticon.com/512/4715/4715329.png"} alt="img-client" className="m-auto rounded-3xl" width={120} height={120} />
            </div>
            <div className="self-start mb-2">
                <b>Nombre:</b><p className="inline-block ml-3">{auth.nombre}</p>
            </div>
            <div className="self-start mb-2">
                <b>Usuario:</b><p className="inline-block ml-3">{auth.usuario}</p>
            </div>
            <div className="self-start mb-2">
                <b>Email:</b><p className="inline-block ml-3">{auth.email}</p>
            </div>
            <div className="self-start mb-2">
                <b>Universidad:</b><p className="inline-block ml-3">{auth.universidad}</p>
            </div>
            <div className="self-start mb-2">
                <b>Celular:</b><p className="inline-block ml-3">{auth.celular}</p>
            </div>
            <div className="self-start mb-2">
                <b>Carrera:</b><p className="inline-block ml-3">{auth.carrera}</p>
            </div>

            <div className="self-start mb-4">
                <b>Bio:</b>
                <p className="inline-block ml-3">{auth.bio}</p>
            </div>

            <div className="self-start mb-4">
                <b>Intereses:</b>
                <ul className="mt-2">
                    {auth.intereses?.map((interes, index) => (
                        <li key={index} className="ml-3">{interes}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
