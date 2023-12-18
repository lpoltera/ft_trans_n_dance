import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
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
import { UserProvider } from "./contexts/UserContext";
import { GameProvider } from "./contexts/GameContext";
import NewGame from "./Pages/NewGame";
import { NotificationProvider } from "./contexts/NotificationContext";
import ErrorPage from "./Pages/ErrorPage";
import TournamentsPage from "./Pages/TournamentsPage";

function App() {
	return (
		<>
			<UserProvider>
				<NotificationProvider>
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
								path="/tournaments"
								element={
									// <PrivateRoute>
									<TournamentsPage />
									// </PrivateRoute>
								}
							/>
							<Route
								path="/game"
								element={
									<GameProvider>
										<PrivateRoute>
											<PongGamePage />
										</PrivateRoute>
									</GameProvider>
								}
							></Route>
							<Route
								path="/new-game"
								element={
									<GameProvider>
										<PrivateRoute>
											<NewGame />
										</PrivateRoute>
									</GameProvider>
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
										<UsersPage />
									</PrivateRoute>
								}
							/>
							<Route path="/404" element={<ErrorPage statusCode="404" />} />
							<Route path="/twofa-verify" element={<TfaPage />}></Route>
						</Routes>
					</BrowserRouter>
					<ToastContainer
						position="bottom-right"
						closeOnClick
						theme="dark"
						newestOnTop
					/>
				</NotificationProvider>
			</UserProvider>
		</>
	);
}

export default App;
