import React, { Component } from "react";
import { Link } from "react-router-dom";

class Error extends Component {
  render() {
    return (
      <div className="container mt-5 text-center">
        <p className="display-3">404 !</p>
        <p className="display-3">Page not found</p>
        <Link to="/">
          <button className="btn btn-outline-danger shadow shadow-lg mt-5">
            Home
          </button>
        </Link>
      </div>
    );
  }
}

export default Error;
