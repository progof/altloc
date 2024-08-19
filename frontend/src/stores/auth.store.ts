import { defineStore } from 'pinia';

interface AuthState {
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('isAuthenticated', {
  state: (): AuthState => ({
    isAuthenticated: false,
  }),

  actions: {
    setAuthenticated(value: boolean): void {
      this.isAuthenticated = value;
    },
  },
});