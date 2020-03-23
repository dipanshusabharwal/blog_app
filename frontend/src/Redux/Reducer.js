import { SIGNUP, LOGIN, LOGOUT } from "./Names";

const intitalState = {
  signupError: false,
  isLoggedIn: false,
  loggedinUserEmail: ""
};

const Reducer = (state = intitalState, action) => {
  switch (action.type) {
    case SIGNUP:
      return {
        ...state,
        signupError: action.payload
      };

    case LOGIN:
      return {
        ...state,
        isLoggedIn: action.payload.status,
        loggedinUserEmail: action.payload.userEmail
      };

    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        signupError: false,
        loggedinUserEmail: ""
      };

    default:
      return state;
  }
};

export default Reducer;
