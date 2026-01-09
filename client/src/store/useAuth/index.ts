import { create } from "zustand";
import checkAuthApi from "./checkAuth.api";
import signinApi from "./signin.api";
import signoutApi from "./signout.api";
import signupApi from "./signup.api";

type AuthState = {
    userId: number | null;
    isAuth: boolean;
    isLoading: boolean;
    error: string | null;

    checkAuth: () => Promise<void>;
    signin: (body: { login: string; password: string }) => Promise<void>;
    signout: () => Promise<void>;
    signup: (user: { login: string; password: string, email: string, name: string }) => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => {
    //     userId: null,
    //     isAuth: false,
    //     isLoading: true,
    //     error: null,
    //     checkAuth: async () => {
    //         set({ isLoading: true, error: null });
    //         try {
    //             const user = await checkAuthApi();
    //             set({ userId: user, isAuth: true, isLoading: false });
    //         } catch {
    //             set({ userId: null, isAuth: false, isLoading: false });
    //         }
    //     },
    //     signin: async (body: { login: string; password: string }) => {
    //         set({ error: null });
    //         await signinApi(body);       
    //         await (useAuthStore.getState().checkAuth());   
    //     },

    //     signout: async () => {
    //         await signoutApi();
    //         set({ userId: null, isAuth: false });
    //     },

    //     signup: async (body : { login: string; password: string, email: string, name: string }) => {
    //         const signupResponse = await signupApi(body); 
    //         set({ userId: signupResponse, isAuth: true });
    //         await (useAuthStore.getState().checkAuth());   
    //     }
    // }
    const setLoading = (isLoading: boolean) => set({ isLoading });
    const setError = (error: string | null) => set({ error });
    const setAuthed = (userId: number) => set({ userId, isAuth: true, isLoading: false, error: null });
    const setGuest = () => set({ userId: null, isAuth: false, isLoading: false });

    return {
        userId: null,
        isAuth: false,
        isLoading: true,
        error: null,
        checkAuth: async () => {
            setLoading(true);
            setError(null);
            try {
                const user = await checkAuthApi();
                setAuthed(user);
            } catch {
                setGuest();
            }
        },
        signin: async (body) => {
            setLoading(true);
            setError(null);
            try {
                await signinApi(body);
                await get().checkAuth();
            } catch (e: any) {
                set({ isLoading: false, error: e?.message ?? "Ошибка входа" });
                throw e;
            }
        },
        signout: async () => {
            setLoading(true);
            setError(null);
            try {
                await signoutApi();
                setGuest();
            } catch (e: any) {
                set({ isLoading: false, error: e?.message ?? "Ошибка выхода" });
                throw e;
            }
        },
        signup: async (body) => {
            setLoading(true);
            setError(null);
            try {
                await signupApi(body);      
                await get().checkAuth();    
            } catch (e: any) {
                set({ isLoading: false, error: e?.message ?? "Ошибка регистрации" });
                throw e;
            }
        },
    };
}); 