import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import PrivateRoute from "./Components/PrivateRoute";
import PublicRoute from "./Components/PublicRoute";
import AddPage from "./Pages/AddPage";
import ChatPage from "./Pages/ChatPage";
import HomePage from "./Pages/HomePage";
import LandingPage from "./Pages/LandingPage";
import LoginPage from "./Pages/LoginPage";
import LogoutPage from "./Pages/LogoutPage";
import PongGamePage from "./Pages/PongGamePage";
import ProfilPage from "./Pages/ProfilPage";
import SigninPage from "./Pages/SigninPage";
import TfaPage from "./Pages/TfaPage";
import UsersPage from "./Pages/UsersPage";

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
						path="/chat"
						element={
							// <PrivateRoute>
								<ChatPage />
							// </PrivateRoute>
						}
					/>
					<Route
						path="/users"
						element={
							<PrivateRoute>
								<UsersPage/>
							</PrivateRoute>
						}
					/>
					<Route
						path="/twofa-verify"
						element={
							// <PrivateRoute>
							<TfaPage />
							// </PrivateRoute>
						}
					></Route>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
