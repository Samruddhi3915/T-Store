import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import {
  createCategory,
  getCategories,
  getCategory,
  updateProduct,
  updateaCategory,
} from "./helper/adminapicall";

const UpdateCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user, token } = isAuthenticated();
  //bearer token

  const goBack = () => (
    <div className="mt-5">
      <Link className="btn btn-sm btn-success mb-3" to="/admin/dashboard">
        Admin Home
      </Link>
    </div>
  );
  const handleChange = (event) => {
    setError("");
    setName(event.target.value);
  };

  const onsubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    //backend request fired
    // createCategory(user._id, token, { name }).then((data) => {
    //   if (data.error) {
    //     setError(true);
    //   } else {
    //     setError("");
    //     setSuccess(true);
    //     setName("");
    //   }
    // });
    updateaCategory(
      window.location.pathname.split("/")[4],
      user._id,
      token,
      name
    ).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setName("");
        setSuccess(true);
      }
    });
  };

  const successMessage = () => {
    if (success) {
      return <h4 className="text-success">Category updated successfully</h4>;
    }
  };
  const warningMessage = () => {
    if (error) {
      return <h4 className="text-success">Failed to update category</h4>;
    }
  };
  const preLoad = (categoryId) => {
    getCategory(categoryId).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setName(data.name);
      }
    });
  };
  useEffect(() => {
    preLoad(window.location.pathname.split("/")[4]);
  }, []);
  const myCategoryForm = () => (
    <form>
      <div className="form-group">
        <p className="lead">Enter the category</p>
        <input
          type="text"
          className="form-control my-3"
          onChange={handleChange}
          value={name}
          autoFocus
          required
          placeholder="For ex. summer"
        />
        <button onClick={onsubmit} className="btn btn-outline-info">
          Update Category
        </button>
      </div>
    </form>
  );

  return (
    <Base
      title="Create a category here"
      description="Add a new category for new tshirts"
      className="container bg-info p-4"
    >
      <div className="row bg-white rounded">
        <div className="col-md-8 offset-md-2">
          {successMessage()}
          {warningMessage()}
          {myCategoryForm()}
          {goBack()}
        </div>
      </div>
    </Base>
  );
};
export default UpdateCategory;
