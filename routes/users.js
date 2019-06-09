var express = require("express");
var router = express.Router();
var fs = require("fs");
var md5 = require("md5");
var path = require("path");
const {
    body,
    validationResult
} = require('express-validator/check');
const {
    sanitizeBody
} = require('express-validator/filter');

import models from '../models/index';


router.post("/adduser",[body('firstName').not().isEmpty().withMessage('firstName require').isLength({
    min: 3,
    max: 20
}).withMessage('firstName should contain min 3 letters to maximum 20 letters').isAlpha().withMessage('firstName contain alpha only'),
body('lastName').not().isEmpty().withMessage('lastName require').isLength({
    min: 3,
    max: 20
}).withMessage('lastName should contain min 3 letters to maximum 20 letters').isAlpha().withMessage('lastName contain alpha only'),
body('email').trim().isEmail().withMessage('hotel email address required'),
body('mobileNumber').not().isEmpty().withMessage('mobileNumber reqiured').isLength({
    min: 10,
    max: 10
}).withMessage('mobileNumber contain 10 numbers only'),
body('userType').not().isEmpty().withMessage('userType reqiured').isLength({
    min: 1,
    max: 1
}).withMessage('userType reqiure'),
body('password').not().isEmpty().withMessage('password is required'),
sanitizeBody('firstName').trim().escape(),
sanitizeBody('lastName').trim().escape(),
sanitizeBody('email').trim().escape(),
sanitizeBody('mobileNumber').trim().escape(),
sanitizeBody('userType').trim().escape()], function (req, res, next) {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).send({
            error: errors.array()
        });
    }


    res.json({
        result: req.body
    })
    res.end();
    return false;


})



module.exports = router;