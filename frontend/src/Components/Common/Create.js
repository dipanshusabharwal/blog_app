import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import uuid from "uuid-random";

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blogTitle: "",
      blogContent: "",
      blogCategory: "",
      allCategories: []
    };

    this.token = localStorage.getItem("token");
    this.baseURL = "http://localhost:5000";
    this.fetchCategoryURL = "/blog/fetch/category";
    this.createBlogURL = "/blog/create";
  }

  fetchCategory = () => {
    const config = {
      baseURL: this.baseURL,
      url: this.fetchCategoryURL,
      method: "GET",
      timeout: 10000
    };

    axios(config)
      .then(res => {
        if (res.data.status === 200) {
          this.setState({
            allCategories: res.data.categories
          });
        }
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  createBlogCall = () => {
    const config = {
      baseURL: this.baseURL,
      url: this.createBlogURL,
      headers: { Authorization: `Bearer ${this.token}` },
      method: "POST",
      timeout: 10000,
      data: this.state
    };

    axios(config)
      .then(res => {
        if (res.data.status === 200) {
          alert(res.data.message);
          this.setState({
            blogTitle: "",
            blogContent: "",
            blogCategory: ""
          });
        }
      })
      .catch(err => {
        console.log(err.message);
        alert("Blog creation failed");
      });
  };

  componentDidMount() {
    this.fetchCategory();
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  createBlog = event => {
    event.preventDefault();
    if (
      this.state.blogTitle !== "" &&
      this.state.blogCategory !== "" &&
      this.state.blogContent !== ""
    ) {
      this.createBlogCall();
    } else {
      alert("Please fill all fields");
    }
  };

  render() {
    if (this.props.isLoggedIn) {
      return (
        <div>
          <h2 className="mt-3">CREATE BLOG</h2>
          <form className="p-3 col-6 mx-auto">
            <div className="form-row">
              <div className="form-group col-8">
                <input
                  type="text"
                  className="form-control rounded-0"
                  id="blogTitle"
                  placeholder="Blog title goes here..."
                  value={this.state.blogTitle}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group col-4">
                <select
                  id="blogCategory"
                  className="form-control rounded-0"
                  value={this.state.blogCategory}
                  onChange={this.handleChange}
                >
                  <option value="">Blog Category...</option>
                  {this.state.allCategories.map(category => {
                    return (
                      <option value={category} key={uuid()}>
                        {category}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="form-group col-12">
                <textarea
                  className="form-control rounded-0"
                  id="blogContent"
                  rows="10"
                  placeholder="Blog content goes here..."
                  value={this.state.blogContent}
                  onChange={this.handleChange}
                ></textarea>
                <div className="form-group d-flex justify-content-between">
                  <Link to="/home">
                    <button className="btn btn-danger mt-4 rounded-0">
                      Back
                    </button>
                  </Link>
                  <button
                    className="btn btn-success mt-4 ml-auto rounded-0"
                    onClick={this.createBlog}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      );
    } else {
      return <Redirect to="/home" />;
    }
  }
}

const mapStateToProps = state => {
  return { isLoggedIn: state.isLoggedIn };
};

export default connect(mapStateToProps)(Create);
