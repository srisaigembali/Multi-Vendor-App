import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage, SignUpPage } from "./Routes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/login' element={<LoginPage />} />
        <Route exact path='/sign-up' element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
