import { create } from 'zustand';

/** This store is used to share the connection state with all the components of the application */
export const useConectionStore = create((set) => ({
    /** @type {boolean} */
    isLogged: false,
    /** @param {boolean} logged */
    setLogged: (logged) => 
        set((state) => ({ 
            isLogged: logged 
        })),
    /** @type {boolean} */
    Connected: false,
    /** @param {boolean} connected */
    setConnected: (connected) =>
        set((state) => ({
            Connected: connected
        })),
}));