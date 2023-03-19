import React, { useState } from "react";
import Base from "../core/Base";
import { Link, Navigate, redirect } from "react-router-dom";
import { signin, authenticate, isAuthenticated } from "../auth/helper/index";

const Signin = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    didRedirect: false, //if successfull signin the user needs to riderct to user or admin dashboard
  });

  //destructuring
  const { email, password, error, loading, didRedirect } = values;

  const { user } = isAuthenticated();

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value }); //loads exisiting values by ...
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    signin({ email, password })
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, loading: false });
        } else {
          authenticate(data, () => {
            //() since next was the paramter
            setValues({
              ...values,
              didRedirect: true,
            });
          });
        }
      })
      .catch((err) => console.log("signin request falied", err));
  };

  const performRedirect = () => {
    if (didRedirect) {
      if (user && user.role === 1) {
        //1 is admin
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/user/dashboard" />;
      }
    }
    if (isAuthenticated()) {
      return <Navigate to="/" />;
    }
  };

  const LoadingMessage = () => {
    return (
      //both conditions must be true so &&
      loading && (
        <div className="alert alert-info">
          <h2>Loading......</h2>
        </div>
      )
    );
  };

  const ErrorMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
          >
            {error}
          </div>
        </div>
      </div>
    );
  };

  const signInForm = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <form>
            <div className="form-group">
              <label className="text-light mt-3">Email</label>
              <input
                onChange={handleChange("email")}
                value={email}
                className="form-control"
                type="email"
              ></input>
            </div>
            <div className="form-group">
              <label className="text-light mt-3">Password</label>
              <input
                onChange={handleChange("password")}
                value={password}
                className="form-control"
                type="password"
              ></input>
            </div>
            <button
              onClick={onSubmit}
              className="btn btn-success mt-2 form-control btn-block"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <Base title="Sign In page" description="A page for user to sign In!">
      {LoadingMessage()}
      {ErrorMessage()}
      {signInForm()}
      {performRedirect()}
      <p className="text-white text-center">{JSON.stringify(values)}</p>
    </Base>
  );
};
export default Signin;
