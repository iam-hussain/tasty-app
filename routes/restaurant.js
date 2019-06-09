import express from 'express';
var router = express.Router();
import fs from 'fs';
import md5 from 'md5';
import models from '../models/index';
import {
    randomGenerator,
    sendSMS,
    generateOTP,
    generateWebToken,
    generateWebTokenwithExp,
    verifyWebToken,
    successResponse,
    errorResponse,
    ownerAccess,
    userAccess,
    deliveryAccess,
} from '../modules/common';

import {
    RestaurantByID,
    CustomerByID
} from '../modules/findby';

import {
    twilio
} from '../config/credentials'
import validation from '../modules/validation';
var Sequelize = require('sequelize');
const Op = Sequelize.Op;


router.get("/", function (req, res, next) {
    res.send("Welcome to TastyTongue")
    res.end();
    return false;
})

router.post("/all", ownerAccess, async function (req, res, next) {
    await models.Restaurant.findAll({
        include: [{
            model: models.FoodMenu
        },{
            model: models.RestaurantImage
        }]
    }).then(async restaurant => {
        successResponse(res, restaurant)
    })
})

router.post("/byID", ownerAccess, async function (req, res, next) {
    await models.Restaurant.findOne({
        where: {
            id: req.body.id
        },
        include: [{
            model: models.FoodMenu
        }]
    }).then(async restaurant => {
        successResponse(res, restaurant)
    })
})

router.post("/create", async function (req, res, next) {

    console.log(req.body.password, '==================')

    req.body.salt = await randomGenerator(10);
    req.body.otp_verify = false;

    req.body.password_md5 = md5(md5(req.body.password) + req.body.salt);
    console.log(req.body.password_md5, '==================')
    if (await validation.customerEmail(req.body.email) || await validation.customerPhone(req.body.phone)) {
        res.json({
            success: false,
            error: {
                messages: "Data already exist",
                email: await validation.customerEmail(req.body.email) ? req.body.email : null,
                phone: await validation.customerPhone(req.body.phone) ? req.body.phone : null,
            }
        })
        res.end();
        return false;
    }
    await models.Restaurant.create({
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password_md5,
        salt: req.body.salt,
        otp_verify: false,
        name: req.body.name,
        address: req.body.address,
        landMark: req.body.landMark,
        city: req.body.city,
        country: req.body.country,
        state: req.body.state,
        zip: req.body.zip,
        landline: req.body.landline,
        image: req.body.image,
        avatar: req.body.avatar,
        latitiude: req.body.latitiude,
        langitiude: req.body.langitiude
    }).then(async restaurant => {
        var OTP_is = generateOTP(4)
        var OTP_String = "The One Time Password for Tasty Toungue is " + OTP_is + " (Will expire in " + twilio.exp + " Min)"
        var OTP_return = sendSMS(req.body.phone, OTP_String);
        var token_data = {
            otp: OTP_is,
            restaurant_id: restaurant.id,
            phone: req.body.phone,
            type: "Restaurant"
        }
        var Token_return = await generateWebTokenwithExp(token_data, twilio.exp);
        res.json({
            success: true,
            error: null,
            data: {
                otp_token: Token_return,
                OTP_is: OTP_is
            }
        })
        res.end();
        return false;
    }).catch(function (err) {

        res.json({
            success: false,
            error: {
                messages: err.stack
            }
        })
        res.end();
        return false;
    })
})

router.post("/otp_verify", async function (req, res, next) {
    var Token_verify = await verifyWebToken(req.body.otp_token)
    if (Token_verify.error) {
        res.json({
            success: false,
            error: {
                message: Token_verify.error
            }
        })
        res.end();
        return false;
    }
    if (Token_verify.otp == req.body.otp) {
        models.Restaurant.update({
                otp_verify: true
            }, {
                where: {
                    id: Token_verify.restaurant_id,
                    phone: Token_verify.phone
                }
            })
            .then(async function (user) {
                var token_data = {
                    restaurant_id: Token_verify.restaurant_id,
                    type: "Restaurant"
                }
                var Token_return = await generateWebToken(token_data);
                var UserData = await RestaurantByID(Token_verify.restaurant_id);
                res.json({
                    success: true,
                    error: null,
                    data: {
                        login_token: Token_return,
                        user: UserData
                    }
                })
                res.end();
                return false;

            })
    }
})

router.post("/change_number", async function (req, res, next) {
    var Token_verify = await verifyWebToken(req.body.otp_token)
    if (Token_verify.error) {
        res.json({
            success: false,
            error: {
                message: Token_verify.error
            }
        })
        res.end();
        return false;
    }
    models.Restaurant.update({
            otp_verify: false,
            phone: req.body.phone
        }, {
            where: {
                id: Token_verify.restaurant_id
            }
        })
        .then(async function (user) {
            var OTP_is = generateOTP(4)
            var OTP_String = "The One Time Password for Tasty Toungue is " + OTP_is + " (Will expire in " + twilio.exp + " Min)"
            var OTP_return = sendSMS(req.body.phone, OTP_String);
            var token_data = {
                otp: OTP_is,
                restaurant_id: Token_verify.restaurant_id,
                phone: req.body.phone
            }
            var Token_return = await generateWebTokenwithExp(token_data, twilio.exp);
            res.json({
                success: true,
                error: null,
                data: {
                    otp_token: Token_return,
                    OTP_is: OTP_is
                }
            })
            res.end();
            return false;

        }).catch(function (err) {

            res.json({
                success: false,
                error: {
                    messages: err.stack
                }
            })
            res.end();
            return false;
        })

})

router.post("/login", async function (req, res, next) {
    models.Restaurant.findOne({
        where: {
            [Op.or]: [{
                email: req.body.user
            }, {
                phone: req.body.user
            }]
        }
    }).then(async login => {
        if (login) {
            var password_md5 = md5(md5(req.body.password) + login.salt);
            if (password_md5 == login.password) {
                var token_data = {
                    restaurant_id: login.id,
                    type: "Restaurant"
                }
                var Token_return = await generateWebToken(token_data);
                if(login.otp_verify){
                    successResponse(res, {
                        login_token: Token_return
                    });
                }else{
                    errorResponse(res, "Phone number not verified")    
                }
                

            } else {
                errorResponse(res, "Invalid password")
            }
        } else {
            errorResponse(res, "Invalid email or phone number")
        }
    })

})



module.exports = router;