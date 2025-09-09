import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  isGuestMode: boolean;
  setGuestMode: (isGuest: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationContext must be used within NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [isGuestMode, setIsGuestMode] = useState(false);

  const setGuestMode = (isGuest: boolean) => {
    setIsGuestMode(isGuest);
  };

  return (
    <NavigationContext.Provider value={{ isGuestMode, setGuestMode }}>
      {children}
    </NavigationContext.Provider>
  );
};
