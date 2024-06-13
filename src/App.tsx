import { ThemeProvider, createTheme } from "@mui/material";
import "./App.css";
// import SignIn from "./components/signIn/signIn";
// import SignUp from "./components/signUp/signUp";
import Calculator from "./components/table";
import { DataProvider } from "./context/DataContext";
import Auth from "./components/auth/auth";
// import Auth from "./components/registration/auth";

const defaultTheme = createTheme();

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <DataProvider>
        <Calculator />
        {/* <SignIn/> */}
        {/* <SignUp /> */}
        {/* <Auth/> */}
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
