import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { MoreHorizontal, Reply, Trash2, Pencil } from "lucide-react";
import { useAuthStore } from "../../Chat/store/useAuthStore";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
const formatTimestamp = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };
  const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };

  // Comparar fechas sin hora
  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return `hoy a las ${date.toLocaleTimeString('es-ES', optionsTime)}`;
  }
  if (isYesterday) {
    return `ayer a las ${date.toLocaleTimeString('es-ES', optionsTime)}`;
  }
  return `${date.toLocaleDateString('es-ES', optionsDate)} ${date.toLocaleTimeString('es-ES', optionsTime)}`;
};
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
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/comentarios/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const formattedComments = response.data.map((comment) => ({
          id: comment._id,
          content: comment.comentario,
          author: {
            name: comment.usuario.usuario,
            avatar: comment.usuario.fotoPerfil.url,
            color: "bg-purple-500",
          },
          replyTo: comment.replyTo?._id,
          isDeletedParent: comment.isDeletedParent,
          timestamp: formatTimestamp(comment.fecha_creacion),
          isNew:
            Date.now() - new Date(comment.fecha_creacion).getTime() < 300000, // Nuevo si es menor a 5min
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
  }, [id, token]);

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
          replyTo: replyingTo,
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
        replyTo: response.data.replyTo?._id,
        isDeletedParent: response.data.isDeletedParent,
        timestamp: formatTimestamp(new Date()),
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
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/comentarios/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
          <div
            key={message.id}
            className={`group relative ${
              message.replyTo ? "ml-8 border-l-2 border-gray-600 pl-4" : ""
            }`}
          >
            {message.replyTo && (
            <div className="mb-1 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Reply className="w-3 h-3" />
                <span>Respondiendo a </span>
                <span className="font-medium text-purple-400">
                  @{messages.find((m) => m.id === message.replyTo)?.author.name || "[Eliminado]"}
                </span>
              </div>
              <p className="ml-5 text-gray-300 truncate">
                "{messages.find((m) => m.id === message.replyTo)?.content || "Mensaje eliminado"}"
              </p>
            </div>
          )}

            <div className="flex items-start gap-4 group">
              <div className="avatar">
                <div className="w-10 h-10 rounded-full">
                  <img
                    src={message.author.avatar || "/placeholder.svg"}
                    alt={message.author.name}
                    className="object-cover"
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

              {authUser._id === message.userId ||
              authUser.rol === "Administrador" ? (
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-800 text-gray-100">
                  <DropdownMenuItem onClick={() => setEditingId(message.id)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(message.id)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setReplyingTo(message.id)}>
                    <Reply className="w-4 h-4 mr-2" />
                    Reply
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              ) : (
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-800 text-gray-100">
                  <DropdownMenuItem onClick={() => setReplyingTo(message.id)}>
                    <Reply className="w-4 h-4 mr-2" />
                    Reply
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-gray-700">
        {replyingTo && (
          <div className="flex items-center gap-2 p-2 mb-2 text-sm text-gray-400 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-1 flex-1">
              <Reply className="w-4 h-4" />
              <span>Respondiendo a </span>
              <span className="font-medium text-purple-400">
              @{messages.find((m) => m.id === replyingTo)?.author.name || "[Eliminado]"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="btn btn-ghost btn-xs btn-circle hover:bg-gray-700"
            >
              ×
            </button>
          </div>
        )}

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
