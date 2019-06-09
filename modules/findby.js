var path = require('path');
var generator = require('generate-password');
var jwt = require('jsonwebtoken');
import models from '../models/index';


var RestaurantByID = async function (id) {
  return await models.Restaurant.findOne({
    where: {
      id: id
    },
    // include: [{
    //   model: models.FoodMenu
    // }, {
    //   model: models.RestaurantImage
    // }]
  }).then(function (result) {
    console.log(result)
    return result;
  })
}


var CustomerByID = async function (id) {
  return await models.Customer.findOne({
    where: {
      id: id
    }
  }).then(function (result) {
    return result.dataValues;
  })
}


var FoodMenuByID = async function (id) {
  return await models.FoodMenu.findOne({
    where: {
      id: id
    },
    include: [{
      model: models.FoodImage
    }, {
      model: models.Restaurant,
      as : 'FoodMenuofRestaurant'
    }]
  }).then(function (result) {
    return result.dataValues;
  })
}


module.exports.RestaurantByID = RestaurantByID;
module.exports.CustomerByID = CustomerByID;
module.exports.FoodMenuByID = FoodMenuByID;