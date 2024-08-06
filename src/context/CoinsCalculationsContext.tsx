import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import {
  addCoinsCalculation,
  getUserCoinsCalculations,
  updateCoinsCalculation,
  deleteCoinsCalculation,
} from "../services/coinsCalculationsService";
import { useAuthContext } from "./AuthContext";

export type RowData = {
  id: string;
  data: GeneralData;
  results: any;
};

export type GeneralData = {
  [key: string]: number;
};

interface CoinsCalculationsContextType {
  rowsInBE: RowData[];
  addRowInBE: (updatedData: any) => void;
  deleteRowInBE: (id: string) => void;
  updateRowInBE: (id: string, updatedData: any) => void;
}

const CoinsCalculationsContext = createContext<
  CoinsCalculationsContextType | undefined
>(undefined);

export const CoinsCalculationsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useAuthContext();
  const [rowsInBE, setRowsInBE] = useState<RowData[]>([]);

  const addRowInBE = async (updatedData: any) => {
    if (user) {
      await addCoinsCalculation(updatedData, user.userId);
      setRowsInBE((prevRows) => [...prevRows, updatedData]);
    }
  };

  const deleteRowInBE = async (id: string) => {
    if (user) {
      await deleteCoinsCalculation(user.userId, id);
      setRowsInBE((prevRows) => prevRows.filter((row) => row.id !== id));
    }
  };

  const updateRowInBE = async (id: string, updatedData: any) => {
    if (user) {
      await updateCoinsCalculation(user.userId, id, updatedData);
      setRowsInBE((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, data: updatedData } : row
        )
      );
    }
  };

  return (
    <CoinsCalculationsContext.Provider
      value={{
        rowsInBE,
        addRowInBE,
        deleteRowInBE,
        updateRowInBE,
      }}
    >
      {children}
    </CoinsCalculationsContext.Provider>
  );
};

export const useCoinsCalculationsContext = () => {
  const context = useContext(CoinsCalculationsContext);
  if (!context) {
    throw new Error(
      "useCoinsCalculationsContext must be used within a CoinsCalculationsProvider"
    );
  }
  return context;
};
