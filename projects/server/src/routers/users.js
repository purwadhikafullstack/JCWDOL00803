const express = require("express");
const route = express.Router();
const { usersController } = require("../controllers");
const { readToken } = require("../config/encript");
const { uploader } = require("../config/uploader");

route.get("/", usersController.getUsersData);
route.post("/regis", usersController.regis);
route.post("/login", usersController.login);
route.get("/keep", readToken, usersController.keepLogin);
route.patch("/profile", readToken, usersController.editProfile);
route.patch(
  "/profilepicture",
  readToken,
  uploader("/imgProfile", "IMGPROFILE").array("images", 1),
  usersController.profilePicture
);

module.exports = route;
