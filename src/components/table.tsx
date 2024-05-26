import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableContainer,
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
          backgroundImage: "url(https://as1.ftcdn.net/v2/jpg/05/74/79/80/1000_F_574798026_iEIdURVR3yieUYcn2tQYakrSYB999s5k.jpg)",
          backgroundSize: "cover", 
          backgroundPosition: "center", 
        }}
      >
        <Box sx={{ color: "white", height: "100px",backgroundColor: "#0e0a0aac", }}>
          <Typography gutterBottom component="div">
            Balance: 10000
          </Typography>
          <Button variant="contained" onClick={handleAddRow}>
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
