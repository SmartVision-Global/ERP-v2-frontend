import React, { createContext, useContext } from 'react';

const IdentificationContext = createContext({ group: null, nature: null });

export function IdentificationProvider({ children, group, nature }) {
  return (
    <IdentificationContext.Provider value={{ group, nature }}>
      {children}
    </IdentificationContext.Provider>
  );
}

export function useIdentification() {
  return useContext(IdentificationContext);
} 