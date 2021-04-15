import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import Spinner from "./Loader";

class Login extends Component {
  Check = () => {
    const tok = localStorage.getItem("token");
    const post = localStorage.getItem("post");
    if (tok) {
      window.location.replace(
        window.env.REACT_APP_SITE_URL + "/dashboard/" + post
      );
    }
  };

  constructor(props) {
    super(props);
    this.Check();
    this.state = {
      post: "Student",
      username: "",
      password: "",
      isLoading: true,
    };
  }
  componentDidMount() {
    this.setState((prevvalue) => {
      return {
        isLoading: false,
      };
    });
  }
  HandleChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevvalue) => {
      return {
        ...prevvalue,
        [name]: value,
      };
    });
  };

  changePost = (e) => {
    if (e.target.checked) {
      this.setState((prev) => {
        return {
          ...prev,
          post: e.target.value,
        };
      });
    }
  };

  handleFormSubmit = async (event) => {
    event.preventDefault();

    var url = window.env.REACT_APP_SERVER_URL + "/api/login/";

    const d = this.state;

    url = url + this.state.post;

    this.setState((prev) => {
      return {
        isLoading: true,
      };
    });
    const resp = await axios.post(url, d);

    if (resp.data.Error) {
      alert(resp.data.Error);
      this.setState((prev) => {
        return {
          post: prev.post,
          username: "",
          password: "",
        };
      });
      this.setState((prev) => {
        return {
          isLoading: false,
        };
      });
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("post");
      localStorage.setItem("token", resp.data.token);
      localStorage.setItem("post", this.state.post);

      var rurl =
        window.env.REACT_APP_SITE_URL + "/dashboard/" + this.state.post;
      window.location.replace(rurl);
    }
  };

  prevent = (e) => {
    e.preventDefault();
  };

  render() {
    return this.state.isLoading ? (
      <Spinner />
    ) : (
      <>
        <div className="login">
          <div className="d-flex justify-content-center h-100">
            <div className="card">
              <div className="card-header">
                <h3>Sign In</h3>
              </div>
              <div className="card-body">
                <form onSubmit={this.prevent}>
                  <div className="pb-2">
                    <div class="mr-4 form-check-inline">
                      <label class="form-check-label text-white">
                        <input
                          type="radio"
                          class="form-check-input"
                          value="Host"
                          onChange={this.changePost}
                          name="post"
                        />
                        Host
                      </label>
                    </div>
                    <div class="mx-4 form-check-inline">
                      <label class="form-check-label text-white">
                        <input
                          defaultChecked
                          type="radio"
                          class="form-check-input"
                          value="Student"
                          onChange={this.changePost}
                          name="post"
                        />
                        Student
                      </label>
                    </div>
                    <div class="ml-4 form-check-inline">
                      <label class="form-check-label text-white">
                        <input
                          type="radio"
                          class="form-check-input"
                          value="Teacher"
                          onChange={this.changePost}
                          name="post"
                        />
                        Teacher
                      </label>
                    </div>
                  </div>
                  <div className="input-group form-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fas fa-envelope" />
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      value={this.state.username}
                      onChange={this.HandleChange}
                      placeholder="Email"
                    />
                  </div>
                  <div className="input-group form-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fas fa-key" />
                      </span>
                    </div>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={this.state.password}
                      onChange={this.HandleChange}
                      placeholder="Password"
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="submit"
                      onClick={this.handleFormSubmit}
                      defaultValue="Login"
                      className="btn float-right login_btn"
                    />
                  </div>
                </form>
              </div>
              <div className="card-footer">
                <div className="d-flex justify-content-center links">
                  Don't have an account?<a href="/register">Sign Up</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default Login;
