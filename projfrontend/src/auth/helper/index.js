import { API } from "../../backend";
//code like replica of  postman
export const signup = (user) => {
  return fetch(`${API}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    }) //if everything gets right we get a response
    .catch((err) => console.log(err));
};
export const signin = (user) => {
  return fetch(`${API}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    }) //if everything gets right we get a response
    .catch((err) => {
      console.log("erroooro");
      return err;
    });
};
//associated with sigin -authenticate
export const authenticate = (data, next) => {
  if (typeof window !== "undefined") {
    //window obj is accessible
    localStorage.setItem("jwt", JSON.stringify(data));
    //jwt is a token
    next();
  }
};

//middleware(next)
export const signout = (next) => {
  if (typeof window !== "undefined") {
    //window obj is accessible
    localStorage.removeItem("jwt"); //removing after signout
    //jwt is a token
    next();

    //logout user from bkend
    return fetch(`${API}/signout`, {
      method: "GET",
    })
      .then((response) => console.log("signout success"))
      .catch((err) => console.log(err));
  }
};

//validate user is signed in or not

export const isAuthenticated = () => {
  if (typeof window == "undefined") {
    //window obj is undeifined ie.no access therifore user not authenticated
    return false;
  }
  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    return false;
  }
};
