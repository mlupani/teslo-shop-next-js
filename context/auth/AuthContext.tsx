import { createContext } from 'react'
import { IUser } from '../../interfaces'

type FormData = {
    email: string,
    password: string,
};

interface ContextProps {
    isLoggedIn: boolean;
    user?: IUser | undefined;
    onLogin: ({ email, password }: FormData) => Promise<boolean>;
    onRegister: ({ name, email, password }: { name: string, email: string, password: string }) => Promise<{ hasError: boolean, error?: string }>;
    onLogout: () => void;
}

export const AuthContext = createContext({} as ContextProps)
