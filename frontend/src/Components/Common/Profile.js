import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      name: "",
      email: "",
      image_url: "",
      uploadedImage: ""
    };

    this.token = localStorage.getItem("token");
    this.baseURL = "http://localhost:5000";
    this.profileURL = "/profile";
  }

  fetchProfile = () => {
    const config = {
      baseURL: this.baseURL,
      url: this.profileURL,
      headers: { Authorization: `Bearer ${this.token}` },
      method: "GET",
      timeout: 10000
    };

    axios(config)
      .then(res => {
        let image_url = "";

        if (res.data.details.image_url !== null) {
          image_url = res.data.details.image_url;
        }

        let name = this.namePascalCase(res.data.details.name);

        this.setState({
          id: res.data.details.id,
          name: name,
          email: res.data.details.email,
          image_url: image_url
        });
      })
      .catch(err => {
        console.log(err.message);
        alert("Details fetching failed." + err.message);
      });
  };

  uploadImage = () => {
    let formData = new FormData();
    formData.append("image", this.state.uploadedImage);

    const config = {
      baseURL: this.baseURL,
      url: "/profile/upload-image",
      headers: { Authorization: `Bearer ${this.token}` },
      method: "POST",
      timeout: 10000,
      data: formData
    };

    axios(config)
      .then(res => {
        let image_url = "";
        if (res.data.details.image_url !== null) {
          image_url = res.data.details.image_url;
        }
        this.setState({
          image_url: image_url,
          uploadedImage: ""
        });
        document.getElementById("imageSelect").value = "";
        alert("Image uploaded successfully");
      })
      .catch(err => {
        console.log(err.message);
        alert("Image upload failed." + err.message);
      });
  };

  componentDidMount() {
    this.fetchProfile();
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

  handlePicture = event => {
    this.setState({
      uploadedImage: event.target.files[0]
    });
  };

  handleUpload = event => {
    event.preventDefault();

    if (this.state.uploadedImage === "") {
      alert("Please select an image to upload");
    } else {
      this.uploadImage();
    }
  };

  render() {
    if (this.props.isLoggedIn) {
      return (
        <div className="container col-4 mt-5 shadow shadow-lg p-3">
          <div className="card rounded-0">
            <img
              className="mx-auto mt-3"
              src={
                this.state.image_url === ""
                  ? "/static/user_stock_image.png"
                  : this.state.image_url
              }
              height="200px"
              width="200px"
              alt="Stock User"
              style={{ borderRadius: "50%" }}
            />
            <div className="row mx-auto mt-3 p-3">
              <input
                type="file"
                className="btn btn-sm btn-outline-success ml-3 rounded-0"
                accept="image/*"
                id="imageSelect"
                onChange={this.handlePicture}
              />
              <button
                className="btn btn-sm btn-outline-info ml-3 rounded-0"
                id="uploadImage"
                onClick={this.handleUpload}
              >
                Upload
              </button>
            </div>
            <div className="card-body">
              <h5 className="card-title">Name : {this.state.name}</h5>
              <p className="card-text">Email : {this.state.email}</p>
              <p className="card-text">ID : {this.state.id}</p>
            </div>
          </div>
          <Link to="/home">
            <button className="btn btn-outline-danger mt-3 mb-3 rounded-0">
              Back
            </button>
          </Link>
        </div>
      );
    } else {
      return <Redirect to="/" />;
    }
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.isLoggedIn
  };
};

export default connect(mapStateToProps)(Profile);
