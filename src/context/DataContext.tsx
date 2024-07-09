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

  const calculatePriceAccordingAccumulatedBalance = (
    results: any,
    accumulatedBalance: any
  ) => {
    const data = accumulatedBalance / results.length;
    const price =
      data /
      (results[results.length - 1].results.result_D5 +
        results[results.length - 1].results.result_E5);
    return price;
  };

  const calculateAccumulatedBalanceForPosition = (
    results: any,
    accumulatedBalance: any
  ) => {
    return results.length > 0 ? accumulatedBalance / results.length : 0;
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

    let updatedRows:RowData[] =[];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const { calculationResults, rowBigData } = callAll(
        row.results,
        { ...row.data, "A242": generalData["A242"], "D244": generalData["D244"] },
        rows,
        i
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

    if (updatedRows.length > 1) {
      for (let i = 0; i < updatedRows.length; i++) {
        const row = updatedRows[i];
        row.data["B242"] = updatedRows[updatedRows.length - 1].data["B242"];
      }
    }

    const calculateAccumulatedBalance = () => {
      // console.log(generalData, 'KKKKKKKKK',updatedRows);

      const aa =  updatedRows[updatedRows.length - 1].data["B242"] >= generalData["D244"]
      ? generalData["A242"] - updatedRows[updatedRows.length - 1].data["B242"]
      : generalData["A242"] - generalData["D244"];
      // console.log(aa);
      return aa
    };
    const accumulatedBalance = calculateAccumulatedBalance();
    const priceAccordingAccumulatedBalance =
      calculatePriceAccordingAccumulatedBalance(
        updatedRows,
        accumulatedBalance
      );

    const averagedRationalTradingMargin =
      calculateAveragedRationalTradingMargin(
        updatedRows.map((row) => row.results)
      );
    const accumulatedBalanceForPosition =
      calculateAccumulatedBalanceForPosition(updatedRows, accumulatedBalance);
      
      let newUpdatedRows = []
      for (const row of updatedRows) {
        newUpdatedRows.push({
          ...row,
          results: {
            ...row.results,
            accumulatedBalance,
            priceAccordingAccumulatedBalance,
            accumulatedBalanceForPosition,
            averagedRationalTradingMargin,
          },
        });
      }
// console.log(accumulatedBalance, '++++++++++++++');

    setGeneralData({
      ...generalData,
      E242: updatedRows.length,
      CG4: longShorts["CG4"],
      CH4: longShorts["CH4"],
      accumulatedBalance:
        accumulatedBalance || generalData["A242"] - generalData["D244"],
    });
// console.log(newUpdatedRows, '>>>>>>');

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
