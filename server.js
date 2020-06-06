"use strict";

const express = require("express");
const morgan = require("morgan");

const { users } = require("./data/users");

let auth = {
  isLoggedIn: false,
  userName: undefined,
  friends: undefined,
  userId: undefined,
};

// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};

const handleHomepage = (req, res) => {
  res.status(200).render("pages/homepage", {
    users: users,
    auth: auth,
  });
};

const handleProfilepage = (req, res) => {
  let user = users.find((user) => user._id === req.params._id);

  if (!user) {
    res.status(404).send("I couldn't find what you're looking for.");
  } else {
    let friends = users.filter((u) => user.friends.includes(u._id));
    res.status(200).render("pages/profile", {
      user: user,
      friends: friends,
      auth: auth,
    });
  }
};

const handleSignin = (req, res) => {
  if (auth.isLoggedIn) {
    res.status(200).redirect("/users/" + auth.userId);
  } else {
    res.status(200).render("pages/signin", {
      auth: auth,
    });
  }
};

const handleName = (req, res) => {
  let firstName = req.query.firstName;
  let user = users.find((u) => u.name === firstName);

  if (user) {
    auth.isLoggedIn = true;
    auth.userName = user.name;
    auth.friends = user.friends;
    auth.userId = user._id;
    res.status(200).redirect("/users/" + user._id);
  } else {
    res.status(404).redirect("/signin");
  }
};

// -----------------------------------------------------
// server endpoints
express()
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")

  // endpoints
  .get("/", handleHomepage)
  .get("/signin", handleSignin)
  .get("/getName", handleName)
  .get("/users/:_id", handleProfilepage)

  // a catchall endpoint that will send the 404 message.
  .get("*", handleFourOhFour)

  .listen(8000, () => console.log("Listening on port 8000"));
