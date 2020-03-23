import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";
import { signup } from "../../Redux/Actions";

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: ""
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSignup = event => {
    event.preventDefault();
    if (
      this.state.name !== "" &&
      this.state.email !== "" &&
      this.state.password !== ""
    ) {
      this.props.signupUser(this.state);
      this.setState({
        name: "",
        email: "",
        password: ""
      });
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
          <h1 className="mb-4">SIGNUP</h1>
          <div className="form-group">
            <label htmlFor="name" className="font-weight-bold">
              Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="name"
              value={this.state.name}
              onChange={this.handleChange}
            />
          </div>
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
              id="password"
              className="form-control rounded-0"
              value={this.state.password}
              onChange={this.handleChange}
            />
            <div className="row d-flex justify-content-between mt-4">
              <div className="text-center ml-3">
                <button className="btn btn-success rounded-0" onClick={this.handleSignup}>
                  Signup
                </button>
              </div>
              <div className="text-center mr-3">
                <Link to="/login">
                  <button className="btn btn-danger rounded-0">Back to Login</button>
                </Link>
              </div>
            </div>
          </div>
        </form>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.isLoggedIn,
    signupError: state.signupError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signupUser: state => {
      dispatch(signup(state));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
