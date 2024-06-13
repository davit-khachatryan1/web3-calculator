import React, { createContext, useState, useContext, ReactNode } from "react";
import { calculationResult, callAll, data } from "../helpers/clearing";

export type RowData = {
  id: number;
  data: GeneralData;
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
  triggerCalculations: (data: RowData[]) => void;
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
    setGeneralData((prevGeneralData) => {
      return { ...prevGeneralData, 'E242': rows.length + 1 };
    });
  };

  const deleteRow = (id: number) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    setGeneralData((prevGeneralData) => {
      return { ...prevGeneralData, 'E242': rows.length - 1 };
    });
  };

  const updateRow = (id: number, updatedData: any) => {
    console.log(id,updatedData,'>111111111111111>');
    
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, data: updatedData } : row
      )
    );
  };

  const triggerCalculations = (rows: RowData[]): void => {
    let genDataitems: GeneralData = {} as GeneralData;
    let longShorts= {
      "CG4":0,
      "CH4":0
    }

    console.log(rows, '>>>>>>>>>>>>');
    
    let updatedRows = rows.map((row) => {
      const { calculationResults, data } = callAll(row.results, {...row.data, 'A242': generalData["A242"], 'D244': generalData["D244"] }, rows);
      genDataitems = data
      
      longShorts["CG4"] += data["CG4"];
      longShorts["CH4"] += data["CH4"];
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
      updatedRows = rows.map((row) => ({
        ...row,
        results: {
          ...row.results,
          accumulatedBalanceForPosition,
          averagedRationalTradingMargin,
        },
      }));
      
      setGeneralData({ ...generalData,"E242": updatedRows.length,'CG4':longShorts["CG4"], 'CH4':longShorts["CH4"], accumulatedBalance: accumulatedBalanceForPosition });
    
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
