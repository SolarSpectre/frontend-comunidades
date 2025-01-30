import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { axiosInstance } from "../lib/axios.js";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      authUser: null,
      token: null, // Remove localStorage.getItem since persist will handle this
      isCheckingAuth: true,
      onlineUsers: [],
      socket: null,
      setToken: (newToken) => {
        set({ token: newToken });
      },
      checkAuth: async () => {
        try {
          const token = get().token;
          if (!token) {
            throw new Error("No token found");
          }
          const res = await axiosInstance.get("/estudiante/perfil", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          set({ authUser: res.data });
          get().connectSocket();
        } catch (error) {
          console.log("Error in checkAuth:", error);
          set({ authUser: null, token: null });
        } finally {
          set({ isCheckingAuth: false });
        }
      },
      login: async (data) => {
        try {
          const res = await axiosInstance.post("/estudiante/login", data);
          set({ authUser: res.data });
          set({ token: res.data.token });
          get().connectSocket();
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isLoggingIn: false });
        }
      },
      connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL, {
          query: {
            userId: authUser._id,
          },
        });
        socket.connect();
        set({ socket: socket });
        socket.on("getOnlineUsers", (userIds) => {
          set({ onlineUsers: userIds });
        });
      },
      disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
      },
    }),
    {
      name: "auth-storage", // unique name for the storage
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({
        // only persist these states
        authUser: state.authUser,
        token: state.token,
      }),
    }
  )
);
