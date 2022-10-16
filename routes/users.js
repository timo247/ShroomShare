import express from "express";
import { config as c } from "../config.js";
const router = express.Router();

// Retrieves all users
router.get(`${c.apiName}/users`, function (req, res, next) {
  res.send("Got a response from the users route");
});

// Retrieves a specif user
router.get(`${c.apiName}/users/:id`, function (req, res, next) {
  res.send("Got a response from the users route");
});

// Create a new user
router.post(`${c.apiName}/users`, function (req, res, next) {
  res.send("Got a response from the users route");
});

// Modify existing user
router.patch(`${c.apiName}/users/:id`, function (req, res, next) {
  res.send("Got a response from the users route");
});

// Delete an existing user
router.delete(`${c.apiName}/users/:id`, function (req, res, next) {
  res.send("Got a response from the users route");
});

export default router;
