var path = require('path');
var generator = require('generate-password');
import models from '../models/index';
module.exports = {

    customerEmail: async function (email) {
        return await models.Customer.findAndCountAll({
            where: {
                email: email
            }
        }).then(result => {
            return result.count
          });
    },
    customerPhone: async function (phone) {
       return await models.Customer.findAndCountAll({
            where: {
                phone: phone
            }
        }).then(result => {
           return result.count
        });
    },
    restaurantEmail: async function (email) {
        return await models.Restaurant.findAndCountAll({
            where: {
                email: email
            }
        }).then(result => {
            return result.count
          });
    },
    restaurantPhone: async function (phone) {
       return await models.Restaurant.findAndCountAll({
            where: {
                phone: phone
            }
        }).then(result => {
           return result.count
        });
    }
};