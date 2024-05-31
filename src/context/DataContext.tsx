import React, { createContext, useState, useContext, ReactNode } from "react";
import { data, callAll } from "../helpers/calculationUtils";
import { calculationResult } from "../helpers/clearing";

type RowData = {
  id: number;
  data: typeof data;
  results: typeof calculationResult;
};

type DataContextType = {
  rows: RowData[];
  addRow: () => void;
  deleteRow: (id: number) => void;
  updateRow: (id: number, updatedData: any) => void;
  triggerCalculations: () => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [rows, setRows] = useState<RowData[]>([
    { id: 1, data: data, results: { ...calculationResult } },
  ]);

  const addRow = () => {
    const newRow = {
      id: rows.length + 1,
      data: data,
      results: { ...calculationResult },
    };
    setRows((prevRows) => [...prevRows, newRow]);
  };

  const deleteRow = (id: number) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const updateRow = (id: number, updatedData: any) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, data: updatedData } : row
      )
    );
  };

  const triggerCalculations = () => {
    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        results: callAll(row.data),
      }))
    );
  };

  return (
    <DataContext.Provider
      value={{ rows, addRow, deleteRow, updateRow, triggerCalculations }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};
