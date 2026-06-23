import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('accessToken'),

  login: (userData, token) => {
    localStorage.setItem('accessToken', token);
    set({ user: userData, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    set({ user: null, isAuthenticated: false });
  },

  setUser: (userData) => set({ user: userData }),
}));

export default useAuthStore;
