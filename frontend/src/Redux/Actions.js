import { SIGNUP, LOGIN, LOGOUT } from "./Names";
import axios from "axios";

export const signup = state => {
  const config = {
    baseURL: "http://localhost:5000",
    url: "/auth/signup",
    method: "POST",
    timeout: "10000",
    data: state
  };

  return dispatch => {
    return axios(config)
      .then(res => {
        if (res.data.status === 200) {
          alert(res.data.message);
          return dispatch(signupUser(false));
        } else {
          alert(res.data.message);
          return dispatch(signupUser(true));
        }
      })
      .catch(err => {
        alert("Signup Failed");
        console.log(err);
        return dispatch(signupUser(true));
      });
  };
};

export const signupUser = signupError => {
  return { type: SIGNUP, payload: signupError };
};

export const login = state => {
  const config = {
    baseURL: "http://localhost:5000",
    url: "/auth/login",
    method: "POST",
    timeout: 10000,
    data: state
  };

  return dispatch => {
    return axios(config)
      .then(res => {
        if (res.data.status === 200) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("isLoggedIn", true);
          return dispatch(loginUser({ status: true, userEmail: state.email }));
        } else {
          alert(res.data.message);
          return dispatch(loginUser(false));
        }
      })
      .catch(err => {
        alert("Login Failed");
        console.log(err);
        return dispatch(loginUser(false));
      });
  };
};

export const loginUser = data => {
  return { type: LOGIN, payload: data };
};

export const logout = () => {
  localStorage.setItem("token", "");
  localStorage.setItem("isLoggedIn", false);
  return { type: LOGOUT };
};
