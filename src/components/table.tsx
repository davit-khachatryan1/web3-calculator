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
import { useAuthContext } from "../context/AuthContext";
import BackgroundImage from "../assets/Background.png";

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

  const { user } = useAuthContext();

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      triggerCalculations(rows, generalData);
    }
  };

  return (
    <Box
      sx={{
        padding: "10px",
        height: "100vh",
        display: "flex",
        backgroundColor: "#1f1f1f",
        flexDirection: "column",
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "220px 200px",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
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
          backgroundColor: "#000000",
        }}
      >
        {user.name}
      </Box>{" "}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          color: "white",
          alignItems: "center",
          gap: "10px",
          padding: "10px",
          height: "max-content",
          backgroundColor: "#000000",
          justifyContent: "center",
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
              justifyContent: "space-between",
            }}
          >
            <TextField
              id="C4"
              label="Balance"
              value={generalData.A242}
              onChange={(e) => {
                const a = e.target.value;
                changeGeneralData({
                  A242: Number(a),
                });
              }}
              onKeyPress={(event) => handleKeyPress(event)}
              size="small"
              className="balance"
              autoComplete="off"
              sx={{
                maxWidth: "150px",
              }}
              focused
            />
            <TextField
              id="C4"
              label="Initial Balance"
              value={generalData.D244}
              onChange={(e) => {
                const a = e.target.value;
                changeGeneralData({
                  D244: Number(a),
                });
              }}
              onKeyPress={(event) => handleKeyPress(event)}
              className="balance"
              size="small"
              autoComplete="off"
              sx={{
                maxWidth: "150px",
              }}
              focused
            />
            <Typography gutterBottom component="div">
              Accumulated Balance{" "}
              <Button size="small">
                {(generalData.accumulatedBalance || 0).toFixed(3)}
              </Button>
            </Typography>
            <Typography gutterBottom component="div">
              Margin Equity{" "}
              <Button size="small">
                {(generalData.fullMarginEq || 0).toFixed(3)}
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
          Add Coin
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
                name={row.name}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Calculator;
