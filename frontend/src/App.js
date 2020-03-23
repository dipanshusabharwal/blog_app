import React, { Component } from "react";
import "./App.css";
import Navbar from "./Components/Common/Navbar";
import Routes from "./Routes";
import { connect } from "react-redux";
import { loginUser } from "./Redux/Actions";

class App extends Component {
  componentDidMount() {
    let isLoggedIn = localStorage.getItem("isLoggedIn");
    let token = localStorage.getItem("token");
    let userEmail = localStorage.getItem("userEmail");
    if (isLoggedIn && token !== "") {
      this.props.login({ status: true, userEmail: userEmail });
    }
  }

  render() {
    return (
      <div className="App">
        <Navbar />
        <Routes />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.isLoggedIn
  };
};

const mapDispatchToProps = dispatch => {
  return {
    login: status => {
      dispatch(loginUser(status));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
