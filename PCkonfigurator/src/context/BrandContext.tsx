import React, { createContext, useState, ReactNode } from "react";

type BrandProviderProps = {
    children: ReactNode; // ReactNode ermöglicht alle möglichen Arten von Kindern
};

type BrandContextType = {
    selectBrandCPU: any; // Typ von selectBrandCPU entsprechend deiner Anforderungen
    setSelectedBrandCPU: React.Dispatch<React.SetStateAction<any>>; // Dispatch-Typ für die useState-Funktion

    selectBrandGPU: any; 
    setSelectedBrandGPU: React.Dispatch<React.SetStateAction<any>>; 
};

export const BrandContext = createContext<BrandContextType | null>(null);

export const BrandProvider = ({ children }: BrandProviderProps) => {
    const [selectBrandCPU, setSelectedBrandCPU] = useState<any>("AMD");
    const [selectBrandGPU, setSelectedBrandGPU] = useState<any>("NVIDIA");

    return (
        <BrandContext.Provider value={{ selectBrandCPU, setSelectedBrandCPU, selectBrandGPU, setSelectedBrandGPU }}>
            {children}
        </BrandContext.Provider>
    );
};
