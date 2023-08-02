import { FC, createContext, useContext, useState } from 'react';

interface StateContextType {
  activeMenu: boolean;
  theme: string;
  setActiveMenu: (isActive: boolean) => void;
  setTheme: (newTheme: string) => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useStateContext must be used within a StateProvider');
  }
  return context;
};


interface StateProviderProps {
  children: React.ReactNode;
}

const StateProvider: FC<StateProviderProps> = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState<boolean>(true);
  const [theme, setTheme] = useState<string>('light');

  const stateContextValue: StateContextType = {
    activeMenu,
    theme,
    setActiveMenu,
    setTheme,
  };

  return (
    <StateContext.Provider value={stateContextValue}>
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
