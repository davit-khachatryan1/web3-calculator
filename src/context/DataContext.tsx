import React, { createContext, useState, useContext, ReactNode } from "react";
import { data } from "../helpers/calculationUtils";
import { calculationResult, callAll } from "../helpers/clearing";

type RowData = {
  id: number;
  data: typeof data;
  results: typeof calculationResult;
};

export type GeneralData = {
  [key: string]: number;
};

type DataContextType = {
  rows: RowData[];
  generalData: GeneralData;
  addRow: () => void;
  deleteRow: (id: number) => void;
  updateRow: (id: number, updatedData: any) => void;
  triggerCalculations: () => void;
  changeGeneralData: (item: string, value: number) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [rows, setRows] = useState<RowData[]>([
    { id: 1, data: data, results: { ...calculationResult } },
  ]);
  const [generalData, setGeneralData] = useState<GeneralData>({
    ...data,
  });

  const changeGeneralData = (item: string, value: number) => {
    setGeneralData({ ...generalData, [`${item}`]: value });
  };

  const calculateAveragedRationalTradingMargin = (results: any) => {
    const total = results.reduce(
      (sum: any, result: { result_F4: any }) => sum + result.result_F4,
      0
    );
    return results.length > 0 ? total / results.length : 0;
  };

  const calculateAccumulatedBalanceForPosition = (results: any) => {
    const total = results.reduce(
      (sum: any, result: { accumulatedBalance: any }) =>
        sum + result.accumulatedBalance,
      0
    );
    return results.length > 0 ? total / results.length : 0;
  };

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
    let genDataitems:GeneralData ={} as GeneralData;
    let updatedRows = rows.map((row) => {
      const { calculationResults, data } = callAll(row.results, row.data, rows);
      genDataitems = data

      return {
        ...row,
        results: calculationResults,
        data: { ...data, 'A242': generalData["A242"], 'D244': generalData["D244"] },
      };
    });
    const averagedRationalTradingMargin =
      calculateAveragedRationalTradingMargin(
        updatedRows.map((row) => row.results)
      );
    const accumulatedBalanceForPosition =
      calculateAccumulatedBalanceForPosition(
        updatedRows.map((row) => row.results)
      );      
      console.log(updatedRows, '<>??????????');
      
      setGeneralData({ ...generalData,'CG4': genDataitems["CG4"], 'CH4': genDataitems["CH4"], accumulatedBalance: accumulatedBalanceForPosition });
    updatedRows = rows.map((row) => ({
      ...row,
      results: {
        ...row.results,
        accumulatedBalanceForPosition,
        averagedRationalTradingMargin,
      },
    }));
    console.log(updatedRows, 'kkkkkkkkkkkkkk');
    
    setRows(updatedRows);
  };

  return (
    <DataContext.Provider
      value={{
        rows,
        generalData,
        addRow,
        deleteRow,
        updateRow,
        triggerCalculations,
        changeGeneralData,
      }}
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
