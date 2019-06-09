module.exports = function (sequelize, DataTypes) {
    var Cart = sequelize.define('cart', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'id'
        }
    }, {
        underscored: true,
        timestamps: true,
        freezeTableName: true
    });

    Cart.associate = function (db) {
        // db.Customer.belongsToMany(db.FoodMenu, {
        //     through: db.Cart
        // });
        // db.FoodMenu.belongsToMany(db.Customer, {
        //     through: db.Cart
        // });
    }

    return Cart;
}