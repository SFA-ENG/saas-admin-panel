import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      userData: null,
      token: null,
      setUserData: ({ user, token }) => {
        set({ userData: user, token: token });
      },
      clearUserData: () => {
        set({ userData: null, token: null });
      },
    }),
    {
      name: "user-data",
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
