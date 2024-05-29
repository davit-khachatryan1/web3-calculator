import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Collapse,
  IconButton,
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
import { calculationResults, callAll, data } from "../helpers/calculationUtils";
import axios from "axios";
import "./table.css";

// Assuming calculateFormula and data structure is already defined elsewhere

export default function Row(props: { data?: any; onDelete?: () => void }) {

  const { onDelete } = props;
  const [open, setOpen] = useState(false);
  const [coinName, setCoinName] = useState("");
  const [inputValues, setInputValues] = useState(data);

  const [results, setResults] = useState({
    balancingOpen: 0,
    balancingClose: 0,
    longEntryPricePAC: 0,
    shortEntryPricePAC: 0,
    longSizePAC: 0,
    shortSizePAC: 0,
    burn: 0,
    openingLongCoefficient: 1,
    openingShortCoefficient: 1,
    closingLongCoefficient: 1,
    closingShortCoefficient: 1,
    rationalTradingMargin: 0,
    averagedRationalTradingMargin: 0,
    accumulatedBalanceForPosition: 0,
    priceAccordingToAccumulatedBalance: 0,
    quantityToOpenAfterBurn: 0,
    marginDifference: 0,
    leverage: 20, // Assuming leverage does not change often
  });

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

  useEffect(() => {
    const handleKeyDown = (event: { key: string }) => {
      if (event.key === "Enter") {
        callAll(inputValues);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [data]);

  useEffect(() => {
    const newData = {
      ...props.data, // assuming initial data is passed as props
      ...inputValues,
    };
    const newResults = {
      ...results,
      // balancingOpen: calculateFormula("Formula for Balancing Open", newData),
      // balancingClose: calculateFormula("Formula for Balancing Close", newData),
      // Add more calculations as needed
    };
    setResults(newResults);
  }, [inputValues]);

  const handleChange =
    (name: string) => (event: { target: { value: string } }) => {
      setInputValues((prev) => ({
        ...prev,
        [name]: parseFloat(event.target.value) || 0,
      }));
      console.log(inputValues, "ssssssssss");
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
                        value={inputValues.B4}
                        onChange={handleChange("B4")}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="C4"
                        value={inputValues.C4}
                        onChange={handleChange("C4")}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="D4"
                        value={inputValues.D4}
                        onChange={handleChange("D4")}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="E4"
                        value={inputValues.E4}
                        onChange={handleChange("E4")}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="G4"
                        value={inputValues.G4}
                        onChange={handleChange("G4")}
                        size="small"
                      />
                    </TableCell>
                    <TableCell colSpan={2}>
                      <Typography gutterBottom component="div">
                        {results.balancingOpen}
                      </Typography>
                    </TableCell>
                    <TableCell colSpan={2}>
                      <Typography gutterBottom component="div">
                        {results.balancingClose}
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
                        {calculationResults.result_B6}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {calculationResults.result_C6}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {calculationResults.result_D6}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {calculationResults.result_E6}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {calculationResults.result_M4}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TextField id="P4" defaultValue="0" size="small" />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="openShortInCorridor"
                        defaultValue="0"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField id="N4" defaultValue="0" size="small" />
                    </TableCell>
                    <TableCell>
                      <TextField id="O4" defaultValue="0" size="small" />
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
                        {calculationResults.result_B5}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {calculationResults.result_C5}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {calculationResults.result_D5}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {calculationResults.result_E5}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        546
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {calculationResults.result_H3}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {calculationResults.result_I3}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {calculationResults.result_J3}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {calculationResults.result_K3}
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
                        {calculationResults.result_F4}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        0
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div"></Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        0
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {calculationResults.result_T4}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography gutterBottom component="div">
                        {data["Y4"]}
                      </Typography>
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
