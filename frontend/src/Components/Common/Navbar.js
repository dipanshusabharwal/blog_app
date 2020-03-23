import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout, loginUser } from "../../Redux/Actions";
import axios from "axios";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      render: true
    };
  }

  handleLogout = event => {
    event.preventDefault();
    if (this.props.isLoggedIn) {
      this.props.logoutUser();
    }
  };

  componentDidMount() {
    if (
      this.props.loggedinUserEmail === undefined &&
      localStorage.getItem("isLoggedIn")
    ) {
      const config = {
        baseURL: "http://localhost:5000",
        url: "/auth/fetch-user-details",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        method: "GET",
        timeout: 10000
      };

      axios(config)
        .then(res => {
          this.props.login({
            status: true,
            userEmail: res.data.user[0].email
          });
          this.setState({
            render: true
          });
        })
        .catch(err => {
          console.log(err.message);
          // alert("Details fetching failed." + err.message);
        });
    }
  }

  render() {
    console.log(this.state);
    if (this.state.render) {
      return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark text-light">
          <h5 className="mr-5 font-weight-bold text-warning">Lets Blog</h5>
          <ul className="navbar-nav mr-4 mt-2 mt-lg-0">
            <Link to="/home">
              <h5 className="text-light">Home</h5>
            </Link>
          </ul>
          {this.props.isLoggedIn ? (
            <React.Fragment>
              <ul className="navbar-nav mr-4 mt-2 mt-lg-0">
                <Link to="/create">
                  <h5 className="text-light">Create</h5>
                </Link>
              </ul>
              <ul className="navbar-nav mr-4 mt-2 mt-lg-0">
                <Link to="/my-blogs">
                  <h5 className="text-light">My Blogs</h5>
                </Link>
              </ul>
            </React.Fragment>
          ) : null}
          <form className="form-inline ml-auto my-2 my-lg-0">
            {this.props.isLoggedIn ? (
              <React.Fragment>
                <h6 className="mr-3 font-weight-bold">
                  {this.props.userEmail}
                </h6>
                <Link to="/profile">
                  <button className="btn btn-info mr-3 my-2 my-sm-0 rounded-0 text-dark">
                    Profile
                  </button>
                </Link>
                <button
                  className="btn btn-danger my-2 my-sm-0 rounded-0 text-dark"
                  onClick={this.handleLogout}
                >
                  Logout
                </button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Link to="/login">
                  <button className="btn btn-success mr-3 my-2 my-sm-0 rounded-0 text-dark">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="btn btn-info my-2 my-sm-0 rounded-0 text-dark">
                    Signup
                  </button>
                </Link>
              </React.Fragment>
            )}
          </form>
        </nav>
      );
    } else {
      return <div>LOADING</div>;
    }
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.isLoggedIn,
    userEmail: state.loggedinUserEmail
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logoutUser: () => {
      dispatch(logout());
    },
    login: state => {
      dispatch(loginUser(state));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
