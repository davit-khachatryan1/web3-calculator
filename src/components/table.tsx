import React, { useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TextField,
  Typography,
} from "@mui/material";
import { useDataContext } from "../context/DataContext";
import Row from "./row";

const Calculator = () => {
  const {
    rows,
    generalData,
    addRow,
    deleteRow,
    updateRow,
    triggerCalculations,
    changeGeneralData,
  } = useDataContext();

  const handleKeyPress = (event: any) => {
    console.log('ashxatescccccccc');
    
    if (event.key === "Enter") {
      triggerCalculations(rows);
    }
  };

  return (
    <Box
      sx={{
        padding: "10px",
        width: "100vw",
        height: "100vh",
        display: "flex",
        backgroundColor: "#282c34",
        flexDirection: "column",
        backgroundImage:
          "url(https://as1.ftcdn.net/v2/jpg/05/74/79/80/1000_F_574798026_iEIdURVR3yieUYcn2tQYakrSYB999s5k.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "nowrap",
          color: "white",
          alignItems: "center",
          gap: "10px",
          padding: "10px",
          height: "max-content",
          backgroundColor: "#000000ac",
        }}
      >
        NIckName
      </Box>{" "}
      <Box
        sx={{
          display: "flex",
          flexWrap: "nowrap",
          color: "white",
          alignItems: "center",
          gap: "10px",
          padding: "10px",
          height: "max-content",
          backgroundColor: "#000000ac",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            color: "white",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              color: "white",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "20px",
              padding: "20px",
            }}
          >
            <TextField
              id="C4"
              label="Balance"
              value={generalData["A242"]}
              onChange={(e) =>
                changeGeneralData("A242", Number(e.target.value))
              }
              onKeyPress={(event) => handleKeyPress(event)}
              size="small"
              className="balance"
            />
            <TextField
              id="C4"
              label="Initial Balance"
              value={generalData["D244"]}
              onChange={(e) =>
                changeGeneralData("D244", Number(e.target.value))
              }
              onKeyPress={(event) => handleKeyPress(event)}
              className="balance"
              size="small"
            />
            <Typography gutterBottom component="div">
              Accumulated Balance{" "}
              <Button size="small">
                {(generalData.accumulatedBalance || 0).toFixed(3)}
              </Button>
            </Typography>
            <Typography gutterBottom component="div" style={{ color: "green" }}>
              Number of Longs{" "}
              <Button variant="contained" color="success" size="small">
                {generalData["CG4"] || 0}
              </Button>
            </Typography>
            <Typography gutterBottom component="div" style={{ color: "red" }}>
              Number of Shorts{" "}
              <Button variant="contained" color="error" size="small">
                {generalData["CH4"] || 0}
              </Button>
            </Typography>
            <Typography gutterBottom component="div">
              Coin Quantity <Button size="small">{generalData["E242"]}</Button>
            </Typography>
          </Box>
        </Box>{" "}
        <Button
          variant="contained"
          onClick={addRow}
          style={{ maxHeight: "50px" }}
        >
          Add Row
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ marginTop: "10px" }}>
        <Table aria-label="collapsible table">
          <TableBody>
            {rows.map((row) => (
              <Row
                key={row.id}
                data={row.data}
                results={row.results}
                onDelete={() => deleteRow(row.id)}
                onUpdate={(updatedData) => updateRow(row.id, updatedData)}
                genData={generalData}
                id={row.id}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Calculator;
