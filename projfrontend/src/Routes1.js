import React from "react";
import { BrowserRouter, Route, Routes, useRoutes } from "react-router-dom";
import AdminRoutes from "./auth/helper/AdminRoutes";
import Home from "./core/Home";
import Signin from "./user/Signin";
import Signup from "./user/Signup";
import PrivateRoute from "./auth/helper/PrivateRoute";
import UserDashBoard from "./user/UserDashBoard";
import AdminDashBoard from "./user/AdminDashBoard";
import AddCategory from "./admin/AddCategory";
import ManageCategories from "./admin/ManageCategories";
import AddProduct from "./admin/AddProduct";
import ManageProducts from "./admin/ManageProducts";
import UpdateProduct from "./admin/UpdateProduct";
import UpdateCategory from "./admin/UpdateCategory";
import Cart from "./core/Cart";
export default function Routes1() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/cart" element={<Cart />} />

          <Route
            path="/user/dashboard"
            element={
              <PrivateRoute>
                <UserDashBoard />
              </PrivateRoute>
            }
          />
          {/* <Route
            path="cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          /> */}
          <Route
            path="/admin/categories"
            element={
              <AdminRoutes>
                <ManageCategories />
              </AdminRoutes>
            }
          />
          <Route
            path="/admin/create/product"
            element={
              <AdminRoutes>
                <AddProduct />
              </AdminRoutes>
            }
          />
          {/* path can be given because of props in PrivatRoutes and AdminRoutes */}
          <Route
            path="/admin/create/category"
            element={
              <AdminRoutes>
                <AddCategory />
              </AdminRoutes>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoutes>
                <AdminDashBoard />
              </AdminRoutes>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoutes>
                <ManageProducts />
              </AdminRoutes>
            }
          />
          {/* path can be given because of props in PrivatRoutes and AdminRoutes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoutes>
                <AdminDashBoard />
              </AdminRoutes>
            }
          />
          <Route
            path="/admin/product/update/:productId"
            element={
              <AdminRoutes>
                <UpdateProduct />
              </AdminRoutes>
            }
          />
          <Route
            path="/admin/category/update/:categoryId"
            element={
              <AdminRoutes>
                <UpdateCategory />
              </AdminRoutes>
            }
          />

          {/* path can be given because of props in PrivatRoutes and AdminRoutes */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}
