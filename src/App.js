import { useEffect, useReducer, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Admin from "./admin/Pages/Admin";
import Dashboard from "./admin/Pages/Dashboard";
import Login from "./admin/Pages/Login";
import { UserContext } from "./Context/UserContext";
import Customer from "./customer/Pages/Customer";
import Home from "./customer/Pages/Home";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import instance from "./axios";
import { ToastContainer, toast } from "react-toastify";
import Private from "./customer/Pages/Private";
import {
  BookingContext,
  initialBookingState,
  reducer,
} from "./Context/BookingContext";
import Search from "./customer/Pages/Search";
import Checkout from "./customer/Pages/Checkout";
import Purchase from "./customer/Pages/Purchase";
import Booking from "./admin/Pages/Booking";
import AddType from "./admin/Pages/AddType";
import TypeList from "./admin/Pages/TypeList";
import TypesOutLet from "./admin/Pages/TypesOutLet";
import RoomsOutLet from "./admin/Pages/RoomsOutLet";
import Rooms from "./admin/Pages/Rooms";
import Detail from "./customer/Pages/Detail";
import RequireAdminRole from "./Security/RequireAdminRole";
import RequiredUserRole from "./Security/RequiredUserRole";
import PopupLogin from "./customer/Components/PopupLogin";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
function App() {
  const [loginRequest, setLoginRequest] = useState(false);
  const closeModalLoginRequest = () => setLoginRequest(false);
  const [user, setUser] = useState({});
  const [booking, dispatch] = useReducer(reducer, initialBookingState);
  let navigate = useNavigate();

  const setJWTToSession = (response) => {
    let authorization = response.headers.authorization;
    if (authorization !== null) {
      sessionStorage.setItem("jwt", authorization);
    }
  };

  const getProfileUser = (jwt) => {
    instance
      .get("/account/user", { headers: { Authorization: jwt } })
      .then((res) => {
        console.log(res);
        setUser(res.data);
      });
  };

  useEffect(() => {
    let jwt = sessionStorage.getItem("jwt");
    if (jwt !== null) {
      getProfileUser(jwt);
    }
  }, []);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfoEmail = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
      );
      const email = userInfoEmail.data.email;

      const signInRequest = {
        email: email,
        password: "test",
      };

      const userRole = {
        id: 1,
        name: "user",
        status: true,
      };

      const signUpRequest = {
        email: email,
        phone: null,
        password: "test",
        role: userRole,
        profile: {
          fullName: userInfoEmail.data.name,
          cardNumbe: null,
          picture: userInfoEmail.data.picture,
        },
      };

      let userInfoDatabase = await instance.post("/auth/signin", signInRequest);
      // if (userInfoDatabase.status === 203) {
      //   const createUser = await instance.post("/account/create", newAccount);
      //   if (createUser === 201) {
      //     userInfoDatabase = await instance.post("/login", accountCredential);
      //     if (userInfoDatabase.status === 200) {
      //       setUser(userInfoDatabase.data);
      //       setJWTToSession(userInfoDatabase);
      //       window.location.reload();
      //     }
      //   }
      // } else
      if (userInfoDatabase.status === 200) {
        setUser(userInfoDatabase.data);
        setJWTToSession(userInfoDatabase);
        navigate("/", { replace: true });
      } else if (userInfoDatabase.status === 203) {
        alert(1);
      }
    },
    onError: (errorResponse) => console.log(errorResponse),
  });
  return (
    <>
      <UserContext.Provider value={{ user }}>
        <PayPalScriptProvider
          options={{ "client-id": `${process.env.REACT_APP_PAYPAL_CLIENT_ID}` }}
        >
          <BookingContext.Provider value={{ booking, dispatch }}>
            <Routes>
              <Route path="/" element={<Customer googleLogin={googleLogin} />}>
                <Route index element={<Home googleLogin={googleLogin} />} />
                <Route path="private" element={<Private />} />
                <Route
                  path="search"
                  element={<Search googleLogin={googleLogin} />}
                />
                <Route
                  path="detail/:id"
                  element={<Detail setLoginRequest={setLoginRequest} />}
                />
                <Route
                  path="checkout/:id"
                  element={
                    <RequiredUserRole>
                      <Checkout />
                    </RequiredUserRole>
                  }
                />
                <Route
                  path="purchase"
                  element={
                    <RequiredUserRole>
                      <Purchase />
                    </RequiredUserRole>
                  }
                />
              </Route>

              <Route
                path="/admin"
                element={
                  <RequireAdminRole>
                    <Admin />
                  </RequireAdminRole>
                }
              >
                <Route index element={<Dashboard />} />
                <Route element={<Login />} />
                <Route path="booking" element={<Booking />} />

                <Route path="rooms" element={<RoomsOutLet />}>
                  <Route index element={<Rooms />} />
                </Route>

                <Route path="types" element={<TypesOutLet />}>
                  <Route index element={<TypeList />} />
                  <Route path="update/:id" element={<AddType />} />
                  <Route path="add" element={<AddType />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to={"/"} replace={true} />} />
            </Routes>
            <PopupLogin
              closeModalLoginRequest={closeModalLoginRequest}
              loginRequest={loginRequest}
              googleLogin={googleLogin}
            />
            <ToastContainer />
          </BookingContext.Provider>
        </PayPalScriptProvider>
      </UserContext.Provider>
    </>
  );
}

export default App;
