import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "./Loader";

function FormTeacher(props) {
  const [formData, getFormData] = useState({
    fname: "",
    lname: "",
    phone: "",
    post: "Student",
    username: "",
    password: "",
    isLoading: true,
  });

  useEffect(() => {
    getFormData({
      fname: "",
      lname: "",
      phone: "",
      post: "Student",
      username: "",
      password: "",
      isLoading: false,
    });
  }, []);

  function HandleChange(event) {
    const { name, value } = event.target;
    getFormData((prevvalue) => {
      return {
        ...prevvalue,
        [name]: value,
      };
    });
  }

  function changePost(e) {
    if (e.target.checked) {
      getFormData((prev) => {
        return {
          ...prev,
          post: e.target.value,
        };
      });
    }
  }

  function prevent(e) {
    e.preventDefault();
  }
  const [multerImage, setImage] = useState();
  const [imagedetails, setdetails] = useState({});
  function uploadimage(e) {
    setdetails(e.target.files[0]);
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    getFormData((prevvalue) => {
      return {
        ...prevvalue,
        isLoading: true,
      };
    });
    async function postFormData() {
      var url = window.env.REACT_APP_SERVER_URL + "/api/register/";
      let imageobj = new FormData();

      imageobj.append("imageName", "multer-image-" + Date.now());
      imageobj.append("imageData", imagedetails);

      const data = formData;
      url = url + formData.post;
      const request = await axios.post(url, imageobj, {
        headers: {
          ...data,
        },
      });
      return request;
    }

    postFormData().then((res) => {
      // const message = res.data.token;

      if (res.data.Error) {
        alert(res.data.Error);
        getFormData((prevvalue) => {
          return {
            ...prevvalue,
            isLoading: false,
          };
        });
      } else if (res.data === "Registered") {
        var url = process.env.REACT_APP_SERVER_URL + "/api/login/";
        url = url + formData.post;
        axios.post(url, formData).then((userData) => {
          if (userData.data.Error) {
            alert(userData.data.Error);
          } else {
            localStorage.setItem("token", userData.data.token);
            localStorage.setItem("post", formData.post);
          }
          var rurl =
            process.env.REACT_APP_SITE_URL + "/dashboard/" + formData.post;
          window.location.replace(rurl);
        });
      }
    });
    getFormData({
      fname: "",
      lname: "",
      phone: "",
      post: "Student",
      username: "",
      password: "",
      isLoading: false,
    });
  }
  if (formData.isLoading) {
    return <Spinner />;
  } else {
    return (
      <div className="login">
        <div className="d-flex justify-content-center h-100">
          <div className="card">
            <div className="card-header">
              <h3>Sign In</h3>
            </div>
            <div className="card-body">
              <form onSubmit={prevent}>
                <div className="pb-2">
                  <div class="mr-4 form-check-inline">
                    <label class="form-check-label text-white">
                      <input
                        defaultChecked
                        type="radio"
                        class="form-check-input"
                        value="Student"
                        name="post"
                        onChange={changePost}
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
                        name="post"
                        onChange={changePost}
                      />
                      Teacher
                    </label>
                  </div>
                </div>
                <div className="input-group form-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fas fa-user" />
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    name="fname"
                    value={formData.fname}
                    onChange={HandleChange}
                    placeholder="First name"
                  />
                </div>
                <div className="input-group form-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fas fa-user" />
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    name="lname"
                    value={formData.lname}
                    onChange={HandleChange}
                    placeholder="Last name"
                  />
                </div>

                <div className="input-group form-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fas fa-phone" />
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={HandleChange}
                    placeholder="Phone number"
                  />
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
                    value={formData.username}
                    onChange={HandleChange}
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
                    value={formData.password}
                    onChange={HandleChange}
                    placeholder="Password"
                  />
                </div>
                <label
                  for="image"
                  style={{ color: "#fff", textAlign: "center", width: "100%" }}
                >
                  Profile Image
                </label>
                <div
                  // className="input-group form-group"
                  style={{ display: "flex" }}
                >
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i
                        className="far fa-image"
                        style={{ fontSize: "1.6rem" }}
                      />
                    </span>
                  </div>
                  <input
                    type="file"
                    // className="form-control"
                    style={{
                      display: "flex",
                      color: "#fff",
                      padding: "0 1rem",
                      lineHeight: "2.5rem",
                      height: "2.5rem",
                    }}
                    name="image"
                    onChange={uploadimage}
                  />
                </div>

                <div
                  className="form-group"
                  style={{
                    display: "grid",
                    placeItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <input
                    type="submit"
                    defaultValue="Register"
                    className="btn  login_btn"
                    onClick={handleFormSubmit}
                  />
                </div>
              </form>
            </div>
            <div className="card-footer">
              <div className="d-flex justify-content-center links">
                Already have an account?<a href="/login">Sign In</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default FormTeacher;
