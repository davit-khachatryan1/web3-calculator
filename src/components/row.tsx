import React, { useState } from "react";
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
import axios from "axios";
import "./table.css";
import { GeneralData, useDataContext } from "../context/DataContext";

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
}) {
  const { onDelete, data, results, onUpdate, genData } = props;
  const { changeGeneralData } = useDataContext();
  const [open, setOpen] = useState(false);
  const [coinName, setCoinName] = useState("");
  const [inputValues, setInputValues] = useState(data);
  const [errorStates, setErrorStates] = useState<ErrorStates>({});

  const [coinData, setCoinData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoinData = async () => {
    setLoading(true);
    setError(null);
    setCoinData(null);

    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets`,
        {
          params: {
            ids: coinName,
            vs_currency: "usd",
          },
        }
      );
      setCoinData(response.data[coinName]);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (coinName) {
      fetchCoinData();
    }
  };

  const handleChange = (name: string) => (event: { target: { value: string } }) => {
    const value = event.target.value;

    function isValidNumberWithSingleDot(str: string) {
      const trimmedStr = str.trim();
      const pattern = /^[0-9]+(\.[0-9]*)?$/;
      return pattern.test(trimmedStr);
    }
    
    const isValid = isValidNumberWithSingleDot(value);
    let updatedData = {
      ...inputValues,
    };

    if(isValid){
      updatedData = {
        ...inputValues,
        [name]: Number(value)
      };
    }
    setInputValues(updatedData);

    setErrorStates({
      ...errorStates,
      [name]: !isValid,
    });

    if (isValid) {
      onUpdate && onUpdate(updatedData);
    }
  };

  const handleChangeCoinName = (e: any) => {
    setCoinName(e.target.value.toLowerCase().trim());
  };

  return (
    <>
      {loading && <div>Loading</div>}
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
          />
        </TableCell>
        <TableCell className="buttons">
          <Button variant="contained" color="secondary" onClick={onDelete}>
            Delete
          </Button>
          <Button variant="contained" color="secondary" onClick={handleSubmit}>
            Get Data
          </Button>
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
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="C4"
                        onChange={handleChange("C4")}
                        size="small"
                        error={errorStates.C4}
                        helperText={errorStates.C4 ? "Invalid input" : ""}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="D4"
                        onChange={handleChange("D4")}
                        size="small"
                        error={errorStates.D4}
                        helperText={errorStates.D4 ? "Invalid input" : ""}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="E4"
                        onChange={handleChange("E4")}
                        size="small"
                        error={errorStates.E4}
                        helperText={errorStates.E4 ? "Invalid input" : ""}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="G4"
                        onChange={handleChange("G4")}
                        size="small"
                        error={errorStates.G4}
                        helperText={errorStates.G4 ? "Invalid input" : ""}
                      />
                    </TableCell>
                    <TableCell colSpan={2}>
                      <Typography gutterBottom component="div">
                        {(results.result_L4).toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell colSpan={2}>
                      <Typography gutterBottom component="div">
                        {(results.result_L2).toFixed(3)}
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
                        {(results.result_B6).toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {(results.result_C6).toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {(results.result_D6).toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {(results.result_E6).toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {(results.result_M4).toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="P4"
                        defaultValue="0"
                        onChange={handleChange("P4")}
                        size="small"
                        error={errorStates.P4}
                        helperText={errorStates.P4 ? "Invalid input" : ""}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="openShortInCorridor"
                        defaultValue="0"
                        onChange={handleChange("P5")}
                        size="small"
                        error={errorStates.P5}
                        helperText={errorStates.P5 ? "Invalid input" : ""}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="N4"
                        defaultValue="0"
                        onChange={handleChange("N4")}
                        size="small"
                        error={errorStates.N4}
                        helperText={errorStates.N4 ? "Invalid input" : ""}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="O4"
                        defaultValue="0"
                        onChange={handleChange("O4")}
                        size="small"
                        error={errorStates.O4}
                        helperText={errorStates.O4 ? "Invalid input" : ""}
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
                      {(results.result_B5).toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                      {(results.result_C5).toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                      {(results.result_D5).toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                      {(results.result_E5).toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                      {(results.result_Q4).toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {(results.result_H3 || 1).toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {(results.result_I3 || 1).toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {(results.result_J3 || 1).toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {(results.result_K3 || 1).toFixed(3)}
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
                        {(results.result_F4).toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {(results.averagedRationalTradingMargin).toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {(results.accumulatedBalanceForPosition).toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {(results.priceAccordingAccumulatedBalance).toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {(results.result_T4).toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={genData["Y4"]}
                        onChange={(e) =>
                          changeGeneralData("Y4", Number(e.target.value))
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
