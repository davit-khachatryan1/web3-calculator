import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";

import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/routeComponent/ProtectedRoute";
import Auth from "./components/auth/auth";
import Calculator from "./components/table";
import { CoinsCalculationsProvider } from "./context/CoinsCalculationsContext";
// // import SignIn from "./components/signIn/signIn";
// // import SignUp from "./components/signUp/signUp";
// import Calculator from "./components/table";
import { DataProvider } from "./context/DataContext";
// import Auth from "./components/auth/auth";
// // import Auth from "./components/registration/auth";

const defaultTheme = createTheme();

// function App() {
//   return (
//     <ThemeProvider theme={defaultTheme}>
//       <DataProvider>
//         <Calculator />
//         {/* <SignIn/> */}
//         {/* <SignUp /> */}
//         {/* <Auth/> */}
//       </DataProvider>
//     </ThemeProvider>
//   );
// }

// export default App;

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AuthProvider>
        <CoinsCalculationsProvider>
          <DataProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Auth />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Calculator />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Router>
          </DataProvider>
        </CoinsCalculationsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
///acumulated balacne hashvel@ hanel mi hat verev layer u hashvel priceacordin eli mi layer verev

export default App;
