const express = require("express");
const router = express.Router();
const joi = require("@hapi/joi");
const models = require("../models/users");

router.post("/login", async (req, res) => {
  try {
    const schema = joi.object().keys({
      email: joi.string().email().required(),
      password: joi.string().min(6).max(20).required(),
    });
    const result = schema.validate(req.body);
    if (result.error) {
      throw result.error.details[0].message;
    }
    let checkUserLogin = await models.verifyUser(result.value);
    if (checkUserLogin.error) {
      throw checkUserLogin.message;
    }
    // set session for the logged in user
    req.session.user = {
      name: checkUserLogin.data.name,
      email: checkUserLogin.data.email,
    };
    res.json(checkUserLogin);
  } catch (e) {
    res.json({ error: true, message: e });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const schema = joi.object().keys({
      name: joi.string().regex(/^[a-zA-Z0-9]{8,30}$/).min(3).max(45).required(),
      dob: joi.date(),
      cob: joi.string().min(3).max(45),
      gender: joi.string().min(3).max(45),
      civilState: joi.string().min(3).max(45),
      job: joi.string().min(3).max(45),
      hobby: joi.string().min(3).max(45),
      outdoor: joi.string().min(3).max(45),
      salary: joi.number(),
      email: joi.string().email().required(),
      password: joi.string().min(6).max(20).required(),
    });
    const result = schema.validate(req.body);
    if (result.error) {
      throw result.error.details[0].message;
    }
    let addUserResponse = await models.addUser(result.value);
    res.json(addUserResponse);
  } catch (e) {
    res.json({ error: true, message: e });
  }
});

router.get("/logout", (req, res) => {
  if (req.session.user) {
    req.session.destroy();
  }
  res.redirect("/");
});

module.exports = router;
