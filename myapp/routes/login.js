const express = require('express');
var router = express.Router();
const AuthController = require("./../controllers/AuthController");

//login
router.post('/', (req, res, next) => {
  AuthController.login(req, res)
});

module.exports = router;
