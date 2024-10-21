import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { calculationResult, callAll, data } from "../helpers/clearing";
import { useAuthContext } from "./AuthContext";
import { getUserCoinsCalculations } from "../services/coinsCalculationsService";
import { useCoinsCalculationsContext } from "./CoinsCalculationsContext";
import { getGeneralDataByUserId } from "../services/generalData";

export type RowData = {
  id: string;
  data: GeneralData;
  results: typeof calculationResult;
  name: string;
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
  triggerCalculations: (data: RowData[], generalData: GeneralData) => void;
  changeGeneralData: (item: GeneralData) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { deleteRowInBE } = useCoinsCalculationsContext();
  const { user } = useAuthContext();
  const [rows, setRows] = useState<RowData[]>([]);
  const [generalData, setGeneralData] = useState<GeneralData>({});

  const fetchUserCoinsCalculations = async (generalData: GeneralData) => {
    if (user && Object.keys(user).length !== 0) {
      const data = await getUserCoinsCalculations(user.userId);
      // triggerCalculations(data, generalData);
      setRows(data);
    }
  };

  const fetchGeneralData = async () => {
    const dataDB = await getGeneralDataByUserId(user.userId);

    setGeneralData({ ...data, ...dataDB });
    fetchUserCoinsCalculations({ ...data, ...dataDB });
  };

  useEffect(() => {
    if (user.userId) {
      fetchGeneralData();
    }
  }, [user]);

  const changeGeneralData = (item: any) => {
    setGeneralData({ ...generalData, ...item });
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
    const data = accumulatedBalance / length;
    const price = data / (results.data.D4 + results.data.E4);

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
      name: "",
    };
    setRows((prevRows) => [...prevRows, newRow]);
    setGeneralData((prevGeneralData) => {
      return { ...prevGeneralData, E242: rows.length + 1 };
    });
  };

  const deleteRow = (id: string) => {
    deleteRowInBE(id);
    const newRows = rows.filter((row) => row.id !== id);
    setRows(newRows);
    triggerCalculations(newRows, generalData);
  };

  const updateRow = (id: string, updatedData: any) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, data: updatedData } : row
      )
    );
  };

  const triggerCalculations = (
    rows: RowData[],
    generalData: GeneralData
  ): void => {
    let longShorts = {
      CG4: 0,
      CH4: 0,
    };
    let updatedRows: RowData[] = [];
    for (let i = 0; i < rows.length; ++i) {
      const row = rows[i];
      const rowData = {
        ...row.data,
        A242: generalData.A242,
        D244: generalData.D244,
        E242: generalData["E242"],
      };
      const { calculationResults, rowBigData } = callAll(
        row.results,
        rowData,
        rows,
        i
      );
      for (const key in rowBigData) {
        if (typeof rowBigData[key] === "function") {
          delete rowBigData[key];
        }
      }

      longShorts["CG4"] += rowBigData["CG4"];
      longShorts["CH4"] += rowBigData["CH4"];
      updatedRows.push({
        ...row,
        results: calculationResults,
        data: {
          ...rowBigData,
          A242: generalData["A242"],
          D244: generalData["D244"],
        },
      });
    }

    if (updatedRows.length > 1) {
      for (let i = 0; i < updatedRows.length; i++) {
        const row = updatedRows[i];
        row.data["B242"] = updatedRows[updatedRows.length - 1].data["B242"];
      }
    }
    const calculateMarginEQ = (updatedRows: RowData[]) => {
      return updatedRows.reduce(
        (sum: number, row: RowData) => sum + row.results.result_T4,
        0
      );
    };

    const calculateB242 = (updatedRows: RowData[], generalData: GeneralData) => {
      return updatedRows.reduce(
        (sum: number, row: RowData) => sum + row.results.result_BE4,
        generalData["A242"]
      );
    }

    const calculateAccumulatedBalance = () => {
      const B242 = calculateB242(updatedRows, generalData);
      const aa =
      B242 >= generalData["D244"]
          ? generalData["A242"] - B242
          : generalData["A242"] - generalData["D244"];

      return aa;
    };

    const accumulatedBalance = calculateAccumulatedBalance();
    const fullMarginEq = calculateMarginEQ(updatedRows);
    const averagedRationalTradingMargin =
      calculateAveragedRationalTradingMargin(
        updatedRows.map((row) => row.results)
      );
    const accumulatedBalanceForPosition =
      calculateAccumulatedBalanceForPosition(updatedRows, accumulatedBalance);

    let newUpdatedRows = [];
    for (const row of updatedRows) {
      const priceAccordingAccumulatedBalance =
        calculatePriceAccordingAccumulatedBalance(
          row,
          accumulatedBalance,
          updatedRows.length
        );
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
      fullMarginEq,
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
