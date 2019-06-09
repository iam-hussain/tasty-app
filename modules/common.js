var path = require('path');
var generator = require('generate-password');
var jwt = require('jsonwebtoken');
import md5 from 'md5';
import models from '../models/index';
import {
    twilio
} from '../config/credentials'

var randomGenerator = function (Size) {
    return generator.generate({
        length: Size,
        uppercase: true,
        numbers: true,
        exclude: true,
        excludeSimilarCharacters: true,
    });
}

var sendSMS = function (to, body) {
    const client = require('twilio')(twilio.accountSid, twilio.authToken);

    return new Promise(function (resolve, reject) {
        try {
            client.messages
                .create({
                    body: body,
                    from: twilio.from,
                    to: to
                })
                .then(message => {
                    resolve(message)
                });


        } catch (err) {
            reject(err)
            return;
        }

    })


}


var generateOTP = function (otpLength) {
    var digits = '0123456789';
    var otp = '';
    for (let i = 1; i <= otpLength; i++) {
        var index = Math.floor(Math.random() * (digits.length));
        otp = otp + digits[index];
    }
    return otp;
}

var generateWebToken = function (token_data) {
    return new Promise(function (resolve, reject) {
        try {
            var token = jwt.sign(token_data, 'tasty')
            resolve(token)
        } catch (err) {
            reject(err)
            return;
        }

    })
}


var generateWebTokenwithExp = function (token_data, Min) {
    return new Promise(function (resolve, reject) {
        try {
            var token = jwt.sign({
                token_data,
                exp: Math.floor(Date.now() / 1000) + (60 * Min)
            }, 'tasty');
            resolve(token)
        } catch (err) {
            reject(err)
            return;
        }

    })
}

var verifyWebToken = function (otp_token){
    try {
        var Token_Decode = jwt.verify(otp_token, 'tasty');
        return Token_Decode.token_data
      } catch(err) {
        if (err.name == "TokenExpiredError") {
            return {
                error : "OTP Expired"
            } 
        } else {
            return {
                error : err.name
            }
        }
      }
}


var successResponse = function (res, data){
    res.json({
        success: true,
        error: null,
        data: data
    })
    res.end();
    return false;
}

var errorResponse = function (res, msg){
    res.json({
        success: false,
        error: {
            messages: msg
        }
    })
    res.end();
    return false;
}

var restaurantSessionSet = function (req, res, next, id){
    models.Restaurant.findOne({
        where: {id}
    }).then(async user => {
        if(user){
            req.session.userid = user.id;
            req.session.email = user.email;
            req.session.phone = user.phone;
            req.session.name = user.name;
            req.session.address = user.address;
            req.session.landMark = user.landMark;
            req.session.city = user.city;
            req.session.country = user.country;
            req.session.state = user.state;
            req.session.zip = user.zip;
            req.session.landline = user.landline;
            req.session.image = user.image;
            req.session.avatar = user.avatar;
            req.session.latitiude = user.latitiude;
            req.session.langitiude = user.langitiude;
            req.session.type = 'R';
            next()
        }else{
            errorResponse(res, "No user found")
        }

    })

}

var customerSessionSet = function (req, res, next, id){
    models.Customer.findOne({
        where: {id}
    }).then(async user => {
        if(user){
            req.session.userid = user.id;
            req.session.email = user.email;        
            req.session.phone = user.phone;
            req.session.first_name = user.first_name;
            req.session.last_name = user.last_name;
            req.session.avatar = user.avatar;
            req.session.image = user.image;
            req.session.image_destination = user.image_destination
            req.session.type = 'C';
            next()
        }else{
            errorResponse(res, "No user found")
        }

    })

}

var userAccess = async function (req, res, next) {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        try {
            var Token_Decode = jwt.verify(bearerToken, 'tasty');
            if(Token_Decode.type == 'Customer'){
                customerSessionSet(req, res, next, Token_Decode.customer_id)   
            }else{
                errorResponse(res, "User Type Error")
            }
        } catch (err) {
            errorResponse(res, err)
            }
    } else {
        errorResponse(res, "bearer Header Missing")
    }
}



var ownerAccess = async function (req, res, next) {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        try {
            var Token_Decode = jwt.verify(bearerToken, 'tasty');
            console.log(Token_Decode)
            if(Token_Decode.type == 'Restaurant'){
                restaurantSessionSet(req, res, next, Token_Decode.restaurant_id)
            }else{
                errorResponse(res, "User Type  Error")
            }
        } catch (err) {
            errorResponse(res, err)
            }
    } else {
        errorResponse(res, "bearer Header Missing")
    }
}


var deliveryAccess = async function (req, res, next) {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        try {
            var Token_Decode = jwt.verify(bearerToken, 'tasty');
            console.log(Token_Decode)
            if(Token_Decode.type == 'Restaurant'){
                restaurantSessionSet(req, res, next, Token_Decode.restaurant_id)
               
            }else if(Token_Decode.type == 'Customer'){
                customerSessionSet(req, res, next, Token_Decode.customer_id)
               
            }else{
                errorResponse(res, "User Type  Missing")
            }
        } catch (err) {
            errorResponse(res, err)
            }
    } else {
        errorResponse(res, "bearer Header Missing")
    }
}


var adminAccess = async function (req, res, next) {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        try {
            var Token_Decode = jwt.verify(bearerToken, 'tasty');
            console.log(Token_Decode)
            if(Token_Decode.type == 'Restaurant'){
                restaurantSessionSet(req, res, next, Token_Decode.restaurant_id)
               
            }else if(Token_Decode.type == 'Customer'){
                customerSessionSet(req, res, next, Token_Decode.customer_id)
               
            }else{
                errorResponse(res, "User Type  Missing")
            }
        } catch (err) {
            errorResponse(res, err)
            }
    } else {
        errorResponse(res, "bearer Header Missing")
    }
}

module.exports.randomGenerator = randomGenerator;
module.exports.sendSMS = sendSMS;
module.exports.generateOTP = generateOTP;
module.exports.generateWebToken = generateWebToken;
module.exports.generateWebTokenwithExp = generateWebTokenwithExp;
module.exports.verifyWebToken = verifyWebToken;
module.exports.successResponse = successResponse;
module.exports.errorResponse = errorResponse;
module.exports.restaurantSessionSet = restaurantSessionSet;
module.exports.customerSessionSet = customerSessionSet;
module.exports.ownerAccess = ownerAccess;
module.exports.userAccess = userAccess;
module.exports.deliveryAccess = deliveryAccess;
module.exports.adminAccess = adminAccess;