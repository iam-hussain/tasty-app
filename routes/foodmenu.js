import express from 'express';
var router = express.Router();
import models from '../models/index';
import {
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


router.post("/byID",async function (req, res, next) {
    await models.FoodMenu.findOne({
        where: {
            id: req.body.id
        },
        include: [{
            model: models.Restaurant,
            as: "FoodMenuofRestaurant"
        }]
    }).then(async foodmenu => {
        successResponse(res, foodmenu)
    })
})

router.post("/all",async function (req, res, next) {
    await models.FoodMenu.findAll({
        include: [{
            model: models.Restaurant,
            as: "FoodMenuofRestaurant"
        }, {
            model: models.FoodImage
        }]
    }).then(async foodmenu => {
        successResponse(res, foodmenu)
    })
})




router.post("/add",async function (req, res, next) {
    await models.FoodMenu.create({
        title: req.body.title,
        notes: req.body.notes,
        amount: req.body.amount,
        image: req.body.image,
        avatar: req.body.avatar,
        avilableStatus: req.body.avilableStatus,
        morningStatus: req.body.morningStatus,
        launchStatus: req.body.launchStatus,
        dinnerStatus: req.body.dinnerStatus,
        category: req.body.category,
        foodType: req.body.foodType,
    }).then(async foodmenu => {
        if (foodmenu) {

            var user = await RestaurantByID(req.body.restaurant_id)
           // console.log(foodmenu, " ========================")
            return user.setFoodMenu(foodmenu).then(() => {
                successResponse(res, foodmenu)
            })
        } else {
            errorResponse(res, "Image upload error")
        }
    })
})


router.get("/", async function (req, res, next) {
    var New = await models.Restaurant.findAll({
        include: [{
            model: models.FoodMenu
        }]
    })
    res.json(New);
    res.end();
    return false;
})


module.exports = router;