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
  id: number;
  data: GeneralData;
  results: any;
};

export type GeneralData = {
  [key: string]: number;
};

interface CoinsCalculationsContextType {
  rowsInBE: RowData[];
  addRowInBE: () => void;
  deleteRowInBE: (id: number) => void;
  updateRowInBE: (id: number, updatedData: any) => void;
  // fetchUserCoinsCalculations: () => void;
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

  // const fetchUserCoinsCalculations = async () => {
  //   if (user) {
  //     const data = await getUserCoinsCalculations('66699df26afee391d5992d24');
  //     setRowsInBE(data);
  //   }
  // };

  // useEffect(() => {
  //   fetchUserCoinsCalculations();
  // }, [user]);

  const addRowInBE = async () => {
    if (user) {
      const newRow = {
        id: rowsInBE.length + 1,
        data: {},
        results: {},
        userId: user.userId,
      };
      await addCoinsCalculation(newRow);
      setRowsInBE((prevRows) => [...prevRows, newRow]);
    }
  };

  const deleteRowInBE = async (id: number) => {
    if (user) {
      await deleteCoinsCalculation(user.userId, id);
      setRowsInBE((prevRows) => prevRows.filter((row) => row.id !== id));
    }
  };

  const updateRowInBE = async (id: number, updatedData: any) => {
    
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
        // fetchUserCoinsCalculations,
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
