import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import uuid from "uuid-random";

class ViewBlog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blog: [],
      comments: [],
      blogFetched: false,
      commentFetched: false,
      userComment: "",
      editComment: "",
      editCommentId: "",
      isEditing: false
    };

    this.token = localStorage.getItem("token");
    this.baseURL = "http://localhost:5000";
    this.fetchSingleBlogURL = "/blog/fetch/single";
    this.createCommentURL = "/blog/create-comment";
    this.fetchCommentsURL = "/blog/fetch-comment";
    this.deleteCommentURL = "/blog/delete-comment";
    this.editCommentURL = "blog/edit-comment";
  }

  fetchSingleBlog = () => {
    const config = {
      baseURL: this.baseURL,
      url: this.fetchSingleBlogURL,
      method: "POST",
      timeout: 10000,
      data: { blogId: this.props.match.params.id }
    };

    axios(config)
      .then(res => {
        this.setState({
          blog: res.data.blog,
          blogFetched: true
        });
        this.fetchComments();
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  fetchComments = () => {
    const config = {
      baseURL: this.baseURL,
      url: this.fetchCommentsURL,
      method: "POST",
      timeout: 10000,
      data: { blogId: this.props.match.params.id }
    };

    axios(config)
      .then(res => {
        this.setState({
          comments: res.data.comments,
          commentFetched: true
        });
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  createComment = comment => {
    const config = {
      baseURL: this.baseURL,
      url: this.createCommentURL,
      headers: { Authorization: `Bearer ${this.token}` },
      method: "POST",
      timeout: 10000,
      data: { blogId: this.props.match.params.id, comment: comment }
    };

    axios(config)
      .then(() => {
        this.setState({
          userComment: "",
          commentFetched: true
        });
        this.fetchComments();
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  deleteComment = commentId => {
    const config = {
      baseURL: this.baseURL,
      url: this.deleteCommentURL,
      headers: { Authorization: `Bearer ${this.token}` },
      method: "POST",
      timeout: 10000,
      data: { commentId: commentId }
    };

    axios(config)
      .then(() => {
        this.setState({
          commentFetched: true
        });
        this.fetchComments();
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  componentDidMount() {
    this.fetchSingleBlog();
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

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  uploadComment = event => {
    event.preventDefault();
    this.createComment(this.state.userComment);
  };

  uploadEditComment = () => {
    console.log("Making call");
    const config = {
      baseURL: this.baseURL,
      url: this.editCommentURL,
      headers: { Authorization: `Bearer ${this.token}` },
      method: "POST",
      timeout: 10000,
      data: {
        commentId: this.state.editCommentId,
        comment: this.state.editComment
      }
    };

    axios(config)
      .then(() => {
        this.setState({
          commentFetched: true,
          isEditing: false,
          editComment: "",
          editCommentId: ""
        });
        this.fetchComments();
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  handleDelete = event => {
    event.preventDefault();

    let comments = this.state.comments;
    let selectedComment = Number(event.target.id);
    let commentId = 0;

    for (let i = 0; i < comments.length; i++) {
      if (i === selectedComment) {
        commentId = comments[i].id;
      }
    }

    this.deleteComment(commentId);
  };

  handleEdit = event => {
    event.preventDefault();

    let comments = this.state.comments;
    let selectedComment = Number(event.target.id);
    let commentId = 0;
    let comment = "";

    for (let i = 0; i < comments.length; i++) {
      if (i === selectedComment) {
        commentId = comments[i].id;
        comment = comments[i].comment_content;
      }
    }

    this.setState({
      editCommentId: commentId,
      isEditing: true,
      editComment: comment
    });
  };

  render() {
    console.log(this.state);
    if (this.state.blogFetched) {
      return (
        <div>
          <div className="row">
            <div className="container col-5 shadow border my-3 p-4">
              <div className="row">
                <div className="border border-dark text-center">
                  <h1 className="px-2">#{this.state.blog[0].id}</h1>
                </div>
                <h5 className="col-9 text-justify text-uppercase d-inline text-truncate font-weight-bold align-self-center">
                  {this.state.blog[0].title}
                </h5>
              </div>
              <div className="row mt-3">
                <h5 className="">Category : {this.state.blog[0].category}</h5>
              </div>
              <div className="row mt-3">
                <h5 className="small">
                  Dated : {this.state.blog[0].time_created.split(" ")[0]}
                </h5>
              </div>
              <div className="row mt-3">
                <h5 className="text-justify">{this.state.blog[0].content}</h5>
              </div>
              <div className="row justify-content-between mt-4">
                <div className="row">
                  <img
                    className="ml-2"
                    src={
                      this.state.blog[0].image_url === ""
                        ? "/static/user_stock_image.png"
                        : this.state.blog[0].image_url
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
                      {this.namePascalCase(this.state.blog[0].name)}
                    </div>
                  </div>
                </div>
                <div className="align-self-end">
                  <Link to="/home">
                    <button
                      className="btn btn-danger mt-auto rounded-0 text-dark"
                      style={{ maxHeight: "50px" }}
                    >
                      Back
                    </button>
                  </Link>
                </div>
              </div>
              <div className="form-row mt-3">
                <div className="form-group col-10">
                  <input
                    type="text"
                    className="form-control rounded-0"
                    placeholder="Comment here..."
                    id="userComment"
                    value={this.state.userComment}
                    onChange={this.handleChange}
                  ></input>
                </div>
                <div className="form-group col-2">
                  <button
                    className="btn btn-outline-success rounded-0"
                    id="commentBtn"
                    onClick={this.uploadComment}
                  >
                    Comment
                  </button>
                </div>
                {this.state.comments.map((comment, index) => {
                  return (
                    <div className="form-row mt-4 p-1" key={uuid()}>
                      <div className="form-group col-2">
                        <img
                          className="ml-2 form-control"
                          src={
                            comment.image_url === ""
                              ? "/static/user_stock_image.png"
                              : comment.image_url
                          }
                          width="100px"
                          height="100px"
                          alt="User"
                          style={{ borderRadius: "50%" }}
                        />
                      </div>
                      <div className="form-group col-9 ml-2">
                        {this.state.isEditing ? (
                          <input
                            type="text"
                            id={uuid()}
                            name="upload"
                            className="form-control text-left font-weight-bold border-0 mb-2"
                            onChange={this.handleChange}
                          ></input>
                        ) : (
                          <input
                            type="text"
                            id="editComment"
                            className="form-control text-left font-weight-bold border-0 mb-2"
                            value={comment.comment_content}
                            disabled
                          ></input>
                        )}
                        <div className="form-row justify-content-between">
                          <div className="text-danger">
                            {this.namePascalCase(comment.name)}
                          </div>
                          <div className="text-danger">
                            {comment.time_created.split(" ")[0]}
                          </div>
                          {comment.email === this.props.userEmail ? (
                            <React.Fragment>
                              {this.state.isEditing ? (
                                <button
                                  id="uploadBtn"
                                  className="btn btn-info btn-sm rounded-0"
                                  onClick={this.uploadEditComment}
                                  id={index}
                                >
                                  Upload
                                </button>
                              ) : (
                                <button
                                  className="btn btn-success btn-sm rounded-0"
                                  onClick={this.handleEdit}
                                  id={index}
                                >
                                  Edit
                                </button>
                              )}

                              <button
                                className="btn btn-danger btn-sm rounded-0"
                                onClick={this.handleDelete}
                                id={index}
                              >
                                Delete
                              </button>
                            </React.Fragment>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
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

export default connect(mapStateToProps)(ViewBlog);
