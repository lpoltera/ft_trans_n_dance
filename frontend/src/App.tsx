// import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import GetAllUser from "./components/GetAllUser";
import GetHome from "./components/GetHome";
import PostCreateUser from "./components/PostCreateUser";
import PostLogin from "./components/PostLogin";
import PostLogout from "./components/PostLogout";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute><PostLogin /></PublicRoute>} />
        <Route path="signup" element={<PostCreateUser />} />
        <Route path="home" element={<PrivateRoute><GetHome /></PrivateRoute>} />
        <Route path="logout" element={<PrivateRoute><PostLogout /></PrivateRoute>} />
        <Route path="get" element={<PrivateRoute><GetAllUser /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}


