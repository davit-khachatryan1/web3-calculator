import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import "./table.css";
import { GeneralData, useDataContext } from "../context/DataContext";
import { useCoinsCalculationsContext } from "../context/CoinsCalculationsContext";
import { updateGeneralData } from "../services/generalData";
import { useAuthContext } from "../context/AuthContext";

type ErrorStates = {
  B4?: boolean;
  C4?: boolean;
  D4?: boolean;
  E4?: boolean;
  G4?: boolean;
  P4?: boolean;
  P5?: boolean;
  N4?: boolean;
  O4?: boolean;
};

export default function Row(props: {
  data?: any;
  results?: any;
  onDelete?: () => void;
  onUpdate?: (data: any) => void;
  genData: GeneralData;
  id: string;
  name: string;
}) {
  const { onDelete, data, results, onUpdate, id, name } = props;
  const { triggerCalculations, rows, generalData } = useDataContext();
  const { user } = useAuthContext();
  const { saveRowInBE } = useCoinsCalculationsContext();
  const [open, setOpen] = useState(false);
  const [coinName, setCoinName] = useState(name);
  const [inputValues, setInputValues] = useState(data);
  const [errorStates, setErrorStates] = useState<ErrorStates>({});

  let isMoreThanZiro: boolean;

  const handleChange =
    (name: string) => (event: { target: { value: string } }) => {
      const value = event.target.value.replace(/,/g,'');
      function isValidNumberWithSingleDot(str: string) {
        const trimmedStr = str.trim();
        const pattern = /^[0-9]+(\.[0-9]*)?$/;
        return pattern.test(trimmedStr) || trimmedStr === "";
      }

      const isValid = isValidNumberWithSingleDot(value);
      let updatedData = {
        ...inputValues,
      };

      if (isValid) {
        updatedData = {
          ...inputValues,
          [name]: value,
        };
      }
      setInputValues(updatedData);

      setErrorStates({
        ...errorStates,
        [name]: !isValid,
      });

      // if (isValid) {
      //   onUpdate && onUpdate(updatedData);
      // }
    };

  const convertValuesToNumbers = (
    obj: Record<string, any>
  ): Record<string, number> => {
    const result: Record<string, number> = {};
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        result[key] = Number(obj[key]) || 0;
      }
    }
    return result;
  };

  const handleKeyPress = (event: any) => {
    setInputValues({ ...inputValues, P4: 0, P5: 0, N4: 0, O4: 0 });
    if (event.key === "Enter") {
      const convertedValues = convertValuesToNumbers(inputValues);
      setInputValues(convertedValues);
      if (document.activeElement === event.target) {
        const result = rows.filter((row) => row.id == id);

        onUpdate && onUpdate({ ...convertedValues, ...result[0].data });
        const newRows = rows.map((row) => {
          return row.id === id
            ? {
                ...row,
                data: { ...row.data, ...convertedValues },
                name: coinName,
              }
            : row;
        });
        triggerCalculations(newRows, generalData);
        isMoreThanZiro = results.result_L2 > 0;
        if (
          inputValues.G4 <= inputValues.B4 &&
          inputValues.G4 >= inputValues.C4
        ) {
          setFinalBalance();
        }
        handleSave();
      }
    }
  };

  const autoCount = () => {
    const convertedValues = convertValuesToNumbers(inputValues);
    setInputValues(convertedValues);
    const result = rows.filter((row) => row.id == id);
    onUpdate && onUpdate({ ...convertedValues, ...result[0].data });
    const newRows = rows.map((row) => {
      return row.id === id
        ? {
            ...row,
            data: { ...row.data, ...convertedValues },
            name: coinName,
          }
        : row;
    });
    triggerCalculations(newRows, generalData);
    setFinalBalance();
  };

  const setFinalBalance = () => {
    const inp = inputValues;
    if (+inp.D4 > +inp.E4) {
      if (isMoreThanZiro) {
        if (inp.N4 === 0) {
          inp.N4 = results.result_L2;
        } else {
          inp.N4 = +inp.N4 + results.result_L2;
        }
        if (inp.P5 === 0) {
          inp.P5 = results.result_L4;
        } else {
          inp.P5 = +inp.P5 + results.result_L4;
        }
      } else {
        if (inp.O4 === 0) {
          inp.O4 = Math.abs(results.result_L2);
        } else {
          inp.O4 = +inp.O4 + Math.abs(+results.result_L2);
        }

        if (inp.P4 === 0) {
          inp.P4 = Math.abs(results.result_L4);
        } else {
          inp.P4 = +inp.P4 + Math.abs(results.result_L4);
        }
      }
    } else {
      if (isMoreThanZiro) {
        if (inp.O4 === 0) {
          inp.O4 = results.result_L2;
        } else {
          inp.O4 = +inp.O4 + results.result_L2;
        }
        if (inp.P4 === 0) {
          inp.P4 = results.result_L4;
        } else {
          inp.P4 = +inp.P4 + results.result_L4;
        }
      } else {
        if (inp.N4 === 0) {
          inp.N4 = Math.abs(results.result_L2);
        } else {
          inp.N4 = +inp.N4 + Math.abs(+results.result_L2);
        }

        if (inp.P5 === 0) {
          inp.P5 = Math.abs(results.result_L4);
        } else {
          inp.P5 = +inp.P5 + Math.abs(results.result_L4);
        }
      }
    }
    setInputValues(inp);
    if (
      Math.abs(results.result_L4) < 0.0001 &&
      Math.abs(results.result_L2) < 0.0001
    ) {
      return;
    }
    autoCount();
  };
  useEffect(() => {
    setInputValues({ ...inputValues, P4: 0, P5: 0, N4: 0, O4: 0 });
  }, [
    inputValues.G4,
    inputValues.B4,
    inputValues.C4,
    inputValues.D4,
    inputValues.E4,
  ]);

  const handleChangeCoinName = (e: any) => {
    setCoinName(e.target.value.toLowerCase().trim());
  };

  const valueChecking = (value: any) => {
    if (isNaN(value)) {
      return true;
    }
    if (value === null) {
      return true;
    }
    return false;
  };

  const handleSave = async () => {
    const updatedData = {
      data: inputValues,
      results,
      id,
      name: coinName,
    };

    try {
      await saveRowInBE(updatedData);
      await updateGeneralData(user.userId, {
        A242: generalData["A242"],
        D244: generalData["D244"],
        accumulatedBalance: generalData.accumulatedBalance,
        CG4: generalData["CG4"],
        CH4: generalData["CH4"],
        E242: generalData["E242"],
      });

      console.log("Data saved successfully");
    } catch (error) {
      console.error("Error saving data:", error);
      return;
    }
  };

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell sx={{ width: "5%" }}>
          <IconButton
            sx={{ width: "40px", height: "40px" }}
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" align="left">
          <TextField
            label="Name"
            id="name"
            size="small"
            value={coinName}
            onChange={handleChangeCoinName}
            autoComplete="off"
          />
        </TableCell>
        <TableCell className="buttons">
          <Button variant="contained" color="secondary" onClick={onDelete}>
            Delete
          </Button>
          {/* <Button variant="contained" color="secondary" onClick={handleSubmit}>
            Get Data
          </Button> */}
          {/* <Button variant="contained" color="secondary" onClick={handleSave}>
            Save
          </Button> */}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h4" gutterBottom component="div">
                {coinName}
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "green" }}>
                      Long Entry Price
                    </TableCell>
                    <TableCell sx={{ color: "red" }}>
                      Short Entry Price
                    </TableCell>
                    <TableCell sx={{ color: "green" }}>Long Size</TableCell>
                    <TableCell sx={{ color: "red" }}>Short Size</TableCell>
                    <TableCell>Market Price</TableCell>
                    <TableCell colSpan={2}>
                      Balancing If Open (averaging)
                    </TableCell>
                    <TableCell colSpan={2}>
                      Balancing If Close (averaging)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <TextField
                        id="B4"
                        onChange={handleChange("B4")}
                        size="small"
                        error={errorStates.B4}
                        helperText={errorStates.B4 ? "Invalid input" : ""}
                        value={inputValues.B4 || null}
                        onKeyPress={(event) => handleKeyPress(event)}
                        autoComplete="off"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="C4"
                        onChange={handleChange("C4")}
                        size="small"
                        error={errorStates.C4}
                        helperText={errorStates.C4 ? "Invalid input" : ""}
                        value={inputValues.C4 || null}
                        onKeyPress={(event) => handleKeyPress(event)}
                        autoComplete="off"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="D4"
                        onChange={handleChange("D4")}
                        size="small"
                        error={errorStates.D4}
                        helperText={errorStates.D4 ? "Invalid input" : ""}
                        value={inputValues.D4 || null}
                        onKeyPress={(event) => handleKeyPress(event)}
                        autoComplete="off"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="E4"
                        onChange={handleChange("E4")}
                        size="small"
                        error={errorStates.E4}
                        helperText={errorStates.E4 ? "Invalid input" : ""}
                        value={inputValues.E4 || null}
                        onKeyPress={(event) => handleKeyPress(event)}
                        autoComplete="off"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="G4"
                        onChange={handleChange("G4")}
                        size="small"
                        error={errorStates.G4}
                        helperText={errorStates.G4 ? "Invalid input" : ""}
                        value={inputValues.G4 || null}
                        onKeyPress={(event) => handleKeyPress(event)}
                        autoComplete="off"
                      />
                    </TableCell>
                    <TableCell colSpan={2}>
                      <Typography gutterBottom component="div">
                        {valueChecking(results.result_L4)
                          ? 0
                          : results.result_L4.toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell colSpan={2}>
                      <Typography gutterBottom component="div">
                        {valueChecking(results.result_L2)
                          ? 0
                          : results.result_L2.toFixed(3)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                    gutterBottom
                    component="div"
                  >
                    Position after opening (averaging)
                  </Typography>
                  <TableRow>
                    <TableCell sx={{ color: "green" }}>
                      Long Entry Price (PAO)
                    </TableCell>
                    <TableCell sx={{ color: "red" }}>
                      Short Entry Price (PAO)
                    </TableCell>
                    <TableCell sx={{ color: "green" }}>
                      Long Size (PAO)
                    </TableCell>
                    <TableCell sx={{ color: "red" }}>
                      Short Size (PAO)
                    </TableCell>
                    <TableCell>Burn</TableCell>
                    <TableCell sx={{ color: "green" }}>
                      Opening Long In Corridor (averaging)
                    </TableCell>
                    <TableCell sx={{ color: "red" }}>
                      Opening Short In Corridor (averaging)
                    </TableCell>
                    <TableCell sx={{ color: "red" }}>
                      Close Long In Corridor
                    </TableCell>
                    <TableCell sx={{ color: "green" }}>
                      Close Short In Corridor
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Typography gutterBottom component="div">
                        {valueChecking(results.result_B6)
                          ? "0.000"
                          : results.result_B6.toFixed(7)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {valueChecking(results.result_C6)
                          ? "0.000"
                          : results.result_C6.toFixed(7)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {valueChecking(results.result_D6)
                          ? 0
                          : results.result_D6.toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {valueChecking(results.result_E6)
                          ? 0
                          : results.result_E6.toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {valueChecking(results.result_M4)
                          ? 0
                          : results.result_M4.toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="P4"
                        onChange={handleChange("P4")}
                        value={inputValues.P4.toFixed(3)}
                        size="small"
                        error={errorStates.P4}
                        helperText={errorStates.P4 ? "Invalid input" : ""}
                        onKeyPress={(event) => handleKeyPress(event)}
                        autoComplete="off"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="openShortInCorridor"
                        onChange={handleChange("P5")}
                        value={inputValues.P5.toFixed(3)}
                        size="small"
                        error={errorStates.P5}
                        helperText={errorStates.P5 ? "Invalid input" : ""}
                        onKeyPress={(event) => handleKeyPress(event)}
                        autoComplete="off"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="N4"
                        onChange={handleChange("N4")}
                        value={inputValues.N4.toFixed(3)}
                        size="small"
                        error={errorStates.N4}
                        helperText={errorStates.N4 ? "Invalid input" : ""}
                        onKeyPress={(event) => handleKeyPress(event)}
                        autoComplete="off"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="O4"
                        onChange={handleChange("O4")}
                        value={inputValues.O4.toFixed(3)}
                        size="small"
                        error={errorStates.O4}
                        helperText={errorStates.O4 ? "Invalid input" : ""}
                        onKeyPress={(event) => handleKeyPress(event)}
                        autoComplete="off"
                      />
                    </TableCell>
                  </TableRow>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                    gutterBottom
                    component="div"
                  >
                    Position after closing
                  </Typography>
                  <TableRow>
                    <TableCell sx={{ color: "green" }}>
                      Long Entry Price (PAC)
                    </TableCell>
                    <TableCell sx={{ color: "red" }}>
                      Short Entry Price (PAC)
                    </TableCell>
                    <TableCell sx={{ color: "green" }}>
                      Long Size (PAC)
                    </TableCell>
                    <TableCell sx={{ color: "red" }}>
                      Short Size (PAC)
                    </TableCell>
                    <TableCell>Quantity to open after burn</TableCell>
                    <TableCell>
                      Opening (averaging) coefficient for long
                    </TableCell>
                    <TableCell>
                      Opening (averaging) coefficient for short
                    </TableCell>
                    <TableCell>Closing coefficient for long</TableCell>
                    <TableCell>Closing coefficient for short</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Typography gutterBottom component="div">
                        {valueChecking(results.result_B5)
                          ? 0
                          : results.result_B5.toFixed(7)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {valueChecking(results.result_C5)
                          ? 0
                          : results.result_C5.toFixed(7)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {valueChecking(results.result_D5)
                          ? 0
                          : results.result_D5.toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {valueChecking(results.result_E5)
                          ? 0
                          : results.result_E5.toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {valueChecking(results.result_Q4)
                          ? 0
                          : results.result_Q4.toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {valueChecking(results.result_H3)
                          ? 0
                          : results.result_H3.toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {valueChecking(results.result_I3)
                          ? 0
                          : results.result_I3.toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {valueChecking(results.result_J3)
                          ? 0
                          : results.result_J3.toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {valueChecking(results.result_K3)
                          ? 0
                          : results.result_K3.toFixed(3)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Rational trading margin</TableCell>
                    <TableCell>Averaged rational trading margin</TableCell>
                    <TableCell>Acumulated balance for position</TableCell>
                    <TableCell>
                      Price according to accumulated balance
                    </TableCell>
                    <TableCell>Margin diference</TableCell>
                    <TableCell>Leverage</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Typography gutterBottom component="div">
                        {valueChecking(results.result_F4)
                          ? 0
                          : results.result_F4.toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {valueChecking(results.averagedRationalTradingMargin)
                          ? 0
                          : results.averagedRationalTradingMargin.toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {valueChecking(results.accumulatedBalanceForPosition)
                          ? 0
                          : results.accumulatedBalanceForPosition.toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {valueChecking(results.priceAccordingAccumulatedBalance)
                          ? "0.000"
                          : results.priceAccordingAccumulatedBalance.toFixed(6)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {valueChecking(results.result_T4)
                          ? 0
                          : results.result_T4.toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={inputValues["Y4"]}
                        onChange={(e) =>
                          setInputValues({
                            ...inputValues,
                            Y4: Number(e.target.value),
                          })
                        }
                      >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={30}>30</MenuItem>
                      </Select>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
