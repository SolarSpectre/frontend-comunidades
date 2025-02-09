import { useAuthStore } from "../../Chat/store/useAuthStore"

export const CardPerfil = () => {
    const { authUser } = useAuthStore()
    return (
        <div className="bg-white border border-slate-200 h-auto p-4 
                        flex flex-col items-center justify-between shadow-xl rounded-lg">

            <div>
                <img src="https://cdn-icons-png.flaticon.com/512/4715/4715329.png" alt="img-client" className="m-auto " width={120} height={120} />
            </div>
            <div className="self-start">
                <b>Nombre:</b><p className="inline-block ml-3">{authUser.nombre}</p>
            </div>
            <div className="self-start">
                <b>Apellido:</b><p className="inline-block ml-3">{authUser.apellido}</p>
            </div >
            <div className="self-start">
                <b>Dirección:</b><p className="inline-block ml-3">{authUser.direccion}</p>
            </div>
            <div className="self-start">
                <b>Teléfono:</b><p className="inline-block ml-3">{authUser.telefono}</p>
            </div>
            <div className="self-start">
                <b>Email:</b><p className="inline-block ml-3">{authUser.email}</p>
            </div>
        </div>
    )
}