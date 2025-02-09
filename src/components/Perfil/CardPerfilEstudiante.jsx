import { useEffect } from "react";
import { useAuthStore } from "../../Chat/store/useAuthStore";

export const CardPerfilEstudiante = () => {
  const { checkAuth,authUser } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return (
    <div
      className="bg-white border border-slate-200 h-auto p-4 
                        flex flex-col items-start justify-between shadow-xl rounded-lg min-w-[300px] flex-grow max-w-full"
    >
      <div className="self-start mb-4">
        <img
          src={
            authUser?.fotoPerfil.url ||
            "https://cdn-icons-png.flaticon.com/512/4715/4715329.png"
          }
          alt="img-client"
          className="m-auto rounded-3xl"
          width={120}
          height={120}
        />
      </div>
      <div className="self-start mb-2">
        <b>Nombre:</b>
        <p className="inline-block ml-3">{authUser.nombre}</p>
      </div>
      <div className="self-start mb-2">
        <b>Usuario:</b>
        <p className="inline-block ml-3">{authUser.usuario}</p>
      </div>
      <div className="self-start mb-2">
        <b>Email:</b>
        <p className="inline-block ml-3">{authUser.email}</p>
      </div>
      <div className="self-start mb-2">
        <b>Universidad:</b>
        <p className="inline-block ml-3">{authUser.universidad}</p>
      </div>
      <div className="self-start mb-2">
        <b>Celular:</b>
        <p className="inline-block ml-3">{authUser.celular}</p>
      </div>
      <div className="self-start mb-2">
        <b>Carrera:</b>
        <p className="inline-block ml-3">{authUser.carrera}</p>
      </div>

      <div className="self-start mb-4">
        <b>Bio:</b>
        <p className="inline-block ml-3">{authUser.bio}</p>
      </div>

      <div className="self-start mb-4">
        <b>Intereses:</b>
        <ul className="mt-2">
          {authUser.intereses?.map((interes, index) => (
            <li key={index} className="ml-3">
              {interes}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
