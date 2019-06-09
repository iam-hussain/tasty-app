var express = require("express");
var router = express.Router();
var fs = require("fs");
var md5 = require("md5");
var path = require("path");
var express = require("express");
const Sequelize = require("sequelize");
import models from '../models/index';

import {twilio} from '../config/credentials'

router.get("/", function (req, res, next) {
    res.json({Message :"Welcome to TastyTongue", twilio : twilio.authToken})
    res.end();
    return false;
})



module.exports = router;