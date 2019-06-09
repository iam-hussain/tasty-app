module.exports = function (sequelize, DataTypes) {
    var RestaurantImage = sequelize.define('restaurant_image', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'id'
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        image_destination: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        mimetype: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    }, {
        underscored: true,
        timestamps: true,
        freezeTableName: true
    });

    RestaurantImage.associate = function (db) {
      //  console.log(db, " =====================")
       // db.RestaurantImage.belongsTo(db.Restaurant, {as : 'RestaurantImage'});
    }

    return RestaurantImage;
}