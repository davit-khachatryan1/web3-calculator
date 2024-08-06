import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { calculationResult, callAll, data } from "../helpers/clearing";
import { useAuthContext } from "./AuthContext";
import { getUserCoinsCalculations } from "../services/coinsCalculationsService";

export type RowData = {
  id: string;
  data: GeneralData;
  results: typeof calculationResult;
  name: string
};

export type GeneralData = {
  [key: string]: number;
};

type DataContextType = {
  rows: RowData[];
  generalData: GeneralData;
  addRow: () => void;
  deleteRow: (id: string) => void;
  updateRow: (id: string, updatedData: any) => void;
  triggerCalculations: (data: RowData[]) => void;
  changeGeneralData: (item: string, value: number) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();
  const [rows, setRows] = useState<RowData[]>([]);
  const [generalData, setGeneralData] = useState<GeneralData>({
    ...data,
  });

  const fetchUserCoinsCalculations = async () => {
    if (user && Object.keys(user).length !== 0) {
      const data = await getUserCoinsCalculations(user.userId);
      setRows(data);
    }
  };

  useEffect(() => {
    fetchUserCoinsCalculations();
  }, [user]);

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
    accumulatedBalance: any,
    length: any
  ) => {
    
    const data = accumulatedBalance /length;
    const price =
      data /
      (results.data.D4 +
        results.data.E4);

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
      id: uuidv4(),
      data: data,
      results: { ...calculationResult },
      name: ''
    };
    setRows((prevRows) => [...prevRows, newRow]);
    setGeneralData((prevGeneralData) => {
      return { ...prevGeneralData, 'E242': rows.length + 1 };
    });
  };

  const deleteRow = (id: string) => {
    const newRows = rows.filter((row) => row.id !== id);
    setRows(newRows);
    let longShorts = {
      'CG4': 0,
      'CH4': 0,
    };

    triggerCalculations(newRows)
  };

  const updateRow = (id: string, updatedData: any) => {
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
    for (let i = 0; i < rows.length; ++i) {
      const row = rows[i];
      const rowData = { ...row.data, "A242": generalData.A242, "D244": generalData.D244, 'E242': generalData['E242'] };
      const { calculationResults, rowBigData } = callAll(
        row.results,
        rowData,
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
      const aa =  updatedRows[updatedRows.length - 1]?.data["B242"] >= generalData["D244"]
      ? generalData["A242"] - updatedRows[updatedRows.length - 1].data["B242"]
      : generalData["A242"] - generalData["D244"];
      // debugger
      return aa
    };
    const accumulatedBalance = calculateAccumulatedBalance();
    const averagedRationalTradingMargin =
      calculateAveragedRationalTradingMargin(
        updatedRows.map((row) => row.results)
      );
    const accumulatedBalanceForPosition =
      calculateAccumulatedBalanceForPosition(updatedRows, accumulatedBalance);
      
      let newUpdatedRows = []
      for (const row of updatedRows) {
        const priceAccordingAccumulatedBalance = calculatePriceAccordingAccumulatedBalance(row,accumulatedBalance,updatedRows.length)
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
  
    setGeneralData({
      ...generalData,
      E242: updatedRows.length,
      CG4: longShorts["CG4"],
      CH4: longShorts["CH4"],
      accumulatedBalance:
        accumulatedBalance || generalData["A242"] - generalData["D244"],
    });
console.log(newUpdatedRows, 'eslel karevor');

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
