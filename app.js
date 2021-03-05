const express = require("express");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const USERS = path.join(__dirname, "data", "users.json");
const userdData = JSON.parse(fs.readFileSync(USERS, "utf-8"));

const getNestedProperty = (object) => {
  let nested_property_list = [];

  for (const property in object) {
    if (typeof object[property] == "object") {
      nested_property_list.push(property);
    }
  }

  return nested_property_list;
};

const findElements = (object) => {
  //get list of nested property
  let nested_property_list = getNestedProperty(object);
  let keys = Object.keys(object);

  return userdData.filter((user) => {
    //flag to keep track if an emp obj satisfys all condition or not
    let flag = true;

    keys.forEach((key) => {
      if (nested_property_list.includes(key)) {
        let nested_prop = Object.keys(object[key]);
        nested_prop.forEach((prop) => {
          // emp[key][prop] to access array value
          if (user[key][prop] === object[key][prop]) {
            return true; //foreach expect a return value
          } else {
            flag = false;
            return false; //foreach expect a return value
          }
        });
      } else {
        if (user[key] === object[key]) {
          return true; //foreach expect a return value
        } else {
          flag = false;
          return false; //foreach expect a return value
        }
      }
    });

    if (flag == true) {
      return true; // current emp obj statisfy all condition
    } else {
      return false; // current emp obj does not statisfy all condition
    }
  });
};
const app = express();

//what are the routes:
// CRUD
// - /users
// whato peration are we creating
// GET all users
// GET single user =>
// http://localhost:3000/users/2rvqp5egka5psgc9
// http://localhost:3000/users/:id => route parameter

// POST add user
// PUT/PATCH a single user
// Delete a single user

//middlewares

app.use(express.json());

//routes
app.get("/", (req, res) => {
  res.status(200).send("Hello from server!");
});

app.get("/users", (req, res) => {
  //   fs.readFile(USERS, "utf-8", (err, data) => {
  //     if (err) {
  //       //   res.status(503).send("Internal Server Error");
  //       res.status(503).json({ status: "Internal Server Error", err: err });
  //       return err;
  //     }
  //     res.status(200).json(JSON.parse(data));
  //   });
  //   console.log(req.query);
  if (req.query) {
    let users = findElements(req.query);

    res.status(200).json({ status: "successful", data: users });
  }
  res.status(200).json(userdData);
});

app.get("/users/:id", (req, res) => {
  console.log(req.params);
  let user = userdData.find((user) => {
    return user.id == req.params.id;
  });
  if (user) {
    res.status(200).json({ status: "successful", data: user });
  } else {
    res.status(404).json({ status: "User not found" });
  }
});

app.post("/users", (req, res) => {
  console.log(req.body);
  userdData.push(req.body);
  res.status(404).json({ message: "User Added Successful", data: req.body });
});

app.listen(PORT, () => {
  console.log(`Listeninig on Port http://localhost:${PORT}`);
});
