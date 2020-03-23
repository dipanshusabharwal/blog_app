import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../../Redux/Actions";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleLogin = event => {
    event.preventDefault();
    if (this.state.email !== "" && this.state.password !== "") {
      this.props.loginUser(this.state);
    } else {
      alert("Please fill all details");
    }
  };

  render() {
    if (this.props.isLoggedIn) {
      return <Redirect to="/home" />;
    } else {
      return (
        <form className="col-4 mx-auto mt-5 shadow p-5 border">
          <h1 className="mb-4">LOGIN</h1>
          <div className="form-group">
            <label htmlFor="email" className="font-weight-bold">
              Email
            </label>
            <input
              type="email"
              className="form-control rounded-0"
              id="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="font-weight-bold">
              Password
            </label>
            <input
              type="password"
              className="form-control rounded-0"
              id="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </div>
          <div className="d-flex justify-content-between mt-4">
            <button
              className="btn btn-success rounded-0"
              onClick={this.handleLogin}
            >
              Login
            </button>
            <Link to="/signup">
              <button className=" btn btn-info rounded-0">Signup</button>
            </Link>
          </div>
        </form>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.isLoggedIn
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loginUser: state => {
      dispatch(login(state));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
