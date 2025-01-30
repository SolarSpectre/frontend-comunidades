import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./layout/Auth";
import Login from "./paginas/Login";
import { Register } from "./paginas/Register";
import { Forgot } from "./paginas/Forgot";
import { NotFound } from "./paginas/NotFound";
import Dashboard from "./layout/Dashboard";
import Listar from "./paginas/Listar";
import Visualizar from "./paginas/Visualizar";
import Crear from "./paginas/Crear";
import Actualizar from "./paginas/Actualizar";
import Perfil from "./paginas/Perfil";
import { Confirmar } from "./paginas/Confirmar";
import Restablecer from "./paginas/Restablecer";
import { PrivateRoute } from "./routes/PrivateRoute";
import { AuthProvider } from "./context/AuthProvider";
import PrivateRouteWithRole from "./routes/PrivateRouteWithRole";
import Chat from "./paginas/Chat";
import LandinPage from "./paginas/LandinPage";
import RegisterAdmin from "./paginas/RegisterAdmin";
import ForoComunidad from "./paginas/comunidades/Foro";
import { PerfilEstudiante } from "./paginas/PerfilEstudiante";
import ChatAmigos from "./Chat/pages/HomePage";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./Chat/store/useThemeStore";
import Configuracion from "./paginas/Configuracion";


function App() {
  const { theme } = useThemeStore();

  return (
    <>
      <BrowserRouter>
      <div data-theme={theme}>
        <Toaster />
        <AuthProvider>
          <Routes>
            <Route index element={<LandinPage />} />

            <Route path="/" element={<Auth />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot/:id" element={<Forgot />} />
              <Route path="confirmar/:token" element={<Confirmar />} />
              <Route
                path="recuperar-password/:token"
                element={<Restablecer />}
              />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route
              path="dashboard/*"
              element={
                <PrivateRoute>
                  <Routes>
                    <Route element={<Dashboard />}>
                      <Route index element={<Perfil />} />
                      <Route path="listar" element={<Listar />} />
                      <Route path="visualizar/:id" element={<Visualizar />} />
                      <Route path=":id/chat" element={<ForoComunidad />} />
                      <Route
                        path="crear"
                        element={
                          <PrivateRouteWithRole>
                            <Crear />
                          </PrivateRouteWithRole>
                        }
                      />
                      <Route
                        path="registro"
                        element={
                          <PrivateRouteWithRole>
                            <RegisterAdmin />
                          </PrivateRouteWithRole>
                        }
                      />
                      <Route path="actualizar/:id" element={<Actualizar />} />
                      <Route path="perfil/:id" element={<PerfilEstudiante />} />
                      <Route path="chat" element={<Chat />} />
                      <Route path="chat/amigos" element={<ChatAmigos />} />
                      <Route path="configuracion" element={<Configuracion />} />
                    </Route>
                  </Routes>
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
