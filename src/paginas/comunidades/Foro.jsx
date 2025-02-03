import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { MoreHorizontal, Reply, Trash2, Pencil } from "lucide-react";
import { useAuthStore } from "../../Chat/store/useAuthStore";

const ForoComunidad = () => {
  const { id } = useParams();
  const { authUser, token } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Obtener comentarios de la comunidad
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/comentarios/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        const formattedComments = response.data.map((comment) => ({
          id: comment._id,
          content: comment.comentario,
          author: {
            name: comment.usuario.usuario,
            avatar: comment.usuario.fotoPerfil.url,
            color: "bg-purple-500",
          },
          timestamp: new Date(comment.fecha_creacion).toLocaleString(),
          isNew:
            Date.now() - new Date(comment.fecha_creacion).getTime() < 86400000, // Nuevo si es menor a 24h
          userId: comment.usuario._id,
        }));
        setMessages(formattedComments);
      } catch (error) {
        toast.error("Error al cargar comentarios");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [id]);

  // Enviar nuevo comentario
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/comentarios`,
        {
          comunidad: id,
          usuario: authUser._id,
          comentario: newMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newComment = {
        id: response.data._id,
        content: response.data.comentario,
        author: {
          name: authUser.usuario,
          avatar: authUser.fotoPerfil.url,
          color: "bg-blue-500",
        },
        timestamp: new Date().toLocaleString(),
        isNew: true,
        userId: authUser._id,
      };

      setMessages([...messages, newComment]);
      setNewMessage("");
      setReplyingTo(null);
      toast.success("Comentario publicado");
    } catch (error) {
      toast.error("Error al publicar comentario");
    }
  };

  // Editar comentario
  const handleEdit = async (id, newContent) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/comentarios/${id}`,
        { comentario: newContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(
        messages.map((msg) =>
          msg.id === id ? { ...msg, content: newContent } : msg
        )
      );
      setEditingId(null);
      toast.success("Comentario actualizado");
    } catch (error) {
      toast.error("Error al actualizar comentario");
    }
  };

  // Eliminar comentario
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/comentarios/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessages(messages.filter((msg) => msg.id !== id));
      toast.success("Comentario eliminado");
    } catch (error) {
      toast.error("Error al eliminar comentario");
    }
  };

  if (loading) return <div>Cargando comentarios...</div>;

  return (
    <div className="flex flex-col h-screen bg-[#313338] text-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="group relative">
            <div className="flex items-start gap-4 group">
              <div className="avatar">
                <div className="w-10 h-10 rounded-full">
                  <img
                    src={message.author.avatar || "/placeholder.svg"}
                    alt={message.author.name}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{message.author.name}</span>
                  <span className="text-sm text-gray-400">
                    {message.timestamp}
                  </span>
                  {message.isNew && (
                    <div className="badge badge-info">NUEVO</div>
                  )}
                </div>
                {editingId === message.id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const input = e.target.elements.edit;
                      handleEdit(message.id, input.value);
                    }}
                  >
                    <input
                      name="edit"
                      defaultValue={message.content}
                      className="input input-bordered w-full mt-1 bg-gray-700"
                      autoFocus
                    />
                  </form>
                ) : (
                  <p className="mt-1">{message.content}</p>
                )}
              </div>
              {(authUser._id === message.userId ||
                authUser.rol === "Administrador") && (
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="btn btn-ghost btn-circle opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-gray-800 rounded-box w-52"
                  >
                    <li>
                      <button onClick={() => setEditingId(message.id)}>
                        <Pencil className="w-4 h-4" />
                        Editar
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleDelete(message.id)}>
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="p-4 bg-gray-700">
        <div className="flex gap-4">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="input input-bordered flex-1 bg-gray-600"
          />
          <button type="submit" className="btn btn-primary">
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForoComunidad;
