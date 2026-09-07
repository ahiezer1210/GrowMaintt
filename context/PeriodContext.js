import { createContext, useContext, useState } from "react";

const PeriodContext = createContext();

export function PeriodProvider({ children }) {
  // Por defecto se muestran los 3 periodos
  const [selectedPeriods, setSelectedPeriods] = useState([
    "daily",
    "weekly",
    "monthly",
  ]);

  return (
    <PeriodContext.Provider value={{ selectedPeriods, setSelectedPeriods }}>
      {children}
    </PeriodContext.Provider>
  );
}

export function usePeriods() {
  return useContext(PeriodContext);
}