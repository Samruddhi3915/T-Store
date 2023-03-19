const User = require("../models/user");
//extracts the validation erros from the request and makes them available in a result object(errors).
const { validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
const { expressjwt: expressJwt } = require("express-jwt");
exports.signout = (req, res) => {
  res.json({
    name: "Signout uccessful",
  });
};
exports.signin = (req, res) => {
  //destructing the json(all fields coming as input) coming from body(front end)
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //status 422:req not processed due to errors
    return res.status(422).json({
      //converted error into array{value,msg,param,location} and used msg from it.
      error: errors.array()[0].msg,
    });
  }
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Email not found",
      });
    }
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password don't match ",
      });
    }
    //create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    //putting tokken to user's cookie
    res.cookie("token", token, { expire: new Date() + 9999 });
    //sending response to front end
    const { _id, name, email, role } = user;
    res.json({ token, user: { _id, name, email, role } });
  });
};
//signup controller
exports.signup = (req, res) => {
  const errors = validationResult(req);
  //if errors then:
  if (!errors.isEmpty()) {
    //status 422:req not processed due to errors
    return res.status(422).json({
      //converted error into array{value,msg,param,location} and used msg from it.
      error: errors.array()[0].msg,
    });
  }
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in database",
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

//PROTECTED ROUTES

// exports.isSignedIn=(req, res) => {
//     console.log(process.env.SECRET)
// }

const secret1 = {
  secret: "shhhhh",
  userProperty: "auth",
  //holds id which is same when we do signin
  algorithms: ["HS256"],
};
exports.isSignedIn = expressJwt(secret1);

//custom middleware
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not an admin",
    });
  }
  next(); //used to transfer the control from middleware to other
};

//param-middleware
//comes after next
//whenever called follows a specific pattern
//in get
