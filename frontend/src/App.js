import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ActivationPage, LoginPage, SignUpPage } from "./Routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/login' element={<LoginPage />} />
        <Route exact path='/sign-up' element={<SignUpPage />} />
        <Route
          exact
          path='/activation/:activation_token'
          element={<ActivationPage />}
        />
      </Routes>
      <ToastContainer
        position='bottom-center'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
      />
    </BrowserRouter>
  );
}

export default App;
