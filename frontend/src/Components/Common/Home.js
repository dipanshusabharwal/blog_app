import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import uuid from "uuid-random";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allBlogs: []
    };

    this.token = localStorage.getItem("token");
    this.baseURL = "http://localhost:5000";
    this.fetchAllBlogsURL = "/blog/fetch/all-blogs";
  }

  fetchAllBlogs = () => {
    const config = {
      baseURL: this.baseURL,
      url: this.fetchAllBlogsURL,
      headers: { Authorization: `Bearer ${this.token}` },
      method: "GET",
      timeout: 10000
    };

    axios(config)
      .then(res => {
        this.setState({
          allBlogs: res.data.blogs.reverse()
        });
      })
      .catch(err => {
        console.log(err.message);
        alert("Blog fetch failed." + err.message);
      });
  };

  componentDidMount() {
    this.fetchAllBlogs();
  }

  namePascalCase = name => {
    name = name.split(" ");
    let pascalCaseName = [];

    for (let i = 0; i < name.length; i++) {
      let word = "";
      for (let j = 0; j < name[i].length; j++) {
        if (j === 0) {
          word += name[i][j].toUpperCase();
        } else {
          word += name[i][j];
        }
      }
      pascalCaseName.push(word);
    }

    return pascalCaseName.join(" ");
  };

  render() {
    return (
      <div>
        <h2 className="mt-3">ALL BLOGS</h2>
        <div className="row">
          {this.state.allBlogs.map(blog => {
            return (
              <div
                className="container col-5 shadow border my-4 p-4"
                key={uuid()}
              >
                <div className="row">
                  <div className="border border-dark text-center">
                    <h1 className="px-2">#{blog.id}</h1>
                  </div>
                  <h5 className="col-9 text-justify text-uppercase d-inline text-truncate font-weight-bold align-self-center">
                    {blog.title}
                  </h5>
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
                  <div className="row">
                    <img
                      className="ml-2"
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
                    <div className="col align-self-center">
                      <div className="text-left border-bottom border-dark">
                        Author :
                      </div>
                      <div className="text-left border-bottom border-dark">
                        {this.namePascalCase(blog.name)}
                      </div>
                    </div>
                  </div>
                  <div className="align-self-end">
                    <Link to={`/view-blog/${blog.id}`}>
                      <button
                        className="btn btn-success mt-auto rounded-0 text-dark"
                        style={{ maxHeight: "50px" }}
                      >
                        View
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default connect()(Home);
