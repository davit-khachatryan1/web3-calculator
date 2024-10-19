import React, { createContext, useState, useContext, ReactNode } from "react";
import {
  saveCoinsCalculation,
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
  saveRowInBE: (updatedData: any) => void;
  deleteRowInBE: (id: string) => void;
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

  const saveRowInBE = async (updatedData: any) => {
    if (user) {
      const savedData = await saveCoinsCalculation(updatedData, user.userId);
      setRowsInBE((prevRows) => {
        const existingIndex = prevRows.findIndex(
          (row) => row.id === savedData.id
        );
        if (existingIndex >= 0) {
          const updatedRows = [...prevRows];
          updatedRows[existingIndex] = savedData;
          return updatedRows;
        } else {
          return [...prevRows, savedData];
        }
      });
    }
  };

  const deleteRowInBE = async (id: string) => {
    if (user) {
      await deleteCoinsCalculation(user.userId, id);
      setRowsInBE((prevRows) => prevRows.filter((row) => row.id !== id));
    }
  };

  return (
    <CoinsCalculationsContext.Provider
      value={{
        rowsInBE,
        saveRowInBE,
        deleteRowInBE,
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
