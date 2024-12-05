import { RequireAuth } from "react-auth-kit";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth loginPath="/login">
              <Home />
            </RequireAuth>
          }
        ></Route>
        <Route path ="/login" element={<Login/>}></Route>
        <Route path = "/register" element={<Register />}></Route>
      </Routes>
      
    </div>
  );
}

export default App;
