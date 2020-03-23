import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import uuid from "uuid-random";

class UserBlogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allUserBlogs: []
    };

    this.token = localStorage.getItem("token");
    this.baseURL = "http://localhost:5000";
    this.fetchBlogURL = "/blog/fetch/user-blogs";
    this.deleteBlogUrl = "/blog/delete";
  }

  fetchUserBlogs = () => {
    const config = {
      baseURL: this.baseURL,
      url: this.fetchBlogURL,
      headers: { Authorization: `Bearer ${this.token}` },
      method: "GET",
      timeout: 10000
    };

    axios(config)
      .then(res => {
        this.setState({
          allUserBlogs: res.data.blogs.reverse()
        });
      })
      .catch(err => {
        console.log(err.message);
        alert("Blog fetch failed." + err.message);
      });
  };

  deleteUserBlog = blogId => {
    const config = {
      baseURL: this.baseURL,
      url: this.deleteBlogUrl,
      headers: { Authorization: `Bearer ${this.token}` },
      method: "DELETE",
      timeout: 10000,
      data: { blogId: blogId }
    };

    axios(config)
      .then(res => {
        console.log(res.data);
        this.fetchUserBlogs();
      })
      .catch(err => {
        console.log(err.message);
        alert("Blog fetch failed." + err.message);
      });
  };

  componentDidMount() {
    this.fetchUserBlogs();
  }

  handleDelete = event => {
    event.preventDefault();

    let selectedBlog = Number(event.target.id);
    let allUserBlogs = this.state.allUserBlogs;

    let blogId = "";

    for (let i = 0; i < allUserBlogs.length; i++) {
      if (i === selectedBlog) {
        blogId = allUserBlogs[i].id;
      }
    }

    this.deleteUserBlog(blogId);
  };

  render() {
    if (this.props.isLoggedIn) {
      return (
        <div>
          <h2 className="mt-3">YOUR BLOGS</h2>
          <div className="row">
            {this.state.allUserBlogs.map((blog, index) => {
              return (
                <div
                  className="container col-5 border shadow my-3 p-4"
                  key={uuid()}
                >
                  <div className="row">
                    <div className="border border-dark text-center align-self-center">
                      <h1 className="px-2">#{blog.id}</h1>
                    </div>
                    <h5 className="col-4 text-justify text-uppercase d-inline text-truncate mt-3 font-weight-bold">
                      {blog.title}
                    </h5>
                    <img
                      className="ml-auto"
                      src={
                        blog.image_url === ""
                          ? "/static/user_stock_image.png"
                          : blog.image_url
                      }
                      width="100px"
                      height="100px"
                      alt="User"
                      style={{ borderRadius: "50%" }}
                    />
                  </div>
                  <div className="row mt-3">
                    <h5 className="">Category : {blog.category}</h5>
                  </div>
                  <div className="row mt-3">
                    <h5 className="small">
                      Dated : {blog.time_created.split(" ")[0]}
                    </h5>
                  </div>
                  <div className="row justify-content-between mt-4">
                    <Link to={`/edit-blog/${blog.id}`}>
                      <button className="btn btn-info rounded-0">Edit</button>
                    </Link>
                    <button
                      className="btn btn-danger rounded-0"
                      id={index}
                      onClick={this.handleDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else {
      return <Redirect to="/login" />;
    }
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.isLoggedIn
  };
};

export default connect(mapStateToProps)(UserBlogs);
