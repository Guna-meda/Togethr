import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: null,
  authLoading: true,
  teams: [],
  setUser: (userData) => set({ user: userData }),
  clearUser: () => set({ user: null }),
  updateUser: (partialData) =>
    set((state) => ({
      user: { ...state.user, ...partialData },
    })),
  setAuthLoading: (loading) => set({ authLoading: loading }),
  setTeamss: (teams) => set({ teams }),
}));
