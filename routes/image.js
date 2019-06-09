import express from 'express';
var router = express.Router();
import fs from 'fs';
import md5 from 'md5';
import path from 'path';
import multer from 'multer';
import models from '../models/index';
import {
    successResponse,
    errorResponse,
    ownerAccess,
    userAccess,
    deliveryAccess,
    customerSessionSet,
} from '../modules/common';

import {
    RestaurantByID,
    CustomerByID,
    FoodMenuByID
} from '../modules/findby';

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname == 'profile_image') {
            cb(null, 'uploads/profile')
        } else if (file.fieldname == "restaurant_image") {
            cb(null, 'uploads/restaurant')
        } else if (file.fieldname == 'food_image') {
            cb(null, 'uploads/food')
        } else {
            cb(null, 'uploads/others')
        }

    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})

var upload = multer({
    storage: storage
});



router.post('/upload/profile_image', userAccess, upload.single('profile_image'), async function (req, res, next) {
    console.log("  ==========qqqqqqqqqqqqqqq=== ")
    await models.Customer.update({
        avatar: req.file.originalname,
        image: req.file.filename,
        image_destination: req.file.destination
    }, {
        where: {
            id: req.session.userid
        }
    }).then(async updated => {
        if (updated) {
            if (req.session.image && req.session.image_destination && fs.existsSync(req.session.image_destination + "/" + req.session.image)) {
                fs.unlinkSync(req.session.image_destination + "/" + req.session.image)
            }
            req.session.avatar = req.file.originalname;
            req.session.image = req.file.filename;
            req.session.image_destination = req.file.destination;
            var user = await CustomerByID(req.session.userid)
            successResponse(res, user)
        } else {
            errorResponse(res, "Image upload error")
        }
    })
})

router.post('/upload/restaurant_image', ownerAccess, upload.array('restaurant_image', 12), async function (req, res, next) {
    if (req.files) {
        var user = await RestaurantByID(req.session.userid)
        await req.files.map(picture => {
            return models.RestaurantImage.create({
                avatar: picture.originalname,
                image: picture.filename,
                image_destination: picture.destination,
                mimetype: picture.mimetype,
                size: picture.size,
            }).then(async created => {
                if (created) {
                    console.log(created.prototype, '================ssssssssssssssssssssssss')
                    var Restaurant = await RestaurantByID(req.session.userid)
        
                    return created.addRestaurant(Restaurant).then(() => {
                        return created.hasUser(Restaurant).then(result => {
                          // result would be true
                        })
                //       })
                //    // console.log(JSON.stringify(created), " ============================")
                //     return user.addRestimage(created).then(() => {
                //         return true
                  })
                } else {
                    errorResponse(res, "Image upload error")
                }
            })
        });
        successResponse(res, user)
    } else {
        errorResponse(res, "Image not uploaded")
    }
})

router.post('/upload/food_image', ownerAccess, upload.array('food_image', 12), async function (req, res, next) {
    var food = await FoodMenuByID(req.body.food_id)
    if (req.files && food) {
        await req.files.map(picture => {
            return models.FoodImage.create({
                avatar: picture.originalname,
                image: picture.filename,
                image_destination: picture.destination,
                mimetype: picture.mimetype,
                size: picture.size,
            }).then(async created => {
                if (created) {
                    return created.addImageofFoodMenu(food).then(() => {
                        return true
                    })
                } else {
                    errorResponse(res, "Image upload error")
                }
            })
        });
        successResponse(res, food)
    } else {
        errorResponse(res, "Image not uploaded")
    }
})


module.exports = router;