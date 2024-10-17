import React, { createContext, useState, ReactNode } from "react";

type AuthProviderProps = {
    children: ReactNode; // ReactNode ermöglicht alle möglichen Arten von Kindern
};

type AuthContextType = {
    isLoggedIn: any; // Typ von selectBrandCPU entsprechend deiner Anforderungen
    setLogin: React.Dispatch<React.SetStateAction<any>>; // Dispatch-Typ für die useState-Funktion

     
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLoggedIn, setLogin] = useState<any>(false);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setLogin }}>
            {children}
        </AuthContext.Provider>
    );
};


