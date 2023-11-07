import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./Pages/LandingPage";
import LoginPage from "./Pages/LoginPage";
import SigninPage from "./Pages/SigninPage";
import HomePage from "./Pages/HomePage";
import ProfilPage from "./Pages/ProfilPage";
import PongGamePage from "./Pages/PongGamePage";
import ChatPage from "./Pages/ChatPage";
import PrivateRoute from "./Components/PrivateRoute";
import PublicRoute from "./Components/PublicRoute";
import LogoutPage from "./Pages/LogoutPage";
import AddPage from "./Pages/AddPage";
import TfaPage from "./Pages/TfaPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          ></Route>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          ></Route>
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <SigninPage />
              </PublicRoute>
            }
          ></Route>
          <Route
            path="/accueil"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/profil/*"
            element={
              <PrivateRoute>
                <ProfilPage />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/game"
            element={
              <PrivateRoute>
                <PongGamePage />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="logout"
            element={
              <PrivateRoute>
                <LogoutPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/add"
            element={
              <PrivateRoute>
                <AddPage />
              </PrivateRoute>
            }
          />
        <Route
            path="/twofa-verify"
            element={
              <PrivateRoute>
                <TfaPage />
              </PrivateRoute>
            }
            ></Route>
            </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
