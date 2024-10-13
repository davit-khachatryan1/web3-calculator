import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/routeComponent/ProtectedRoute";
import Auth from "./components/auth/auth";
import Calculator from "./components/table";
import { CoinsCalculationsProvider } from "./context/CoinsCalculationsContext";
import { DataProvider } from "./context/DataContext";
import "./App.css";

const defaultTheme = createTheme();

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
export default App;
