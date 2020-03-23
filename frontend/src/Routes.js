import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./Components/Common/Home";
import Login from "./Components/Auth/Login";
import Signup from "./Components/Auth/Signup";
import Profile from "./Components/Common/Profile";
import Create from "./Components/Common/Create";
import UserBlogs from "./Components/Common/UserBlogs";
import ViewBlog from "./Components/Common/ViewBlog";
import EditBlog from "./Components/Common/EditBlog.js";
import Error from "./Components/Common/Error";

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/home" />} />
        <Route path="/home" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/profile" component={Profile} />
        <Route path="/create" component={Create} />
        <Route path="/my-blogs" component={UserBlogs} />
        <Route path="/view-blog/:id" component={ViewBlog} />
        <Route path="/edit-blog/:id" component={EditBlog} />
        <Route component={Error} />
      </Switch>
    );
  }
}

export default Routes;
