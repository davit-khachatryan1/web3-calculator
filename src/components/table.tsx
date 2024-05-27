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
import Row from "./row";
import { useState } from "react";
import { data } from "../helpers/calculationUtils";

const Calculator = () => {
  const [rows, setRows] = useState([{ id: 1, data: data }]);

  const handleAddRow = () => {
    const newRow = { id: rows.length + 1, data: data };
    setRows((prevRows) => [...prevRows, newRow]);
  };

  const handleDeleteRow = (id: number) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };
  return (
    <>
      <Box
        sx={{
          paddingTop: "10px",
          paddingLeft: "10px",
          paddingRight: "10px",
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
            flexWrap: "wrap",
            color: "white",
            alignItems: "center",
            minHeight: "50px",
            height: "max-content",
            backgroundColor: "#000000ac",
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
              value={"52525"}
              // onChange={() => {}}
              size="small"
              className="balance"
            />
            <TextField
              id="C4"
              label="Initial Balance"
              // value={""}
              // onChange={() => {}}
              className="balance"
              size="small"
            />
            <Typography gutterBottom component="div">
              Accumulated Balance <Button size="small">o</Button>
            </Typography>
            <Typography gutterBottom component="div" style={{ color: "green" }}>
              Number of Longs{" "}
              <Button variant="contained" color="success" size="small">
                0
              </Button>
            </Typography>
            <Typography gutterBottom component="div" style={{ color: "red" }}>
              Number of Shorts{" "}
              <Button variant="contained" color="error" size="small">
                0
              </Button>
            </Typography>
            <Typography gutterBottom component="div">
              Coin Quantity <Button size="small">0</Button>
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={handleAddRow}
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
                  onDelete={() => handleDeleteRow(row.id)}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default Calculator;
