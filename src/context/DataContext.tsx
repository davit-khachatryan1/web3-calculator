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
    console.log(results, '{{{{{{{{{');
    
    const total = results[results.length - 1].accumulatedBalance
    console.log(total, results.length , '55555555');
    
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
    const newRows = rows.filter((row) => row.id !== id);
    setRows(newRows);
    setGeneralData((prevGeneralData) => {
      return { ...prevGeneralData, E242: rows.length - 1 };
    });
    let longShorts = {
      'CG4': 0,
      'CH4': 0,
    };

    for (let i = 0; i < newRows.length; i++) {
      longShorts["CG4"] += newRows[i].data["CG4"];
      longShorts["CH4"] += newRows[i].data["CH4"];
  }
    setGeneralData({
      ...generalData,
      'CG4': longShorts["CG4"],
      'CH4': longShorts["CH4"],
    });
  };

  const updateRow = (id: number, updatedData: any) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, data: updatedData } : row
      )
    );
  };

  const triggerCalculations = (rows: RowData[]): void => {
    let longShorts = {
      'CG4': 0,
      'CH4': 0,
    };

    let updatedRows =[];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const { calculationResults, rowBigData } = callAll(
        row.results,
        { ...row.data, "A242": generalData["A242"], "D244": generalData["D244"] },
        rows
      );
      for (const key in rowBigData) {
        if (typeof rowBigData[key] === 'function') {
          delete rowBigData[key];
        }
      }
      
      longShorts["CG4"] += rowBigData["CG4"];
      longShorts["CH4"] += rowBigData["CH4"];
      updatedRows.push({
        ...row,
        results: calculationResults,
        data: { ...rowBigData, "A242": generalData["A242"], "D244": generalData["D244"], },
      });
    }

//     let updatedRows = rows.map((row) => {
//       const { calculationResults, rowBigData } = callAll(
//         row.results,
//         { ...row.data, "A242": generalData["A242"], "D244": generalData["D244"] },
//         rows
//       );

// console.log(data, 'LLLLLLLLLLLLLLLL');

//       longShorts["CG4"] += rowBigData["CG4"];
//       longShorts["CH4"] += rowBigData["CH4"];
//       return {
//         ...row,
//         results: calculationResults,
//         data: { ...rowBigData, "A242": generalData["A242"], "D244": generalData["D244"], },
//       };
//     });
    const averagedRationalTradingMargin =
      calculateAveragedRationalTradingMargin(
        updatedRows.map((row) => row.results)
      );
    const accumulatedBalanceForPosition =
      calculateAccumulatedBalanceForPosition(
        updatedRows.map((row) => row.results)
      );
      console.log(accumulatedBalanceForPosition, '>>>>>>>');
      
      let newUpdatedRows = []
      for (const row of updatedRows) {
        newUpdatedRows.push({
          ...row,
          results: {
            ...row.results,
            accumulatedBalanceForPosition,
            averagedRationalTradingMargin,
          },
        });
      }
console.log(longShorts,'??????????');

    setGeneralData({
      ...generalData,
      "E242": updatedRows.length,
      "CG4": longShorts["CG4"],
      "CH4": longShorts["CH4"],
      accumulatedBalance:
        updatedRows[updatedRows.length - 1].results.accumulatedBalance ||
        generalData["A242"] - generalData["D244"],
    });

    setRows(newUpdatedRows);
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
